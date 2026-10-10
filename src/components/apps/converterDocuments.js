/**
 * converterDocuments.js
 * The Catalytic Converter's document lane (DOCX / PDF / ODT / RTF / HTML /
 * MD / TXT / legacy DOC). Detection is synchronous and light; the converter
 * engine (lib/convertDoc.js and its format modules) only loads the first
 * time a document is actually opened.
 */
import {
  DOCUMENT_INPUTS,
  DOCUMENT_OUTPUTS,
  DOCUMENT_BINARY_MIMES,
} from "../../lib/convertDocModel.js";

export { DOCUMENT_OUTPUTS };

const MARKDOWN_EXTS = ["md", "markdown"];
const EXT_ALIASES = { htm: "html", markdown: "md" };
const BINARY_MIME_SET = new Set(Object.values(DOCUMENT_BINARY_MIMES));
const PDF_MIME = DOCUMENT_BINARY_MIMES.pdf;
// Picked for you when a document opens: PDF, unless it already is one
const DEFAULT_OUTPUT = "pdf";
const DEFAULT_OUTPUT_FROM_PDF = "txt";
// A converted file that can go round again as a new input
const RECONVERTIBLE = /\.(dog|json|yml|ts|js|md|txt|html|rtf|docx|odt|pdf)$/i;
// ...and the ones of those that re-enter through the normal file path
const REOPENS_AS_FILE = /\.(md|txt|html|rtf|docx|odt|pdf)$/i;

/** Accept-list fragment for the file picker. */
export const DOCUMENT_ACCEPT = DOCUMENT_INPUTS.map((e) => "." + e).join(",");

const loadEngine = () => import("../../lib/convertDoc.js");

/** @param {string} ext */
export const isDocumentExt = (ext) => DOCUMENT_INPUTS.includes(ext);

/** @param {string} ext */
export const normalizeDocExt = (ext) => EXT_ALIASES[ext] || ext;

/** @param {string} inputFormat */
export const defaultDocumentOutput = (inputFormat) =>
  inputFormat === DEFAULT_OUTPUT ? DEFAULT_OUTPUT_FROM_PDF : DEFAULT_OUTPUT;

/**
 * Whether a file of this extension should open as a document. Markdown is
 * shared with the .dog data lane: a pipe table with next to no prose stays data.
 * @param {File} file
 * @param {string} ext
 * @returns {Promise<boolean>}
 */
export async function opensAsDocument(file, ext) {
  if (!isDocumentExt(ext)) return false;
  if (!MARKDOWN_EXTS.includes(ext)) return true;
  const { isMarkdownData } = await loadEngine();
  return !isMarkdownData(await file.text());
}

/**
 * Reads a document into the element model, plus counts for the preview panel.
 * @param {File} file
 * @param {string} ext
 * @returns {Promise<{ elements: import("../../lib/convertDocModel.js").DocElement[], stats: ReturnType<import("../../lib/convertDoc.js").documentStats> }>}
 */
export async function readDocument(file, ext) {
  const { parseDocument, documentStats } = await loadEngine();
  const elements = await parseDocument(file, ext);
  if (!elements.length) throw new Error("No readable text was found in this document.");
  return { elements, stats: documentStats(elements) };
}

/**
 * Writes already-parsed elements as one output format.
 * @param {import("../../lib/convertDocModel.js").DocElement[]} elements
 * @param {string} fmt
 * @returns {Promise<Blob>}
 */
export async function writeDocument(elements, fmt) {
  const { renderDocument } = await loadEngine();
  return renderDocument(elements, fmt);
}

/** Preview kind for a converted blob that is a binary document. */
export const isBinaryDocumentBlob = (blob) => !!blob && BINARY_MIME_SET.has(blob.type);

/** @param {Blob} blob */
export const isPdfBlob = (blob) => !!blob && blob.type === PDF_MIME;

/**
 * The converted output RECONVERT feeds back in, if any.
 * @param {{ name: string, blob?: Blob }[]} items
 */
export const reconvertCandidate = (items) => items.find((it) => it.blob && RECONVERTIBLE.test(it.name));

/** Outputs that go back in through the normal file path (documents, and markdown, which may be either). */
export const reopensAsFile = (name) => REOPENS_AS_FILE.test(name);
