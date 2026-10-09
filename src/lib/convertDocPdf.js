/**
 * convertDocPdf.js
 * PDF writer for convertDoc.js: real word-wrapped pages set in the built-in
 * Helvetica family (no font files to embed), WinAnsi text, Flate-compressed
 * page streams and a byte-accurate xref table. Also exports the Helvetica
 * metrics and WinAnsi tables the PDF reader (convertDocPdfParse.js) reuses.
 * Element model: see convertDocModel.js.
 */
import { zlibSync } from "fflate";

// ── Page geometry (points; US Letter with 1in margins) ──
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 72;
const TEXT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// ── Type scale ──
const BODY_SIZE = 11;
const HEADING_SIZES = [0, 22, 17, 14.5, 12.5, 11.5, 11]; // levels 1-6
const LINE_HEIGHT = 1.4;
const PARAGRAPH_GAP = 0.7; // × font size, after a paragraph
const LIST_GAP = 0.25; // × font size, between list items
const HEADING_GAP_BEFORE = 0.9; // × heading size
const HEADING_GAP_AFTER = 0.35;
const LIST_INDENT = 18;
const BULLET_CHAR = "•";
const TAB_AS_SPACES = "    ";
const PRODUCER = "Catalytic Converter (wearedogs.net)";

// ── Fonts: resource name per style, all standard-14 Helvetica ──
const FONTS = [
  { key: "F1", base: "Helvetica", bold: false, italic: false },
  { key: "F2", base: "Helvetica-Bold", bold: true, italic: false },
  { key: "F3", base: "Helvetica-Oblique", bold: false, italic: true },
  { key: "F4", base: "Helvetica-BoldOblique", bold: true, italic: true },
];

// Helvetica / Helvetica-Bold advance widths (1/1000 em) for ASCII 32-126,
// from the Adobe core font metrics. The obliques share them.
const ASCII_FIRST = 32;
// prettier-ignore
const HELVETICA_WIDTHS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];
// prettier-ignore
const HELVETICA_BOLD_WIDTHS = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611,
  975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556,
  333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611,
  611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584,
];
// Non-ASCII WinAnsi characters whose width isn't their unaccented letter's
const EXTRA_WIDTHS = {
  "•": [350, 350], "–": [556, 556], "—": [1000, 1000], "…": [1000, 1000],
  "‘": [222, 278], "’": [222, 278], "“": [333, 500], "”": [333, 500],
  "‚": [222, 278], "„": [333, 500], " ": [278, 278], "€": [556, 556],
  "©": [737, 737], "®": [737, 737], "™": [1000, 1000], "°": [400, 400],
  "Æ": [1000, 1000], "æ": [889, 889], "Œ": [1000, 1000], "œ": [944, 944],
  "ß": [611, 611], "×": [584, 584], "÷": [584, 584], "·": [278, 278],
};
const DEFAULT_WIDTH = 556;

// WinAnsiEncoding: 0x20-0x7E and 0xA0-0xFF are Latin-1; 0x80-0x9F are the
// Windows-1252 extras (curly quotes, dashes, bullet, euro...).
const WIN_ANSI_HIGH_START = 0x80;
const WIN_ANSI_HIGH_END = 0x9f;
const LATIN1_START = 0xa0;
const LATIN1_END = 0xff;
const ASCII_PRINTABLE_END = 0x7e;
const REPLACEMENT_BYTE = 0x3f; // "?"
const CP1252 = new TextDecoder("windows-1252");

/** Unicode char -> WinAnsi byte, for the 0x80-0x9F block */
const WIN_ANSI_EXTRAS = (() => {
  const map = {};
  for (let b = WIN_ANSI_HIGH_START; b <= WIN_ANSI_HIGH_END; b++) {
    const ch = CP1252.decode(new Uint8Array([b]));
    if (ch.charCodeAt(0) !== b) map[ch] = b;
  }
  return map;
})();

/**
 * WinAnsi byte for one character, or -1 when the encoding has no such glyph.
 * @param {string} ch
 */
function winAnsiByte(ch) {
  const code = ch.charCodeAt(0);
  if (code >= ASCII_FIRST && code <= ASCII_PRINTABLE_END) return code;
  if (code >= LATIN1_START && code <= LATIN1_END) return code;
  return WIN_ANSI_EXTRAS[ch] ?? -1;
}

/**
 * Rewrites text so every character exists in WinAnsi: accents that aren't in
 * Latin-1 drop to their base letter, anything else becomes "?".
 * @param {string} text
 */
function toWinAnsiText(text) {
  let out = "";
  for (const ch of text.replace(/\t/g, TAB_AS_SPACES)) {
    if (winAnsiByte(ch) >= 0) {
      out += ch;
      continue;
    }
    const base = ch.normalize("NFD")[0];
    out += base && winAnsiByte(base) >= 0 ? base : "?";
  }
  return out;
}

/**
 * Advance width of one character in Helvetica (1/1000 em).
 * @param {string} ch
 * @param {boolean} bold
 * @returns {number}
 */
export function helveticaWidth(ch, bold) {
  const code = ch.charCodeAt(0);
  const table = bold ? HELVETICA_BOLD_WIDTHS : HELVETICA_WIDTHS;
  if (code >= ASCII_FIRST && code <= ASCII_PRINTABLE_END) return table[code - ASCII_FIRST];
  const extra = EXTRA_WIDTHS[ch];
  if (extra) return extra[bold ? 1 : 0];
  const base = ch.normalize("NFD").charCodeAt(0);
  if (base >= ASCII_FIRST && base <= ASCII_PRINTABLE_END) return table[base - ASCII_FIRST];
  return DEFAULT_WIDTH;
}

const textWidth = (text, bold, size) => {
  let w = 0;
  for (const ch of text) w += helveticaWidth(ch, bold);
  return (w * size) / 1000;
};

// ==========================================
// LAYOUT
// ==========================================

/**
 * Splits spans into wrap tokens: words, runs of spaces and hard breaks.
 * @param {import("./convertDocModel.js").DocSpan[]} spans
 * @param {boolean} forceBold
 */
function tokenize(spans, forceBold) {
  const tokens = [];
  for (const s of spans) {
    const bold = forceBold || !!s.bold;
    const parts = toWinAnsiText(s.text).split(/(\n| +)/);
    for (const part of parts) {
      if (!part) continue;
      const kind = part === "\n" ? "break" : part[0] === " " ? "space" : "word";
      tokens.push({ text: part, bold, italic: !!s.italic, kind });
    }
  }
  return tokens;
}

/** Appends text to a line, merging into the last run when the style matches. */
function pushRun(line, token, text, size) {
  const last = line.runs[line.runs.length - 1];
  line.width += textWidth(text, token.bold, size);
  if (last && last.bold === token.bold && last.italic === token.italic) {
    last.text += text;
    return;
  }
  line.runs.push({ text, bold: token.bold, italic: token.italic });
}

/** Breaks a word too long for any line into line-sized pieces. */
function splitLongWord(token, size, maxWidth) {
  const pieces = [];
  let piece = "";
  for (const ch of token.text) {
    if (piece && textWidth(piece + ch, token.bold, size) > maxWidth) {
      pieces.push({ ...token, text: piece });
      piece = "";
    }
    piece += ch;
  }
  if (piece) pieces.push({ ...token, text: piece });
  return pieces;
}

/**
 * Greedy word wrap of one block into lines of styled runs.
 * @returns {{ runs: { text: string, bold: boolean, italic: boolean }[], width: number }[]}
 */
function wrapBlock(spans, size, maxWidth, forceBold) {
  const lines = [];
  let line = { runs: [], width: 0 };
  const newLine = () => {
    const last = line.runs[line.runs.length - 1];
    if (last) last.text = last.text.replace(/ +$/, "");
    lines.push(line);
    line = { runs: [], width: 0 };
  };
  const tokens = tokenize(spans, forceBold);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.kind === "break") {
      newLine();
      continue;
    }
    if (token.kind === "space") {
      if (line.runs.length) pushRun(line, token, token.text, size);
      continue;
    }
    const width = textWidth(token.text, token.bold, size);
    if (width > maxWidth) {
      const pieces = splitLongWord(token, size, maxWidth);
      tokens.splice(i + 1, 0, ...pieces.slice(1));
      if (line.runs.length) newLine();
      pushRun(line, pieces[0], pieces[0].text, size);
      continue;
    }
    if (line.runs.length && line.width + width > maxWidth) newLine();
    pushRun(line, token, token.text, size);
  }
  if (line.runs.length) newLine();
  return lines;
}

/** Style of one block: size, bold, indent and spacing. */
function blockStyle(el) {
  if (el.type === "heading") {
    const size = HEADING_SIZES[Math.min(HEADING_SIZES.length - 1, el.level || 1)];
    return { size, bold: true, indent: 0, before: size * HEADING_GAP_BEFORE, after: size * HEADING_GAP_AFTER };
  }
  if (el.type === "list-item") {
    return { size: BODY_SIZE, bold: false, indent: LIST_INDENT, before: 0, after: BODY_SIZE * LIST_GAP };
  }
  return { size: BODY_SIZE, bold: false, indent: 0, before: 0, after: BODY_SIZE * PARAGRAPH_GAP };
}

const fontKey = (bold, italic) => FONTS.find((f) => f.bold === bold && f.italic === italic).key;

const hexString = (text) => {
  let hex = "";
  for (const ch of text) {
    const b = winAnsiByte(ch);
    hex += (b < 0 ? REPLACEMENT_BYTE : b).toString(16).padStart(2, "0");
  }
  return `<${hex}>`;
};

const num = (n) => String(Math.round(n * 100) / 100);

/**
 * Lays every element out onto pages of PDF content-stream operators.
 * @param {import("./convertDocModel.js").DocElement[]} elements
 * @returns {string[]} one content stream per page
 */
function layoutPages(elements) {
  const pages = [];
  let ops = [];
  let y = PAGE_HEIGHT - MARGIN;
  const atTop = () => y === PAGE_HEIGHT - MARGIN;
  const newPage = () => {
    pages.push(ops.join("\n"));
    ops = [];
    y = PAGE_HEIGHT - MARGIN;
  };
  for (const el of elements) {
    const style = blockStyle(el);
    const leading = style.size * LINE_HEIGHT;
    const lines = wrapBlock(el.spans, style.size, TEXT_WIDTH - style.indent, style.bold);
    if (!atTop()) y -= style.before;
    // Keep a heading with the first lines of what follows it
    const keep = el.type === "heading" ? leading + BODY_SIZE * LINE_HEIGHT * 2 : leading;
    if (y - keep < MARGIN && !atTop()) newPage();
    lines.forEach((line, i) => {
      if (y - leading < MARGIN && !atTop()) newPage();
      y -= leading;
      const x = MARGIN + style.indent;
      if (el.type === "list-item" && i === 0) {
        ops.push(`BT /${fontKey(false, false)} ${num(style.size)} Tf ${num(MARGIN)} ${num(y)} Td ${hexString(BULLET_CHAR)} Tj ET`);
      }
      let text = `BT ${num(x)} ${num(y)} Td`;
      for (const run of line.runs) {
        if (!run.text) continue;
        text += ` /${fontKey(run.bold, run.italic)} ${num(style.size)} Tf ${hexString(run.text)} Tj`;
      }
      ops.push(text + " ET");
    });
    y -= style.after;
  }
  if (ops.length || !pages.length) pages.push(ops.join("\n"));
  return pages;
}

// ==========================================
// FILE ASSEMBLY
// ==========================================

/** PDF text string (UTF-16BE with BOM) for document info. */
function infoString(text) {
  let hex = "FEFF";
  for (let i = 0; i < text.length; i++) hex += text.charCodeAt(i).toString(16).padStart(4, "0");
  return `<${hex}>`;
}

const ENCODER = new TextEncoder();
const XREF_FREE_HEAD = "0000000000 65535 f \n";
// Object numbers: 1 catalog, 2 page tree, 3 info, then fonts, then page + content pairs
const FIRST_FONT = 4;
const FIRST_PAGE = FIRST_FONT + FONTS.length;

/**
 * Writes the element model as a PDF file.
 * @param {import("./convertDocModel.js").DocElement[]} elements
 * @returns {Uint8Array}
 */
export function generatePdf(elements) {
  const pages = layoutPages(elements);
  const firstHeading = elements.find((el) => el.type === "heading");
  const title = firstHeading ? firstHeading.spans.map((s) => s.text).join("").replace(/\s+/g, " ").trim() : "";

  const pageIds = pages.map((_, i) => FIRST_PAGE + i * 2);
  const fontRefs = FONTS.map((f, i) => `/${f.key} ${FIRST_FONT + i} 0 R`).join(" ");

  /** @type {(string | Uint8Array)[][]} object bodies, in id order from 1 */
  const objects = [
    ["<< /Type /Catalog /Pages 2 0 R >>"],
    [`<< /Type /Pages /Count ${pages.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`],
    [`<< /Producer ${infoString(PRODUCER)}${title ? ` /Title ${infoString(title)}` : ""} >>`],
    ...FONTS.map((f) => [`<< /Type /Font /Subtype /Type1 /BaseFont /${f.base} /Encoding /WinAnsiEncoding >>`]),
  ];
  pages.forEach((content, i) => {
    const compressed = zlibSync(ENCODER.encode(content));
    objects.push([
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
        `/Resources << /Font << ${fontRefs} >> >> /Contents ${pageIds[i] + 1} 0 R >>`,
    ]);
    objects.push([`<< /Length ${compressed.length} /Filter /FlateDecode >>\nstream\n`, compressed, "\nendstream"]);
  });

  const chunks = [];
  let size = 0;
  const write = (part) => {
    const bytes = typeof part === "string" ? ENCODER.encode(part) : part;
    chunks.push(bytes);
    size += bytes.length;
  };
  // Header, then a comment of high bytes so tools treat the file as binary
  write("%PDF-1.4\n");
  write(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));
  const offsets = [];
  objects.forEach((parts, i) => {
    offsets.push(size);
    write(`${i + 1} 0 obj\n`);
    parts.forEach(write);
    write("\nendobj\n");
  });
  const xrefAt = size;
  write(`xref\n0 ${objects.length + 1}\n${XREF_FREE_HEAD}`);
  write(offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join(""));
  write(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`);

  const out = new Uint8Array(size);
  let pos = 0;
  for (const c of chunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}
