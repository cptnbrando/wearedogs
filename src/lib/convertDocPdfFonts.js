/**
 * convertDocPdfFonts.js
 * Font handling for the PDF reader: turns the bytes of a text-showing
 * operator into characters and advance widths. ToUnicode CMaps win; simple
 * fonts fall back to their /Encoding (+ /Differences glyph names); widths come
 * from /Widths, /W, or the Helvetica metrics for the standard 14 fonts.
 */
import { createLexer } from "./convertDocPdfObjects.js";
import { helveticaWidth } from "./convertDocPdf.js";

const CP1252 = new TextDecoder("windows-1252");
const MAC_ROMAN = (() => {
  try {
    return new TextDecoder("macintosh");
  } catch {
    return CP1252;
  }
})();
const UTF16BE = new TextDecoder("utf-16be");

const BYTE_RANGE = 256;
const MAX_RANGE = 65536; // longest bfrange / W run expanded
const DEFAULT_CID_WIDTH = 1000;
const GLYPH_SPACE = 0.001;
const SPACE_CODE = 32;
const FLAG_ITALIC = 1 << 6;
const FLAG_FORCE_BOLD = 1 << 18;
const BOLD_WEIGHT = 600;
const BOLD_NAME = /bold|black|heavy|semibold|demi/i;
const ITALIC_NAME = /italic|oblique/i;
const SUBSET_PREFIX = /^[A-Z]{6}\+/;
// Glyph names whose character isn't simply the name itself
const GLYPH_NAMES = {
  space: " ", exclam: "!", quotedbl: '"', numbersign: "#", dollar: "$", percent: "%",
  ampersand: "&", quotesingle: "'", quoteright: "’", parenleft: "(", parenright: ")",
  asterisk: "*", plus: "+", comma: ",", hyphen: "-", minus: "−", period: ".", slash: "/",
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7",
  eight: "8", nine: "9", colon: ":", semicolon: ";", less: "<", equal: "=", greater: ">",
  question: "?", at: "@", bracketleft: "[", backslash: "\\", bracketright: "]",
  asciicircum: "^", underscore: "_", grave: "`", quoteleft: "‘", braceleft: "{",
  bar: "|", braceright: "}", asciitilde: "~", bullet: "•", endash: "–",
  emdash: "—", quotedblleft: "“", quotedblright: "”", quotesinglbase: "‚",
  quotedblbase: "„", ellipsis: "…", fi: "fi", fl: "fl", ff: "ff", ffi: "ffi",
  ffl: "ffl", nbspace: " ", copyright: "©", registered: "®",
  trademark: "™", degree: "°", section: "§", paragraph: "¶",
  dagger: "†", daggerdbl: "‡", Euro: "€", periodcentered: "·",
  dotlessi: "ı", germandbls: "ß", AE: "Æ", ae: "æ", OE: "Œ",
  oe: "œ", Oslash: "Ø", oslash: "ø", multiply: "×", divide: "÷",
};
const ACCENTS = {
  acute: "́", grave: "̀", circumflex: "̂", dieresis: "̈", tilde: "̃",
  ring: "̊", cedilla: "̧", caron: "̌",
};
const ACCENTED_NAME = /^([A-Za-z])(acute|grave|circumflex|dieresis|tilde|ring|cedilla|caron)$/;
const UNI_NAME = /^uni([0-9A-Fa-f]{4,})$/;
const U_NAME = /^u([0-9A-Fa-f]{4,6})$/;

const nameOf = (v) => (v && typeof v === "object" ? v.name : undefined);

/** Unicode text for a glyph name, or "" when unknown. */
function glyphToUnicode(name) {
  if (!name) return "";
  const base = name.split(".")[0];
  if (GLYPH_NAMES[base] !== undefined) return GLYPH_NAMES[base];
  if (base.length === 1) return base;
  const uni = UNI_NAME.exec(base);
  if (uni) {
    let out = "";
    for (let i = 0; i + 4 <= uni[1].length; i += 4) out += String.fromCharCode(parseInt(uni[1].substr(i, 4), 16));
    return out;
  }
  const u = U_NAME.exec(base);
  if (u) return String.fromCodePoint(parseInt(u[1], 16));
  const accented = ACCENTED_NAME.exec(base);
  if (accented) return (accented[1] + ACCENTS[accented[2]]).normalize("NFC");
  return "";
}

/** Decodes a big-endian byte run into an integer code. */
const codeOf = (bytes, from, len) => {
  let code = 0;
  for (let i = 0; i < len; i++) code = code * BYTE_RANGE + bytes[from + i];
  return code;
};

/**
 * Parses a ToUnicode CMap.
 * @returns {{ map: Map<number, string>, lengths: number[] }}
 */
function parseCMap(data) {
  const map = new Map();
  const lengths = new Set();
  const lex = createLexer(data);
  const operands = [];
  let mode = "";
  for (let v = lex.readObject(); v !== undefined; v = lex.readObject()) {
    if (!(v && v.op !== undefined)) {
      operands.push(v);
      continue;
    }
    const op = v.op;
    if (op === "begincodespacerange" || op === "beginbfchar" || op === "beginbfrange") mode = op;
    else if (op === "endcodespacerange") {
      for (let i = 0; i + 1 < operands.length; i += 2) if (operands[i] instanceof Uint8Array) lengths.add(operands[i].length);
      mode = "";
    } else if (op === "endbfchar") {
      for (let i = 0; i + 1 < operands.length; i += 2) {
        const src = operands[i];
        const dst = operands[i + 1];
        if (src instanceof Uint8Array && dst instanceof Uint8Array) {
          map.set(codeOf(src, 0, src.length), UTF16BE.decode(dst));
          lengths.add(src.length);
        }
      }
      mode = "";
    } else if (op === "endbfrange") {
      for (let i = 0; i + 2 < operands.length; i += 3) bfRange(map, lengths, operands[i], operands[i + 1], operands[i + 2]);
      mode = "";
    }
    if (op.startsWith("begin") || op.startsWith("end")) operands.length = 0;
    else if (!mode) operands.length = 0;
  }
  return { map, lengths: [...lengths].sort((a, b) => a - b) };
}

function bfRange(map, lengths, lo, hi, dst) {
  if (!(lo instanceof Uint8Array) || !(hi instanceof Uint8Array)) return;
  const start = codeOf(lo, 0, lo.length);
  const end = Math.min(codeOf(hi, 0, hi.length), start + MAX_RANGE);
  lengths.add(lo.length);
  if (Array.isArray(dst)) {
    for (let c = start; c <= end && c - start < dst.length; c++) {
      if (dst[c - start] instanceof Uint8Array) map.set(c, UTF16BE.decode(dst[c - start]));
    }
    return;
  }
  if (!(dst instanceof Uint8Array) || dst.length < 2) return;
  const base = UTF16BE.decode(dst);
  const head = base.slice(0, -1);
  const last = base.charCodeAt(base.length - 1);
  for (let c = start; c <= end; c++) map.set(c, head + String.fromCharCode(last + (c - start)));
}

/** 256-entry code -> text table for a simple font's /Encoding. */
function simpleEncoding(doc, encoding) {
  const enc = doc.resolve(encoding);
  const baseName = nameOf(enc) || nameOf(doc.resolve(enc?.BaseEncoding)) || "WinAnsiEncoding";
  const decoder = baseName === "MacRomanEncoding" ? MAC_ROMAN : CP1252;
  const table = [];
  for (let b = 0; b < BYTE_RANGE; b++) table.push(decoder.decode(new Uint8Array([b])));
  const diffs = doc.resolve(enc?.Differences);
  if (!Array.isArray(diffs)) return table;
  let code = 0;
  for (const d of diffs) {
    const v = doc.resolve(d);
    if (typeof v === "number") code = v;
    else if (nameOf(v) !== undefined) {
      if (code < BYTE_RANGE) table[code] = glyphToUnicode(nameOf(v));
      code++;
    }
  }
  return table;
}

/** Width lookup for a CID font's /W array. */
function cidWidths(doc, w) {
  const map = new Map();
  const arr = doc.resolve(w);
  if (!Array.isArray(arr)) return map;
  for (let i = 0; i < arr.length; ) {
    const first = doc.resolve(arr[i]);
    const next = doc.resolve(arr[i + 1]);
    if (Array.isArray(next)) {
      next.forEach((width, k) => map.set(first + k, doc.resolve(width)));
      i += 2;
      continue;
    }
    const width = doc.resolve(arr[i + 2]);
    for (let c = first; c <= next && c - first < MAX_RANGE; c++) map.set(c, width);
    i += 3;
  }
  return map;
}

/** Bold/italic from the font's name and descriptor. */
function fontStyle(doc, font, descriptor) {
  const name = (nameOf(doc.resolve(font.BaseFont)) || "").replace(SUBSET_PREFIX, "");
  const flags = doc.resolve(descriptor?.Flags) || 0;
  const weight = doc.resolve(descriptor?.FontWeight) || 0;
  const angle = doc.resolve(descriptor?.ItalicAngle) || 0;
  return {
    bold: BOLD_NAME.test(name) || !!(flags & FLAG_FORCE_BOLD) || weight >= BOLD_WEIGHT,
    italic: ITALIC_NAME.test(name) || !!(flags & FLAG_ITALIC) || angle !== 0,
  };
}

/**
 * Builds a decoder for one font resource.
 * @returns {{ bold: boolean, italic: boolean, decode: (bytes: Uint8Array) => { text: string, width: number, space: boolean }[] }}
 */
export function loadFont(doc, fontRef) {
  const font = doc.resolve(fontRef) || {};
  const subtype = nameOf(doc.resolve(font.Subtype));
  const composite = subtype === "Type0";
  const descendant = composite ? doc.resolve(doc.resolve(font.DescendantFonts)?.[0]) || {} : null;
  const descriptor = doc.resolve((descendant || font).FontDescriptor);
  const style = fontStyle(doc, font, descriptor);
  const toUnicodeStream = doc.resolve(font.ToUnicode);
  const toUnicodeData = toUnicodeStream && toUnicodeStream.dict ? doc.streamData(toUnicodeStream) : null;
  const cmap = toUnicodeData ? parseCMap(toUnicodeData) : null;

  // Glyph-space -> text-space scale (Type3 fonts carry their own matrix)
  const matrix = doc.resolve(font.FontMatrix);
  const scale = subtype === "Type3" && Array.isArray(matrix) ? doc.resolve(matrix[0]) : GLYPH_SPACE;

  if (composite) {
    const widths = cidWidths(doc, descendant.W);
    const dw = doc.resolve(descendant.DW) ?? DEFAULT_CID_WIDTH;
    const lengths = cmap && cmap.lengths.length ? cmap.lengths : [2];
    return {
      ...style,
      decode(bytes) {
        const out = [];
        for (let i = 0; i < bytes.length; ) {
          let len = lengths.find((l) => cmap && cmap.map.has(codeOf(bytes, i, Math.min(l, bytes.length - i))));
          if (!len) len = lengths.includes(2) ? 2 : lengths[0];
          len = Math.min(len, bytes.length - i);
          const code = codeOf(bytes, i, len);
          i += len;
          const text = cmap ? cmap.map.get(code) ?? "" : "";
          out.push({ text, width: (widths.get(code) ?? dw) * scale, space: len === 1 && code === SPACE_CODE });
        }
        return out;
      },
    };
  }

  const table = simpleEncoding(doc, font.Encoding);
  const firstChar = doc.resolve(font.FirstChar) ?? 0;
  const widthArr = doc.resolve(font.Widths);
  const missing = doc.resolve(descriptor?.MissingWidth) || 0;
  const hasWidths = Array.isArray(widthArr);
  return {
    ...style,
    decode(bytes) {
      const out = [];
      for (const code of bytes) {
        const text = cmap && cmap.map.has(code) ? cmap.map.get(code) : table[code];
        let width;
        if (hasWidths) {
          const w = doc.resolve(widthArr[code - firstChar]);
          width = (typeof w === "number" ? w : missing) * scale;
        } else {
          width = helveticaWidth(text || " ", style.bold) * GLYPH_SPACE;
        }
        out.push({ text: text || "", width, space: code === SPACE_CODE });
      }
      return out;
    },
  };
}
