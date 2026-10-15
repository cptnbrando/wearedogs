/**
 * convertDocModel.js
 * The small element model every document parser and writer shares:
 *
 *   DocElement = { type: "heading" | "paragraph" | "list-item", level?, spans }
 *   DocSpan    = { text, bold?, italic? }   ("\n" inside text = hard line break)
 *
 * Kept in its own module so the format modules never import each other.
 */

/**
 * @typedef {{ text: string, bold?: boolean, italic?: boolean }} DocSpan
 * @typedef {{ type: "heading" | "paragraph" | "list-item", level?: number, spans: DocSpan[] }} DocElement
 */

const MAX_HEADING = 6;

// Extensions read as documents (.md only when it isn't a .dog data table)
export const DOCUMENT_INPUTS = ["txt", "md", "markdown", "html", "htm", "rtf", "docx", "odt", "doc", "pdf"];
export const DOCUMENT_OUTPUTS = ["pdf", "docx", "odt", "rtf", "html", "md", "txt"];
// Outputs that are binary files rather than readable text
export const DOCUMENT_BINARY_MIMES = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  odt: "application/vnd.oasis.opendocument.text",
  pdf: "application/pdf",
};

/**
 * Appends text to a span list, merging into the last span when the style matches.
 * @param {DocSpan[]} spans
 * @param {string} text
 * @param {boolean} [bold]
 * @param {boolean} [italic]
 */
export function addSpan(spans, text, bold, italic) {
  if (!text) return;
  const last = spans[spans.length - 1];
  if (last && !!last.bold === !!bold && !!last.italic === !!italic) {
    last.text += text;
    return;
  }
  spans.push({ text, bold: !!bold, italic: !!italic });
}

/** Collapses doubled spaces across span edges and trims the ends. */
function tidySpans(spans) {
  const out = [];
  let prevEnd = "\n";
  for (const s of spans) {
    let text = s.text.replace(/ *\n */g, "\n");
    if (prevEnd === " " || prevEnd === "\n") text = text.replace(/^ +/, "");
    if (!text) continue;
    out.push({ ...s, text });
    prevEnd = text[text.length - 1];
  }
  while (out.length) {
    const last = out[out.length - 1];
    last.text = last.text.replace(/[ \n]+$/, "");
    if (last.text) break;
    out.pop();
  }
  if (out.length) out[0].text = out[0].text.replace(/^\n+/, "");
  return out.filter((s) => s.text);
}

/**
 * Pushes a block unless it holds no visible text.
 * @param {DocElement[]} out
 * @param {DocElement["type"]} type
 * @param {number} level - heading level (ignored for other types)
 * @param {DocSpan[]} spans
 */
export function pushBlock(out, type, level, spans) {
  const tidy = tidySpans(spans);
  if (!tidy.some((s) => s.text.trim())) return;
  if (type !== "heading") {
    out.push({ type, spans: tidy });
    return;
  }
  out.push({ type, level: Math.min(MAX_HEADING, Math.max(1, level || 1)), spans: tidy });
}

/** @param {DocElement} el */
export const plainText = (el) => el.spans.map((s) => s.text).join("");
