/**
 * convertDocPdfObjects.js
 * The object layer of the PDF reader: a tokenizer for PDF syntax, an object
 * table built by scanning the file (so damaged xref tables don't matter, and
 * compressed object streams are unpacked too), and stream filters.
 *
 * Value shapes: numbers, booleans, null, strings as Uint8Array, names as
 * { name }, arrays, dictionaries as plain objects (keys without "/"),
 * references as { ref, gen }, operators as { op }, streams as { dict, data }.
 */
import { unzlibSync, inflateSync } from "fflate";

// ── Byte classes ──
const WHITESPACE = new Set([0x00, 0x09, 0x0a, 0x0c, 0x0d, 0x20]);
const DELIMITERS = new Set([0x28, 0x29, 0x3c, 0x3e, 0x5b, 0x5d, 0x7b, 0x7d, 0x2f, 0x25]);
const CH = {
  PERCENT: 0x25, LPAREN: 0x28, RPAREN: 0x29, LT: 0x3c, GT: 0x3e, LBRACKET: 0x5b,
  RBRACKET: 0x5d, LBRACE: 0x7b, RBRACE: 0x7d, SLASH: 0x2f, BACKSLASH: 0x5c,
  CR: 0x0d, LF: 0x0a, HASH: 0x23, TILDE: 0x7e, LOWER_Z: 0x7a,
};
const STRING_ESCAPES = { n: 0x0a, r: 0x0d, t: 0x09, b: 0x08, f: 0x0c };
const NUMBER_START = /[+\-.0-9]/;
const MAX_NESTING = 200;
const OCTAL_DIGITS = 3;
const ASCII85_ZERO_RUN = 4;
const ASCII85_BASE = 85;
const ASCII85_OFFSET = 33;
const ASCII85_GROUP = 5;
const OBJECT_HEADER = /(\d+)[\0\t\n\f\r ]+(\d+)[\0\t\n\f\r ]+obj\b/g;
const ENDSTREAM = "endstream";
const LATIN1 = new TextDecoder("latin1");
const ASCII = new TextDecoder("ascii");

const isNameValue = (v, name) => v && typeof v === "object" && v.name === name;

/**
 * Tokenizer over a byte array. readObject() returns the next complete value.
 * @param {Uint8Array} bytes
 * @param {number} [start]
 */
export function createLexer(bytes, start = 0) {
  const lex = { bytes, pos: start };

  const skipSpace = () => {
    while (lex.pos < bytes.length) {
      const c = bytes[lex.pos];
      if (WHITESPACE.has(c)) {
        lex.pos++;
        continue;
      }
      if (c !== CH.PERCENT) return;
      while (lex.pos < bytes.length && bytes[lex.pos] !== CH.LF && bytes[lex.pos] !== CH.CR) lex.pos++;
    }
  };

  const readRegular = () => {
    const from = lex.pos;
    while (lex.pos < bytes.length && !WHITESPACE.has(bytes[lex.pos]) && !DELIMITERS.has(bytes[lex.pos])) lex.pos++;
    return ASCII.decode(bytes.subarray(from, lex.pos));
  };

  const readLiteralString = () => {
    lex.pos++; // (
    const out = [];
    let depth = 1;
    while (lex.pos < bytes.length) {
      const c = bytes[lex.pos++];
      if (c === CH.LPAREN) depth++;
      else if (c === CH.RPAREN && --depth === 0) break;
      if (c !== CH.BACKSLASH) {
        out.push(c);
        continue;
      }
      const e = bytes[lex.pos++];
      const named = STRING_ESCAPES[String.fromCharCode(e)];
      if (named !== undefined) out.push(named);
      else if (e === CH.CR) {
        if (bytes[lex.pos] === CH.LF) lex.pos++;
      } else if (e === CH.LF) {
        // line continuation
      } else if (e >= 0x30 && e <= 0x37) {
        let oct = e - 0x30;
        for (let k = 1; k < OCTAL_DIGITS && bytes[lex.pos] >= 0x30 && bytes[lex.pos] <= 0x37; k++) {
          oct = oct * 8 + (bytes[lex.pos++] - 0x30);
        }
        out.push(oct & 0xff);
      } else out.push(e);
    }
    return Uint8Array.from(out);
  };

  const readHexString = () => {
    lex.pos++; // <
    let hex = "";
    while (lex.pos < bytes.length && bytes[lex.pos] !== CH.GT) {
      const c = bytes[lex.pos++];
      if (!WHITESPACE.has(c)) hex += String.fromCharCode(c);
    }
    lex.pos++; // >
    if (hex.length % 2) hex += "0";
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16) || 0;
    return out;
  };

  const readName = () => {
    lex.pos++; // /
    const raw = readRegular();
    return { name: raw.replace(/#([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16))) };
  };

  /** A number, or "int int R" as a reference. */
  const readNumber = () => {
    const n = Number(readRegular()) || 0;
    if (!Number.isInteger(n) || n < 0) return n;
    const save = lex.pos;
    skipSpace();
    const gen = readRegular();
    if (/^\d+$/.test(gen)) {
      skipSpace();
      if (bytes[lex.pos] === 0x52 && (lex.pos + 1 >= bytes.length || WHITESPACE.has(bytes[lex.pos + 1]) || DELIMITERS.has(bytes[lex.pos + 1]))) {
        lex.pos++;
        return { ref: n, gen: Number(gen) };
      }
    }
    lex.pos = save;
    return n;
  };

  /** @returns {any} the next value, or undefined at the end */
  lex.readObject = (depth = 0) => {
    skipSpace();
    if (lex.pos >= bytes.length || depth > MAX_NESTING) return undefined;
    const c = bytes[lex.pos];
    if (c === CH.LBRACKET) {
      lex.pos++;
      const arr = [];
      for (;;) {
        skipSpace();
        if (lex.pos >= bytes.length) return arr;
        if (bytes[lex.pos] === CH.RBRACKET) {
          lex.pos++;
          return arr;
        }
        const v = lex.readObject(depth + 1);
        if (v === undefined) return arr;
        arr.push(v);
      }
    }
    if (c === CH.LT && bytes[lex.pos + 1] === CH.LT) {
      lex.pos += 2;
      const dict = {};
      for (;;) {
        skipSpace();
        if (lex.pos >= bytes.length) return dict;
        if (bytes[lex.pos] === CH.GT && bytes[lex.pos + 1] === CH.GT) {
          lex.pos += 2;
          return dict;
        }
        const key = lex.readObject(depth + 1);
        if (key === undefined) return dict;
        if (!key || typeof key.name !== "string") continue; // junk inside a dict
        dict[key.name] = lex.readObject(depth + 1);
      }
    }
    if (c === CH.LT) return readHexString();
    if (c === CH.LPAREN) return readLiteralString();
    if (c === CH.SLASH) return readName();
    if (c === CH.RBRACKET || c === CH.RPAREN || c === CH.GT || c === CH.LBRACE || c === CH.RBRACE) {
      lex.pos++;
      return { op: String.fromCharCode(c) };
    }
    if (NUMBER_START.test(String.fromCharCode(c))) return readNumber();
    const word = readRegular();
    if (!word) {
      lex.pos++;
      return { op: "" };
    }
    if (word === "true") return true;
    if (word === "false") return false;
    if (word === "null") return null;
    return { op: word };
  };
  lex.skipSpace = skipSpace;
  return lex;
}

// ==========================================
// FILTERS
// ==========================================

function inflate(data) {
  try {
    return unzlibSync(data);
  } catch {
    return inflateSync(data); // a raw deflate stream with no zlib header
  }
}

function asciiHexDecode(data) {
  const text = ASCII.decode(data).replace(/>[\s\S]*$/, "").replace(/\s+/g, "");
  const out = new Uint8Array(Math.ceil(text.length / 2));
  for (let i = 0; i < out.length; i++) out[i] = parseInt((text.substr(i * 2, 2) + "0").slice(0, 2), 16) || 0;
  return out;
}

function ascii85Decode(data) {
  const out = [];
  let group = [];
  const flush = (count) => {
    let value = 0;
    for (let i = 0; i < ASCII85_GROUP; i++) value = value * ASCII85_BASE + (group[i] ?? ASCII85_BASE - 1);
    for (let i = 0; i < count; i++) out.push((value >>> (24 - i * 8)) & 0xff);
    group = [];
  };
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    if (c === CH.TILDE) break;
    if (WHITESPACE.has(c)) continue;
    if (c === CH.LOWER_Z && group.length === 0) {
      for (let k = 0; k < ASCII85_ZERO_RUN; k++) out.push(0);
      continue;
    }
    group.push(c - ASCII85_OFFSET);
    if (group.length === ASCII85_GROUP) flush(ASCII85_ZERO_RUN);
  }
  if (group.length > 1) flush(group.length - 1);
  return Uint8Array.from(out);
}

const FILTERS = {
  FlateDecode: inflate,
  Fl: inflate,
  ASCIIHexDecode: asciiHexDecode,
  AHx: asciiHexDecode,
  ASCII85Decode: ascii85Decode,
  A85: ascii85Decode,
};

// ==========================================
// DOCUMENT
// ==========================================

/**
 * Opens a PDF: indexes every object in the file and resolves on demand.
 * @param {Uint8Array} bytes
 */
export function openPdf(bytes) {
  const text = LATIN1.decode(bytes);
  /** object number -> byte offset of its "N G obj" header's end */
  const offsets = new Map();
  OBJECT_HEADER.lastIndex = 0;
  let m;
  while ((m = OBJECT_HEADER.exec(text)) !== null) offsets.set(Number(m[1]), m.index + m[0].length);
  const cache = new Map();
  /** objects living inside compressed object streams */
  const packed = new Map();

  const doc = { text, bytes };

  /** Follows references until a direct value. */
  doc.resolve = (value, seen = 0) => {
    if (!value || typeof value !== "object" || value.ref === undefined || seen > MAX_NESTING) return value;
    return doc.resolve(doc.get(value.ref), seen + 1);
  };

  doc.get = (id) => {
    if (cache.has(id)) return cache.get(id);
    cache.set(id, null); // guards against reference loops
    let value = null;
    if (offsets.has(id)) value = parseAt(offsets.get(id));
    else if (packed.has(id)) value = packed.get(id);
    cache.set(id, value);
    return value;
  };

  const parseAt = (offset) => {
    const lex = createLexer(bytes, offset);
    const value = lex.readObject();
    lex.skipSpace();
    const keyword = ASCII.decode(bytes.subarray(lex.pos, lex.pos + 6));
    if (keyword !== "stream" || !value || typeof value !== "object") return value ?? null;
    let start = lex.pos + 6;
    if (bytes[start] === CH.CR) start++;
    if (bytes[start] === CH.LF) start++;
    return { dict: value, data: bytes.subarray(start, streamEnd(value, start)) };
  };

  /** Where stream data ends: /Length when it checks out, else the endstream keyword. */
  const streamEnd = (dict, start) => {
    const length = doc.resolve(dict.Length);
    if (Number.isInteger(length) && length >= 0 && start + length <= bytes.length) {
      const after = text.substr(start + length, 32);
      if (/^\s*endstream/.test(after)) return start + length;
    }
    const end = text.indexOf(ENDSTREAM, start);
    if (end < 0) return bytes.length;
    let stop = end;
    if (bytes[stop - 1] === CH.LF) stop--;
    if (bytes[stop - 1] === CH.CR) stop--;
    return stop;
  };

  /**
   * Decoded bytes of a stream, or null when a filter isn't supported.
   * @param {{ dict: object, data: Uint8Array }} stream
   */
  doc.streamData = (stream) => {
    if (!stream || !stream.data) return null;
    const filter = doc.resolve(stream.dict.Filter);
    const names = (Array.isArray(filter) ? filter : filter ? [filter] : []).map((f) => doc.resolve(f)?.name);
    let data = stream.data;
    for (const name of names) {
      const decode = FILTERS[name];
      if (!decode) return null;
      try {
        data = decode(data);
      } catch {
        return null;
      }
    }
    return data;
  };

  // Unpack object streams (PDF 1.5+ keeps most dictionaries in them)
  for (const id of offsets.keys()) {
    const at = offsets.get(id);
    if (!/\/Type\s*\/ObjStm/.test(text.substr(at, 400))) continue;
    const stream = doc.get(id);
    const data = stream && doc.streamData(stream);
    if (!data) continue;
    const n = doc.resolve(stream.dict.N) || 0;
    const first = doc.resolve(stream.dict.First) || 0;
    const header = createLexer(data);
    const entries = [];
    for (let i = 0; i < n; i++) entries.push([header.readObject(), header.readObject()]);
    for (const [num, off] of entries) {
      if (!Number.isInteger(num) || offsets.has(num) || packed.has(num)) continue;
      packed.set(num, createLexer(data, first + off).readObject() ?? null);
    }
  }

  doc.isEncrypted = /\/Encrypt\s*(\d+\s+\d+\s+R|<<)/.test(text);

  /** The document catalog: the last /Root reference wins (incremental saves). */
  doc.catalog = () => {
    const roots = [];
    const rootRef = /\/Root\s+(\d+)\s+\d+\s+R/g;
    let r;
    while ((r = rootRef.exec(text)) !== null) roots.push(Number(r[1]));
    for (let i = roots.length - 1; i >= 0; i--) {
      const cat = doc.get(roots[i]);
      if (cat && typeof cat === "object" && cat.Pages) return cat;
    }
    for (const id of [...offsets.keys(), ...packed.keys()]) {
      const v = doc.get(id);
      if (v && isNameValue(v.Type, "Catalog")) return v;
    }
    return null;
  };

  return doc;
}
