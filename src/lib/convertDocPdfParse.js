/**
 * convertDocPdfParse.js
 * PDF reader for convertDoc.js. Walks the page tree, runs each page's content
 * stream (text state, matrices, form XObjects) to place every piece of text,
 * then rebuilds lines, paragraphs, headings (by font size) and bullet lists.
 * Objects: convertDocPdfObjects.js. Fonts: convertDocPdfFonts.js.
 */
import { openPdf, createLexer } from "./convertDocPdfObjects.js";
import { loadFont } from "./convertDocPdfFonts.js";
import { addSpan, pushBlock } from "./convertDocModel.js";

const IDENTITY = [1, 0, 0, 1, 0, 0];
const MAX_FORM_DEPTH = 8;
const MAX_PAGE_TREE_DEPTH = 64;
const HUNDRED = 100;

// ── Layout reconstruction (all relative to the font size) ──
const SAME_LINE_TOLERANCE = 0.5; // baseline drift still on one line
const WORD_GAP = 0.18; // horizontal gap that reads as a space
const LINE_BACKTRACK = 1; // x jumping back this far starts a new line
const PARAGRAPH_GAP_FACTOR = 1.35; // × usual line spacing
const DEFAULT_LEADING = 1.25;
const MAX_LEADING = 1.6; // × size: wider than this is never plain line spacing
const MIN_LEADING = 0.8; // × size: tighter than this is overprint, not a new line
const INDENT_STEP = 0.9;
const SIZE_CHANGE = 0.6; // points
const HEADING_RATIO = 1.12; // × body size
const SIZE_ROUNDING = 2; // half-point buckets
const MAX_HEADING_LEVEL = 6;
const MAX_HEADING_LINES = 3;
const BULLET = /^\s*([•◦▪●‣∙·■⁃–*-])\s+/;
const BULLET_ONLY = /^\s*[\u2022\u25e6\u25aa\u25cf\u2023\u2219\u00b7\u25a0\u2043\u2013*-]\s*$/;
const LIST_OUTDENT = 0.5; // × size: a line left of the list text ends the item
const PAGE_NUMBER = /^\s*(page\s+)?\d{1,4}(\s+(of|\/)\s+\d{1,4})?\s*$/i;
const SENTENCE_END = /[.!?:;"”)]\s*$/;
const HYPHENATED = /[A-Za-zÀ-ɏ]-$/;
const STARTS_LOWER = /^[a-zß-ÿ]/;

const nameOf = (v) => (v && typeof v === "object" ? v.name : undefined);

/** m1 × m2 for PDF row-vector matrices [a b c d e f]. */
const multiply = (m1, m2) => [
  m1[0] * m2[0] + m1[1] * m2[2],
  m1[0] * m2[1] + m1[1] * m2[3],
  m1[2] * m2[0] + m1[3] * m2[2],
  m1[2] * m2[1] + m1[3] * m2[3],
  m1[4] * m2[0] + m1[5] * m2[2] + m2[4],
  m1[4] * m2[1] + m1[5] * m2[3] + m2[5],
];

const roundSize = (s) => Math.round(s * SIZE_ROUNDING) / SIZE_ROUNDING;

// ==========================================
// PAGES
// ==========================================

/** Every page dictionary in order, with inherited /Resources filled in. */
function collectPages(doc) {
  const catalog = doc.catalog();
  if (!catalog) throw new Error("This PDF has no page tree — the file may be damaged.");
  const pages = [];
  const seen = new Set();
  const walk = (nodeRef, inherited, depth) => {
    if (depth > MAX_PAGE_TREE_DEPTH) return;
    if (nodeRef && nodeRef.ref !== undefined) {
      if (seen.has(nodeRef.ref)) return;
      seen.add(nodeRef.ref);
    }
    const node = doc.resolve(nodeRef);
    if (!node || typeof node !== "object") return;
    const resources = doc.resolve(node.Resources) || inherited;
    const kids = doc.resolve(node.Kids);
    if (Array.isArray(kids)) {
      kids.forEach((k) => walk(k, resources, depth + 1));
      return;
    }
    pages.push({ node, resources });
  };
  walk(catalog.Pages, null, 0);
  return pages;
}

/** Concatenated, decoded content streams of a page. */
function pageContent(doc, page) {
  const contents = doc.resolve(page.node.Contents);
  const list = Array.isArray(contents) ? contents : contents ? [page.node.Contents] : [];
  const parts = list.map((c) => doc.streamData(doc.resolve(c))).filter(Boolean);
  const total = parts.reduce((n, p) => n + p.length + 1, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    out[pos + p.length] = 0x0a; // streams may split mid-line; keep tokens apart
    pos += p.length + 1;
  }
  return out;
}

// ==========================================
// CONTENT STREAM INTERPRETER
// ==========================================

/**
 * Runs a content stream and reports every shown string with its position.
 * @param {object} doc
 * @param {Uint8Array} data
 * @param {object} resources
 * @param {number[]} ctm
 * @param {(item: object) => void} emit
 * @param {Map} fontCache
 * @param {number} depth
 */
function runContent(doc, data, resources, ctm, emit, fontCache, depth) {
  const res = doc.resolve(resources) || {};
  const fonts = doc.resolve(res.Font) || {};
  const xobjects = doc.resolve(res.XObject) || {};
  let gs = { ctm, charSpace: 0, wordSpace: 0, scale: 1, leading: 0, rise: 0, font: null, size: 0 };
  const stack = [];
  let tm = IDENTITY;
  let tlm = IDENTITY;
  const lex = createLexer(data);
  const operands = [];

  const fontFor = (name) => {
    const ref = fonts[name];
    // Cache by object number, or by the dictionary itself when it is inline
    const key = ref && ref.ref !== undefined ? `r${ref.ref}` : ref;
    if (!key) return null;
    if (fontCache.has(key)) return fontCache.get(key);
    let font = null;
    try {
      font = loadFont(doc, ref);
    } catch {
      font = null;
    }
    fontCache.set(key, font);
    return font;
  };

  const moveLine = (tx, ty) => {
    tlm = multiply([1, 0, 0, 1, tx, ty], tlm);
    tm = tlm;
  };

  const show = (bytes) => {
    if (!gs.font || !(bytes instanceof Uint8Array)) return;
    const trm = multiply(multiply([gs.size * gs.scale, 0, 0, gs.size, 0, gs.rise], tm), gs.ctm);
    const size = Math.hypot(trm[2], trm[3]);
    let text = "";
    let advance = 0;
    for (const g of gs.font.decode(bytes)) {
      text += g.text;
      advance += (g.width * gs.size + gs.charSpace + (g.space ? gs.wordSpace : 0)) * gs.scale;
    }
    const end = multiply(multiply([1, 0, 0, 1, advance, 0], tm), gs.ctm);
    tm = multiply([1, 0, 0, 1, advance, 0], tm);
    if (!text) return;
    emit({ x: trm[4], y: trm[5], endX: end[4], size, text, bold: gs.font.bold, italic: gs.font.italic });
  };

  const skipInlineImage = () => {
    // Everything up to " ID " is the image dictionary; the data runs to "EI"
    for (let v = lex.readObject(); v !== undefined; v = lex.readObject()) if (v && v.op === "ID") break;
    const bytes = lex.bytes;
    let p = lex.pos + 1;
    while (p < bytes.length - 2) {
      if (bytes[p] === 0x45 && bytes[p + 1] === 0x49 && (p + 2 >= bytes.length || bytes[p + 2] <= 0x20) && bytes[p - 1] <= 0x20) break;
      p++;
    }
    lex.pos = p + 2;
  };

  const ops = {
    q: () => stack.push({ ...gs }),
    Q: () => (gs = stack.pop() || gs),
    cm: (a) => (gs.ctm = multiply(a.slice(-6), gs.ctm)),
    BT: () => {
      tm = IDENTITY;
      tlm = IDENTITY;
    },
    Tf: (a) => {
      gs.font = fontFor(nameOf(a[a.length - 2]));
      gs.size = a[a.length - 1] || 0;
    },
    Tc: (a) => (gs.charSpace = a[0] || 0),
    Tw: (a) => (gs.wordSpace = a[0] || 0),
    Tz: (a) => (gs.scale = (a[0] ?? HUNDRED) / HUNDRED),
    TL: (a) => (gs.leading = a[0] || 0),
    Ts: (a) => (gs.rise = a[0] || 0),
    Td: (a) => moveLine(a[0] || 0, a[1] || 0),
    TD: (a) => {
      gs.leading = -(a[1] || 0);
      moveLine(a[0] || 0, a[1] || 0);
    },
    Tm: (a) => {
      tlm = a.slice(-6);
      tm = tlm;
    },
    "T*": () => moveLine(0, -gs.leading),
    Tj: (a) => show(a[a.length - 1]),
    "'": (a) => {
      moveLine(0, -gs.leading);
      show(a[a.length - 1]);
    },
    '"': (a) => {
      gs.wordSpace = a[0] || 0;
      gs.charSpace = a[1] || 0;
      moveLine(0, -gs.leading);
      show(a[2]);
    },
    TJ: (a) => {
      const arr = a[a.length - 1];
      if (!Array.isArray(arr)) return;
      for (const part of arr) {
        if (typeof part === "number") tm = multiply([1, 0, 0, 1, (-part / 1000) * gs.size * gs.scale, 0], tm);
        else show(part);
      }
    },
    Do: (a) => {
      const xo = doc.resolve(xobjects[nameOf(a[0])]);
      if (!xo || !xo.dict || nameOf(doc.resolve(xo.dict.Subtype)) !== "Form" || depth >= MAX_FORM_DEPTH) return;
      const formData = doc.streamData(xo);
      if (!formData) return;
      const matrix = doc.resolve(xo.dict.Matrix);
      const formCtm = Array.isArray(matrix) && matrix.length === 6 ? multiply(matrix, gs.ctm) : gs.ctm;
      runContent(doc, formData, xo.dict.Resources || resources, formCtm, emit, fontCache, depth + 1);
    },
    BI: skipInlineImage,
  };

  for (let v = lex.readObject(); v !== undefined; v = lex.readObject()) {
    if (!(v && typeof v === "object" && v.op !== undefined)) {
      operands.push(v);
      continue;
    }
    const handler = ops[v.op];
    if (handler) {
      try {
        handler(operands);
      } catch {
        // a malformed operator skips just itself
      }
    }
    operands.length = 0;
  }
}

// ==========================================
// LAYOUT RECONSTRUCTION
// ==========================================

/** Groups a page's text pieces into lines, in content-stream order. */
function buildLines(items, pageIndex) {
  const lines = [];
  let line = null;
  for (const item of items) {
    const tol = Math.max(item.size, line ? line.size : 0) * SAME_LINE_TOLERANCE;
    const sameLine =
      line && Math.abs(item.y - line.y) <= tol && item.x >= line.lastX - item.size * LINE_BACKTRACK;
    if (!sameLine) {
      line = { y: item.y, x: item.x, size: item.size, lastX: item.endX, pieces: [], page: pageIndex };
      lines.push(line);
    } else {
      const gap = item.x - line.lastX;
      const prev = line.pieces[line.pieces.length - 1];
      if (gap > item.size * WORD_GAP && !/\s$/.test(prev.text) && !/^\s/.test(item.text)) {
        line.pieces.push({ ...prev, text: " " });
      }
    }
    line.pieces.push(item);
    line.lastX = Math.max(line.lastX, item.endX);
    // The line's size is its biggest text (drop caps and footnote marks aside)
    if (item.text.trim().length > 1) line.size = Math.max(line.size, item.size);
  }
  for (const l of lines) l.text = l.pieces.map((p) => p.text).join("");
  return lines.filter((l) => l.text.trim());
}

/** The size most of the text is set in. */
function bodySize(lines) {
  const counts = new Map();
  for (const l of lines) {
    const s = roundSize(l.size);
    counts.set(s, (counts.get(s) || 0) + l.text.length);
  }
  let best = 0;
  let bestCount = -1;
  for (const [s, c] of counts) if (c > bestCount) [best, bestCount] = [s, c];
  return best;
}

/**
 * Line spacing inside a paragraph, per size: the tightest gap between
 * consecutive same-size lines (paragraph breaks only ever add to it, and a
 * short document can have more breaks than wrapped lines).
 */
function usualLeading(lines) {
  const out = new Map();
  for (let i = 1; i < lines.length; i++) {
    const a = lines[i - 1];
    const b = lines[i];
    if (a.page !== b.page || roundSize(a.size) !== roundSize(b.size)) continue;
    const gap = a.y - b.y;
    if (gap < a.size * MIN_LEADING) continue;
    const key = roundSize(a.size);
    if (!out.has(key) || gap < out.get(key)) out.set(key, gap);
  }
  return out;
}

/** Heading level per rounded size, biggest first. */
function headingLevels(lines, body) {
  const sizes = [...new Set(lines.map((l) => roundSize(l.size)))]
    .filter((s) => s >= body * HEADING_RATIO)
    .sort((a, b) => b - a);
  const levels = new Map();
  sizes.forEach((s, i) => levels.set(s, Math.min(MAX_HEADING_LEVEL, i + 1)));
  return levels;
}

/** Drops page numbers sitting alone at the top or bottom of a page. */
function dropPageNumbers(lines) {
  return lines.filter((l, i) => {
    if (!PAGE_NUMBER.test(l.text)) return true;
    const first = i === 0 || lines[i - 1].page !== l.page;
    const last = i === lines.length - 1 || lines[i + 1].page !== l.page;
    return !(first || last);
  });
}

/** Where a list item's words start, after its bullet. */
function listTextX(line) {
  const words = line.pieces.find((p) => p.text.trim() && !BULLET_ONLY.test(p.text));
  return words ? words.x : line.x;
}

/** Joins lines into paragraphs, headings and list items. */
function buildBlocks(lines) {
  const body = bodySize(lines);
  const leadings = usualLeading(lines);
  const levels = headingLevels(lines, body);
  const blocks = [];
  let block = null;

  const startsNew = (prev, line, kind) => {
    if (!block || !prev) return true;
    if (kind.list || kind.level !== block.level) return true;
    if (Math.abs(prev.size - line.size) > SIZE_CHANGE) return true;
    if (block.lines.length >= MAX_HEADING_LINES && block.level) return true;
    if (prev.page !== line.page) return SENTENCE_END.test(prev.text);
    // Only one-line paragraphs on record: their gap is a paragraph gap, not leading
    const seen = leadings.get(roundSize(line.size));
    const leading = seen && seen <= line.size * MAX_LEADING ? seen : line.size * DEFAULT_LEADING;
    if (prev.y - line.y > leading * PARAGRAPH_GAP_FACTOR) return true;
    if (prev.y - line.y < 0) return true; // a new column
    if (block.list) return line.x < block.textX - line.size * LIST_OUTDENT;
    return line.x > prev.x + line.size * INDENT_STEP;
  };

  let prev = null;
  for (const line of lines) {
    const bullet = BULLET.exec(line.text);
    const kind = { list: !!bullet, level: levels.get(roundSize(line.size)) || 0 };
    if (startsNew(prev, line, kind)) {
      block = {
        level: kind.level,
        list: kind.list,
        lines: [],
        bulletLength: bullet ? bullet[0].length : 0,
        textX: bullet ? listTextX(line) : line.x,
      };
      blocks.push(block);
    }
    block.lines.push(line);
    prev = line;
  }
  return blocks;
}

/** Turns one block's lines into a DocElement. */
function blockToElement(block, out) {
  const spans = [];
  let skip = block.bulletLength;
  block.lines.forEach((line, li) => {
    if (li > 0) {
      const prevText = spans.length ? spans[spans.length - 1].text : "";
      const joinTight = HYPHENATED.test(prevText) && STARTS_LOWER.test(line.text.trim());
      if (joinTight) spans[spans.length - 1].text = prevText.slice(0, -1);
      else addSpan(spans, " ", false, false);
    }
    for (const piece of line.pieces) {
      let text = piece.text;
      if (skip > 0) {
        const cut = Math.min(skip, text.length);
        skip -= cut;
        text = text.slice(cut);
      }
      addSpan(spans, text, piece.bold, piece.italic);
    }
  });
  const collapsed = spans.map((s) => ({ ...s, text: s.text.replace(/\s+/g, " ") }));
  const type = block.list ? "list-item" : block.level ? "heading" : "paragraph";
  pushBlock(out, type, block.level, collapsed);
}

// ==========================================
// ENTRY
// ==========================================

/**
 * Reads a PDF's text layer into the element model.
 * @param {Uint8Array} bytes
 * @returns {import("./convertDocModel.js").DocElement[]}
 */
export function parsePdf(bytes) {
  if (!/%PDF-/.test(new TextDecoder("latin1").decode(bytes.subarray(0, 1024)))) {
    throw new Error("This isn't a PDF file (no %PDF header).");
  }
  const doc = openPdf(bytes);
  if (doc.isEncrypted) throw new Error("This PDF is encrypted. Remove the password, then try again.");
  const pages = collectPages(doc);
  const fontCache = new Map();
  let lines = [];
  pages.forEach((page, i) => {
    const items = [];
    runContent(doc, pageContent(doc, page), page.resources, IDENTITY, (it) => items.push(it), fontCache, 0);
    lines = lines.concat(buildLines(items, i));
  });
  lines = dropPageNumbers(lines);
  if (!lines.length) {
    throw new Error(
      "No text layer was found in this PDF — it's probably scanned pictures of pages. Try the Image Reader app to OCR it.",
    );
  }
  const out = [];
  for (const block of buildBlocks(lines)) blockToElement(block, out);
  return out;
}
