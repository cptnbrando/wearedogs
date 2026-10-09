/**
 * convertDoc.js
 * Client-side document conversion for the Catalytic Converter. Every input
 * (txt, md, html, rtf, docx, odt, doc, pdf) is read into one small element
 * model, and every output format is written from that model:
 *
 *   DocElement = { type: "heading" | "paragraph" | "list-item", level?, spans }
 *   DocSpan    = { text, bold?, italic? }   ("\n" inside text = hard line break)
 *
 * Text formats live here; the zip/XML office formats are in convertDocOffice.js,
 * the PDF writer in convertDocPdf.js and the PDF reader in convertDocPdfParse.js.
 */
import {
  parseDocx,
  parseOdt,
  parseDoc,
  generateDocx,
  generateOdt,
} from "./convertDocOffice.js";
import { generatePdf } from "./convertDocPdf.js";
import { parsePdf } from "./convertDocPdfParse.js";
import {
  addSpan,
  pushBlock,
  plainText,
  DOCUMENT_INPUTS,
  DOCUMENT_BINARY_MIMES,
} from "./convertDocModel.js";

export { DOCUMENT_INPUTS, DOCUMENT_OUTPUTS, DOCUMENT_BINARY_MIMES } from "./convertDocModel.js";

/**
 * @typedef {import("./convertDocModel.js").DocSpan} DocSpan
 * @typedef {import("./convertDocModel.js").DocElement} DocElement
 */

const TEXT_MIMES = {
  txt: "text/plain;charset=utf-8",
  md: "text/markdown;charset=utf-8",
  html: "text/html;charset=utf-8",
  rtf: "application/rtf",
};
const EXT_ALIASES = { htm: "html", markdown: "md" };

const PREVIEW_CHARS = 600;
// A markdown file is .dog data when it is basically just a pipe table
const MAX_PROSE_LINES_IN_DATA_MD = 2;
const DOG_DOCS_FOOTER = /made with \S*\/\.dog\s*$/m;
const TABLE_SEPARATOR = /^\|[\s:|-]+\|?$/;
const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

const HTML_BLOCK_TAGS = new Set([
  "address", "article", "aside", "blockquote", "body", "dd", "details", "div",
  "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2",
  "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "ol", "p",
  "pre", "section", "summary", "table", "tbody", "td", "tfoot", "th", "thead",
  "tr", "ul",
]);
const HTML_SKIP_TAGS = new Set(["script", "style", "head", "template", "noscript", "svg", "canvas", "iframe", "object"]);
const HTML_BOLD_TAGS = new Set(["b", "strong"]);
const HTML_ITALIC_TAGS = new Set(["i", "em", "cite", "dfn", "var"]);
const HTML_BOLD_WEIGHT = /bold|[6-9]00/;
const HTML_PAGE_STYLE =
  "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;" +
  "line-height:1.6;max-width:800px;margin:40px auto;padding:0 20px;color:#222}" +
  "h1{font-size:2em;border-bottom:1px solid #ddd;padding-bottom:.3em}p,li{margin:.5em 0}";
const HTML_DEFAULT_TITLE = "Converted Document";

// RTF: groups whose text is never body text
const RTF_SKIP_DESTINATIONS = new Set([
  "fonttbl", "colortbl", "stylesheet", "info", "pict", "header", "footer",
  "headerl", "headerr", "headerf", "footerl", "footerr", "footerf", "footnote",
  "object", "listtable", "listoverridetable", "rsidtbl", "generator",
  "themedata", "colorschememapping", "latentstyles", "datastore", "xmlnstbl",
  "fldinst", "pntext", "pntxtb", "pntxta", "listtext", "bkmkstart", "bkmkend",
  "field", "annotation", "atnid", "atnauthor", "filetbl", "revtbl", "userprops",
]);
const RTF_SYMBOLS = {
  emdash: "\u2014", endash: "\u2013", bullet: "\u2022", lquote: "\u2018",
  rquote: "\u2019", ldblquote: "\u201c", rdblquote: "\u201d", tab: "\t",
  line: "\n", emspace: " ", enspace: " ", qmspace: " ",
};
const RTF_TOKEN = /\\([a-zA-Z]+)(-?\d+)? ?|\\'([0-9a-fA-F]{2})|\\([^a-zA-Z'])|([{}])|([^\\{}\r\n]+)|[\r\n]+/g;
const RTF_HEADING_SIZES = [0, 36, 30, 26, 24, 24, 24]; // half-points per level
const RTF_BODY_SIZE = 24;
const UINT16_SPAN = 65536;
const INT16_MAX = 32767;
const ASCII_MAX = 127;

const CP1252 = new TextDecoder("windows-1252");

// ==========================================
// DISPATCH
// ==========================================

const BINARY_PARSERS = { docx: parseDocx, odt: parseOdt, doc: parseDoc, pdf: parsePdf };
const TEXT_PARSERS = { txt: parseTxt, md: parseMd, html: parseHtml, rtf: parseRtf };
const BINARY_WRITERS = { docx: generateDocx, odt: generateOdt, pdf: generatePdf };
const TEXT_WRITERS = { txt: generateTxt, md: generateMd, html: generateHtml, rtf: generateRtf };

/** @param {string} ext */
export const isDocumentExt = (ext) => DOCUMENT_INPUTS.includes(ext);

/**
 * True when a .md file is a .dog data table (the converter's own md output,
 * or a pipe table with next to no prose) rather than a written document.
 * @param {string} text
 * @returns {boolean}
 */
export function isMarkdownData(text) {
  const lines = text.split(/\r?\n/);
  const hasTable = lines.some(
    (l, i) => i > 0 && TABLE_SEPARATOR.test(l.trim()) && l.includes("-") && lines[i - 1].trim().startsWith("|"),
  );
  if (!hasTable) return false;
  if (DOG_DOCS_FOOTER.test(text)) return true;
  const prose = lines.filter((l) => {
    const t = l.trim();
    return t && !t.startsWith("|") && !t.startsWith("#");
  });
  return prose.length <= MAX_PROSE_LINES_IN_DATA_MD;
}

/**
 * Reads any supported document into the element model.
 * @param {Blob} file
 * @param {string} ext - input extension
 * @returns {Promise<DocElement[]>}
 */
export async function parseDocument(file, ext) {
  const fmt = EXT_ALIASES[ext] || ext;
  if (fmt === "doc") {
    // Plenty of ".doc" files are really RTF or HTML saved under that name
    const head = await file.slice(0, 16).text();
    if (head.startsWith("{\\rtf")) return parseRtf(await file.text());
    if (/^\s*</.test(head)) return parseHtml(await file.text());
  }
  const binary = BINARY_PARSERS[fmt];
  if (binary) return binary(new Uint8Array(await file.arrayBuffer()));
  const text = TEXT_PARSERS[fmt];
  if (!text) throw new Error(`Unsupported document format: ${ext}`);
  return text(await file.text());
}

/**
 * Writes the element model out as one document format.
 * @param {DocElement[]} elements
 * @param {string} fmt - one of DOCUMENT_OUTPUTS
 * @returns {Promise<Blob>}
 */
export async function renderDocument(elements, fmt) {
  const binary = BINARY_WRITERS[fmt];
  if (binary) return new Blob([await binary(elements)], { type: DOCUMENT_BINARY_MIMES[fmt] });
  const text = TEXT_WRITERS[fmt];
  if (!text) throw new Error(`Unsupported document output: ${fmt}`);
  return new Blob([text(elements)], { type: TEXT_MIMES[fmt] });
}

/**
 * Parse + render in one go. Pass already-parsed elements to skip the parse.
 * @param {Blob} file
 * @param {string} ext
 * @param {string} fmt
 * @param {DocElement[]} [elements]
 * @returns {Promise<Blob>}
 */
export async function convertDocument(file, ext, fmt, elements) {
  const parsed = elements || (await parseDocument(file, ext));
  if (!parsed.length) throw new Error("No readable text was found in this document.");
  return renderDocument(parsed, fmt);
}

/**
 * Counts and a plain-text preview for the document panel.
 * @param {DocElement[]} elements
 */
export function documentStats(elements) {
  const text = elements.map(plainText).join("\n");
  const trimmed = text.trim();
  return {
    paragraphs: elements.length,
    headings: elements.filter((el) => el.type === "heading").length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    characters: text.length,
    preview: text.length > PREVIEW_CHARS ? text.slice(0, PREVIEW_CHARS) + "…" : text,
  };
}

// ==========================================
// PARSERS
// ==========================================

/**
 * Plain text: blank lines separate paragraphs, single newlines are kept.
 * @param {string} text
 * @returns {DocElement[]}
 */
export function parseTxt(text) {
  return text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n/)
    .map((block) => block.replace(/[ \t]+$/gm, "").replace(/^\n+|\n+$/g, ""))
    .filter((block) => block.trim())
    .map((block) => ({ type: "paragraph", spans: [{ text: block }] }));
}

/**
 * Markdown, through the marked parser already used by the store bios.
 * @param {string} text
 * @returns {Promise<DocElement[]>}
 */
export async function parseMd(text) {
  const { marked } = await import("marked");
  const body = text.replace(/^\uFEFF/, "").replace(FRONTMATTER, "");
  return parseHtml(marked.parse(body, { async: false, gfm: true }));
}

/**
 * HTML: headings, paragraphs, list items, table rows and loose text blocks.
 * @param {string} html
 * @returns {DocElement[]}
 */
export function parseHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out = [];
  walkHtmlBlocks(doc.body, out);
  return out;
}

function walkHtmlBlocks(node, out) {
  let loose = [];
  const flush = () => {
    if (loose.length) pushBlock(out, "paragraph", 0, collectHtmlSpans(loose));
    loose = [];
  };
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      loose.push(child);
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const tag = child.tagName.toLowerCase();
    if (HTML_SKIP_TAGS.has(tag)) continue;
    if (!HTML_BLOCK_TAGS.has(tag)) {
      loose.push(child);
      continue;
    }
    flush();
    htmlBlock(child, tag, out);
  }
  flush();
}

function htmlBlock(el, tag, out) {
  const heading = /^h([1-6])$/.exec(tag);
  if (heading) return pushBlock(out, "heading", Number(heading[1]), collectHtmlSpans(el.childNodes));
  if (tag === "hr") return;
  if (tag === "pre") return pushBlock(out, "paragraph", 0, [{ text: el.textContent.replace(/\n+$/, "") }]);
  if (tag === "tr") {
    const cells = Array.from(el.children).map((c) => c.textContent.replace(/\s+/g, " ").trim());
    return pushBlock(out, "paragraph", 0, [{ text: cells.filter(Boolean).join(" | ") }]);
  }
  if (tag !== "li") return walkHtmlBlocks(el, out);
  // A list item's own words, then any list nested inside it
  const inline = [];
  const nested = [];
  for (const c of el.childNodes) {
    const t = c.nodeType === Node.ELEMENT_NODE ? c.tagName.toLowerCase() : "";
    (t === "ul" || t === "ol" ? nested : inline).push(c);
  }
  pushBlock(out, "list-item", 0, collectHtmlSpans(inline));
  nested.forEach((n) => walkHtmlBlocks(n, out));
}

function collectHtmlSpans(nodes) {
  const spans = [];
  const visit = (node, bold, italic) => {
    if (node.nodeType === Node.TEXT_NODE) return addSpan(spans, node.nodeValue.replace(/\s+/g, " "), bold, italic);
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName.toLowerCase();
    if (HTML_SKIP_TAGS.has(tag)) return;
    if (tag === "br") return addSpan(spans, "\n", bold, italic);
    const style = node.style || {};
    const b = bold || HTML_BOLD_TAGS.has(tag) || HTML_BOLD_WEIGHT.test(style.fontWeight || "");
    const i = italic || HTML_ITALIC_TAGS.has(tag) || style.fontStyle === "italic";
    for (const c of node.childNodes) visit(c, b, i);
  };
  for (const n of nodes) visit(n, false, false);
  return spans;
}

/**
 * RTF: body text with bold/italic, \outlinelevel headings and bullet lists.
 * @param {string} rtf
 * @returns {DocElement[]}
 */
export function parseRtf(rtf) {
  const out = [];
  const stack = [];
  let state = { bold: false, italic: false, skip: false, uc: 1 };
  let para = { spans: [], heading: 0, list: false, listFromText: false };
  let skipChars = 0; // fallback characters after a \u escape
  const emit = (text) => {
    if (state.skip || !text) return;
    if (skipChars > 0) {
      const dropped = Math.min(skipChars, text.length);
      skipChars -= dropped;
      text = text.slice(dropped);
    }
    addSpan(para.spans, text, state.bold, state.italic);
  };
  const endParagraph = () => {
    const type = para.list || para.listFromText ? "list-item" : para.heading ? "heading" : "paragraph";
    pushBlock(out, type, para.heading, para.spans);
    para = { spans: [], heading: para.heading, list: para.list, listFromText: false };
  };

  RTF_TOKEN.lastIndex = 0;
  let m;
  while ((m = RTF_TOKEN.exec(rtf)) !== null) {
    const [, word, num, hex, symbol, brace, text] = m;
    if (brace === "{") {
      stack.push(state);
      state = { ...state };
      continue;
    }
    if (brace === "}") {
      state = stack.pop() || state;
      continue;
    }
    if (text !== undefined) {
      emit(text);
      continue;
    }
    if (hex !== undefined) {
      if (skipChars > 0) skipChars--;
      else emit(CP1252.decode(new Uint8Array([parseInt(hex, 16)])));
      continue;
    }
    if (symbol !== undefined) {
      if (symbol === "*") state.skip = true;
      else if (symbol === "~") emit(" ");
      else if (symbol === "_") emit("-");
      else if (symbol === "\\" || symbol === "{" || symbol === "}") emit(symbol);
      else if (symbol === "\n" || symbol === "\r") endParagraph();
      continue;
    }
    if (word === undefined) continue;
    if (RTF_SKIP_DESTINATIONS.has(word)) {
      if (word === "pntext" || word === "listtext") para.listFromText = true;
      state.skip = true;
      continue;
    }
    const n = num === undefined ? null : Number(num);
    if (word === "par" || word === "sect" || word === "page") endParagraph();
    else if (word === "pard") Object.assign(para, { heading: 0, list: false });
    else if (word === "outlinelevel") para.heading = (n || 0) + 1;
    else if (word === "ls") para.list = true;
    else if (word === "b") state.bold = n !== 0;
    else if (word === "i") state.italic = n !== 0;
    else if (word === "plain") Object.assign(state, { bold: false, italic: false });
    else if (word === "uc") state.uc = n || 0;
    else if (word === "u") {
      emit(String.fromCharCode(n < 0 ? n + UINT16_SPAN : n));
      skipChars = state.uc;
    } else if (word === "cell") emit(" | ");
    else if (word === "row") endParagraph();
    else if (RTF_SYMBOLS[word]) emit(RTF_SYMBOLS[word]);
  }
  endParagraph();
  return out;
}

// ==========================================
// GENERATORS
// ==========================================

/** Joins blocks with blank lines, keeping consecutive list items tight. */
function joinBlocks(elements, render) {
  let out = "";
  elements.forEach((el, i) => {
    if (i > 0) out += el.type === "list-item" && elements[i - 1].type === "list-item" ? "\n" : "\n\n";
    out += render(el);
  });
  return out + "\n";
}

/** @param {DocElement[]} elements */
export function generateTxt(elements) {
  return joinBlocks(elements, (el) => (el.type === "list-item" ? "- " : "") + plainText(el));
}

const escapeMd = (text) => text.replace(/([\\`*_[\]<>])/g, "\\$1");

/** @param {DocElement[]} elements */
export function generateMd(elements) {
  return joinBlocks(elements, (el) => {
    const body = el.spans
      .map((s) => {
        const marker = s.bold && s.italic ? "***" : s.bold ? "**" : s.italic ? "*" : "";
        const [, lead, core, trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(escapeMd(s.text));
        return core && marker ? lead + marker + core + marker + trail : lead + core + trail;
      })
      .join("");
    if (el.type === "heading") return "#".repeat(el.level || 1) + " " + body.replace(/\n/g, " ");
    if (el.type === "list-item") return "- " + body.replace(/\n/g, "  \n  ");
    // A paragraph that starts like markdown syntax would be read back as it
    return body
      .replace(/^(#|[-+]\s)/gm, "\\$1")
      .replace(/^(\d+)\.(\s)/gm, "$1\\.$2")
      .replace(/\n/g, "  \n");
  });
}

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** @param {DocElement[]} elements */
export function generateHtml(elements) {
  const firstHeading = elements.find((el) => el.type === "heading");
  const title = escapeHtml(firstHeading ? plainText(firstHeading).replace(/\n/g, " ") : HTML_DEFAULT_TITLE);
  let body = "";
  let inList = false;
  for (const el of elements) {
    const inner = el.spans
      .map((s) => {
        let t = escapeHtml(s.text).replace(/\n/g, "<br>");
        if (s.italic) t = `<em>${t}</em>`;
        if (s.bold) t = `<strong>${t}</strong>`;
        return t;
      })
      .join("");
    if (el.type === "list-item") {
      if (!inList) body += "<ul>\n";
      inList = true;
      body += `  <li>${inner}</li>\n`;
      continue;
    }
    if (inList) body += "</ul>\n";
    inList = false;
    const tag = el.type === "heading" ? `h${Math.min(6, el.level || 1)}` : "p";
    body += `<${tag}>${inner}</${tag}>\n`;
  }
  if (inList) body += "</ul>\n";
  return (
    `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">\n` +
    `<title>${title}</title>\n<style>${HTML_PAGE_STYLE}</style>\n</head>\n<body>\n${body}</body>\n</html>\n`
  );
}

/** RTF-escapes text: braces/backslashes, \uN for non-ASCII, \line and \tab. */
function escapeRtf(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = text.charCodeAt(i);
    if (ch === "\\" || ch === "{" || ch === "}") out += "\\" + ch;
    else if (ch === "\n") out += "\\line ";
    else if (ch === "\t") out += "\\tab ";
    else if (code > ASCII_MAX) out += `\\u${code > INT16_MAX ? code - UINT16_SPAN : code}?`;
    else out += ch;
  }
  return out;
}

const rtfSpans = (spans) =>
  spans
    .map((s) => {
      const t = escapeRtf(s.text);
      if (!s.bold && !s.italic) return t;
      return `{${s.bold ? "\\b" : ""}${s.italic ? "\\i" : ""} ${t}}`;
    })
    .join("");

/** @param {DocElement[]} elements */
export function generateRtf(elements) {
  let rtf = "{\\rtf1\\ansi\\ansicpg1252\\deff0\\uc1{\\fonttbl{\\f0\\fswiss Arial;}}\n";
  for (const el of elements) {
    if (el.type === "heading") {
      const level = Math.min(6, el.level || 1);
      rtf += `\\pard\\sb240\\sa120\\outlinelevel${level - 1}\\b\\fs${RTF_HEADING_SIZES[level]} `;
      rtf += escapeRtf(plainText(el)) + `\\b0\\fs${RTF_BODY_SIZE}\\par\n`;
    } else if (el.type === "list-item") {
      rtf += `\\pard{\\pntext\\bullet\\tab}{\\*\\pn\\pnlvlblt\\pnindent360{\\pntxtb\\bullet}}\\fi-360\\li720\\sa60\\fs${RTF_BODY_SIZE} `;
      rtf += rtfSpans(el.spans) + "\\par\n";
    } else {
      rtf += `\\pard\\sa160\\fs${RTF_BODY_SIZE} ` + rtfSpans(el.spans) + "\\par\n";
    }
  }
  return rtf + "}";
}
