/**
 * convertDocOffice.js
 * Word (.docx, legacy .doc) and OpenDocument (.odt) reading and writing for
 * convertDoc.js. Zips go through fflate; XML through the browser's DOMParser.
 * Element model: see convertDoc.js.
 */
import { unzipSync, zipSync, strToU8 } from "fflate";
import { addSpan, pushBlock } from "./convertDocModel.js";

const W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const W_STRICT_NS = "http://purl.oclc.org/ooxml/wordprocessingml/main";
const ODF_TEXT_NS = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
const ODF_STYLE_NS = "urn:oasis:names:tc:opendocument:xmlns:style:1.0";
const ODF_FO_NS = "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0";
const ODF_OFFICE_NS = "urn:oasis:names:tc:opendocument:xmlns:office:1.0";
const ODT_MIME = "application/vnd.oasis.opendocument.text";

const DOCX_PARTS = ["word/document.xml", "word/styles.xml"];
const ODT_PARTS = ["content.xml", "styles.xml"];
const XML_FALSE = new Set(["0", "false", "off", "none"]);
const DOCX_HEADING_NAME = /^heading\s*(\d)$/;
const MAX_HEADING = 6;
const TABLE_CELL_JOIN = " | ";
// Characters XML 1.0 forbids outright (legacy .doc text can carry them)
const XML_INVALID = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

// Heading sizes in half-points (docx) / points (odt), levels 1-6
const HEADING_HALF_POINTS = [0, 40, 32, 28, 26, 24, 24];
const BODY_HALF_POINTS = 22;

// Legacy .doc (Word 97-2003): OLE compound file + FIB + piece table
const CFB_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const CFB_MAX_REGULAR_SECTOR = 0xfffffffa;
const CFB_HEADER_DIFAT_ENTRIES = 109;
const CFB_DIR_ENTRY_SIZE = 128;
const CFB_DIR_STREAM = 2;
const CFB_DIR_ROOT = 5;
const WORD97_IDENT = 0xa5ec;
const FIB_FLAGS = 0x0a;
const FIB_ENCRYPTED = 0x0100;
const FIB_WHICH_TABLE = 0x0200;
const FIB_CCP_TEXT = 0x4c;
const FIB_FC_CLX = 0x1a2;
const FIB_LCB_CLX = 0x1a6;
const CLX_PRC = 0x01;
const CLX_PCDT = 0x02;
const PCD_SIZE = 8;
const PIECE_COMPRESSED = 0x40000000;
const PIECE_FC_MASK = 0x3fffffff;
const DOC_FIELD_BEGIN = 0x13;
const DOC_FIELD_SEPARATE = 0x14;
const DOC_FIELD_END = 0x15;

const CP1252 = new TextDecoder("windows-1252");
const UTF16LE = new TextDecoder("utf-16le");
const UTF8 = new TextDecoder("utf-8");

const escapeXml = (text) =>
  text
    .replace(XML_INVALID, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const parseXml = (bytes) => new DOMParser().parseFromString(UTF8.decode(bytes), "application/xml");

/** Unzips only the named parts. */
function unzipParts(bytes, names, label) {
  let files;
  try {
    files = unzipSync(bytes, { filter: (f) => names.includes(f.name) });
  } catch {
    throw new Error(`This ${label} file isn't a valid zip package — it may be damaged.`);
  }
  if (!files[names[0]]) throw new Error(`This ${label} file is missing ${names[0]}.`);
  return files;
}

// ==========================================
// DOCX
// ==========================================

/** styleId -> heading level, from word/styles.xml (names stay English in localized Word) */
function docxHeadingStyles(stylesBytes, ns) {
  const levels = {};
  if (!stylesBytes) return levels;
  for (const style of parseXml(stylesBytes).getElementsByTagNameNS(ns, "style")) {
    const id = style.getAttributeNS(ns, "styleId");
    const nameEl = style.getElementsByTagNameNS(ns, "name")[0];
    const name = (nameEl?.getAttributeNS(ns, "val") || "").toLowerCase();
    const outline = style.getElementsByTagNameNS(ns, "outlineLvl")[0];
    const named = DOCX_HEADING_NAME.exec(name);
    if (named) levels[id] = Number(named[1]);
    else if (name === "title") levels[id] = 1;
    else if (outline) levels[id] = Number(outline.getAttributeNS(ns, "val")) + 1;
  }
  return levels;
}

const isOn = (el, ns) => !!el && !XML_FALSE.has((el.getAttributeNS(ns, "val") || "").toLowerCase());

/**
 * @param {Uint8Array} bytes
 * @returns {import("./convertDocModel.js").DocElement[]}
 */
export function parseDocx(bytes) {
  const files = unzipParts(bytes, DOCX_PARTS, "DOCX");
  const doc = parseXml(files["word/document.xml"]);
  const ns = doc.documentElement.namespaceURI === W_STRICT_NS ? W_STRICT_NS : W_NS;
  const body = doc.getElementsByTagNameNS(ns, "body")[0];
  if (!body) throw new Error("This DOCX file has no document body.");
  const styles = docxHeadingStyles(files["word/styles.xml"], ns);
  const out = [];

  const runText = (run, spans) => {
    const rPr = run.getElementsByTagNameNS(ns, "rPr")[0];
    const bold = isOn(rPr?.getElementsByTagNameNS(ns, "b")[0], ns);
    const italic = isOn(rPr?.getElementsByTagNameNS(ns, "i")[0], ns);
    for (const c of run.children) {
      if (c.localName === "t") addSpan(spans, c.textContent, bold, italic);
      else if (c.localName === "tab") addSpan(spans, "\t", bold, italic);
      else if (c.localName === "br" || c.localName === "cr") addSpan(spans, "\n", bold, italic);
      else if (c.localName === "noBreakHyphen") addSpan(spans, "-", bold, italic);
    }
  };
  // Runs can sit inside hyperlinks, insertions, smart tags and simple fields
  const collectRuns = (node, spans) => {
    for (const c of node.children) {
      if (c.localName === "pPr" || c.localName === "del") continue;
      if (c.localName === "r") runText(c, spans);
      else collectRuns(c, spans);
    }
  };
  const paragraphSpans = (p) => {
    const spans = [];
    collectRuns(p, spans);
    return spans;
  };
  const paragraph = (p) => {
    const pPr = p.getElementsByTagNameNS(ns, "pPr")[0];
    const styleId = pPr?.getElementsByTagNameNS(ns, "pStyle")[0]?.getAttributeNS(ns, "val");
    const outline = pPr?.getElementsByTagNameNS(ns, "outlineLvl")[0];
    const level = styles[styleId] || (outline ? Number(outline.getAttributeNS(ns, "val")) + 1 : 0);
    const isList = !!pPr?.getElementsByTagNameNS(ns, "numPr")[0];
    pushBlock(out, isList ? "list-item" : level ? "heading" : "paragraph", level, paragraphSpans(p));
  };
  const tableRow = (tr) => {
    const cells = Array.from(tr.getElementsByTagNameNS(ns, "tc")).map((tc) =>
      Array.from(tc.getElementsByTagNameNS(ns, "p"))
        .map((p) => paragraphSpans(p).map((s) => s.text).join(""))
        .join(" ")
        .trim(),
    );
    pushBlock(out, "paragraph", 0, [{ text: cells.filter(Boolean).join(TABLE_CELL_JOIN) }]);
  };
  const walk = (node) => {
    for (const c of node.children) {
      if (c.localName === "p") paragraph(c);
      else if (c.localName === "tbl") Array.from(c.children).filter((r) => r.localName === "tr").forEach(tableRow);
      else if (c.localName !== "sectPr") walk(c); // sdt, sdtContent, customXml...
    }
  };
  walk(body);
  return out;
}

const docxRun = (span) => {
  const props = (span.bold ? "<w:b/>" : "") + (span.italic ? "<w:i/>" : "");
  const rPr = props ? `<w:rPr>${props}</w:rPr>` : "";
  const parts = span.text.split(/(\n|\t)/);
  const inner = parts
    .map((part) =>
      part === "\n" ? "<w:br/>" : part === "\t" ? "<w:tab/>" : part ? `<w:t xml:space="preserve">${escapeXml(part)}</w:t>` : "",
    )
    .join("");
  return `<w:r>${rPr}${inner}</w:r>`;
};

function docxStylesXml() {
  let headings = "";
  for (let level = 1; level <= MAX_HEADING; level++) {
    headings +=
      `<w:style w:type="paragraph" w:styleId="Heading${level}"><w:name w:val="heading ${level}"/>` +
      `<w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>` +
      `<w:pPr><w:keepNext/><w:spacing w:before="240" w:after="80"/><w:outlineLvl w:val="${level - 1}"/></w:pPr>` +
      `<w:rPr><w:b/><w:sz w:val="${HEADING_HALF_POINTS[level]}"/></w:rPr></w:style>`;
  }
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:styles xmlns:w="${W_NS}">` +
    `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>` +
    `<w:sz w:val="${BODY_HALF_POINTS}"/></w:rPr></w:rPrDefault>` +
    `<w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>` +
    `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>` +
    headings +
    `<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/>` +
    `<w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="40"/><w:ind w:left="720"/></w:pPr></w:style>` +
    `</w:styles>`
  );
}

const DOCX_NUMBERING_XML =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<w:numbering xmlns:w="${W_NS}">` +
  `<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/>` +
  `<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/>` +
  `<w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>` +
  `<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

const DOCX_CONTENT_TYPES =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
  `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
  `<Default Extension="xml" ContentType="application/xml"/>` +
  `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
  `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
  `<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>` +
  `</Types>`;

const OFFICE_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const DOCX_ROOT_RELS =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="${OFFICE_REL}/officeDocument" Target="word/document.xml"/></Relationships>`;
const DOCX_DOCUMENT_RELS =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="${OFFICE_REL}/styles" Target="styles.xml"/>` +
  `<Relationship Id="rId2" Type="${OFFICE_REL}/numbering" Target="numbering.xml"/></Relationships>`;

/**
 * @param {import("./convertDocModel.js").DocElement[]} elements
 * @returns {Uint8Array} the .docx zip
 */
export function generateDocx(elements) {
  let body = "";
  for (const el of elements) {
    const pPr =
      el.type === "heading"
        ? `<w:pPr><w:pStyle w:val="Heading${Math.min(MAX_HEADING, el.level || 1)}"/></w:pPr>`
        : el.type === "list-item"
          ? `<w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>`
          : "";
    body += `<w:p>${pPr}${el.spans.map(docxRun).join("")}</w:p>`;
  }
  const documentXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:document xmlns:w="${W_NS}"><w:body>${body}` +
    `<w:sectPr><w:pgSz w:w="12240" w:h="15840"/>` +
    `<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>` +
    `</w:sectPr></w:body></w:document>`;
  return zipSync({
    "[Content_Types].xml": strToU8(DOCX_CONTENT_TYPES),
    "_rels/.rels": strToU8(DOCX_ROOT_RELS),
    "word/_rels/document.xml.rels": strToU8(DOCX_DOCUMENT_RELS),
    "word/document.xml": strToU8(documentXml),
    "word/styles.xml": strToU8(docxStylesXml()),
    "word/numbering.xml": strToU8(DOCX_NUMBERING_XML),
  });
}

// ==========================================
// ODT
// ==========================================

/** text style name -> { bold, italic }, from automatic and common styles */
function odtTextStyles(...docs) {
  const map = {};
  for (const doc of docs) {
    if (!doc) continue;
    for (const style of doc.getElementsByTagNameNS(ODF_STYLE_NS, "style")) {
      const props = style.getElementsByTagNameNS(ODF_STYLE_NS, "text-properties")[0];
      const parent = style.getAttributeNS(ODF_STYLE_NS, "parent-style-name");
      map[style.getAttributeNS(ODF_STYLE_NS, "name")] = {
        bold: /bold|[6-9]00/.test(props?.getAttributeNS(ODF_FO_NS, "font-weight") || ""),
        italic: /italic|oblique/.test(props?.getAttributeNS(ODF_FO_NS, "font-style") || ""),
        parent,
      };
    }
  }
  return map;
}

/**
 * @param {Uint8Array} bytes
 * @returns {import("./convertDocModel.js").DocElement[]}
 */
export function parseOdt(bytes) {
  const files = unzipParts(bytes, ODT_PARTS, "ODT");
  const content = parseXml(files["content.xml"]);
  const textBody = content.getElementsByTagNameNS(ODF_OFFICE_NS, "text")[0];
  if (!textBody) throw new Error("This ODT file has no text body.");
  const styles = odtTextStyles(files["styles.xml"] ? parseXml(files["styles.xml"]) : null, content);
  const styleOf = (name) => {
    const s = styles[name];
    if (!s) return { bold: false, italic: false };
    const p = s.parent && s.parent !== name ? styleOf(s.parent) : { bold: false, italic: false };
    return { bold: s.bold || p.bold, italic: s.italic || p.italic };
  };
  const out = [];

  const inlineSpans = (el) => {
    const spans = [];
    const visit = (node, bold, italic) => {
      if (node.nodeType === Node.TEXT_NODE) return addSpan(spans, node.nodeValue.replace(/\s+/g, " "), bold, italic);
      if (node.nodeType !== Node.ELEMENT_NODE || node.namespaceURI !== ODF_TEXT_NS) return;
      const tag = node.localName;
      if (tag === "s") return addSpan(spans, " ".repeat(Number(node.getAttributeNS(ODF_TEXT_NS, "c")) || 1), bold, italic);
      if (tag === "tab") return addSpan(spans, "\t", bold, italic);
      if (tag === "line-break") return addSpan(spans, "\n", bold, italic);
      if (tag === "note" || tag === "bookmark" || tag === "soft-page-break") return;
      const own = tag === "span" ? styleOf(node.getAttributeNS(ODF_TEXT_NS, "style-name")) : { bold: false, italic: false };
      for (const c of node.childNodes) visit(c, bold || own.bold, italic || own.italic);
    };
    const own = styleOf(el.getAttributeNS(ODF_TEXT_NS, "style-name"));
    for (const c of el.childNodes) visit(c, own.bold, own.italic);
    return spans;
  };
  const walk = (node, inList) => {
    for (const c of node.children) {
      const tag = c.localName;
      if (tag === "h") pushBlock(out, "heading", Number(c.getAttributeNS(ODF_TEXT_NS, "outline-level")) || 1, inlineSpans(c));
      else if (tag === "p") pushBlock(out, inList ? "list-item" : "paragraph", 0, inlineSpans(c));
      else if (tag === "list") walk(c, true);
      else if (tag === "table-row") {
        const cells = Array.from(c.children).map((cell) => cell.textContent.replace(/\s+/g, " ").trim());
        pushBlock(out, "paragraph", 0, [{ text: cells.filter(Boolean).join(TABLE_CELL_JOIN) }]);
      } else if (tag !== "sequence-decls" && tag !== "tracked-changes") walk(c, inList);
    }
  };
  walk(textBody, false);
  return out;
}

const odtText = (text) =>
  escapeXml(text)
    .replace(/ {2,}/g, (run) => ` <text:s text:c="${run.length - 1}"/>`)
    .replace(/\t/g, "<text:tab/>")
    .replace(/\n/g, "<text:line-break/>");

const odtSpans = (spans) =>
  spans
    .map((s) => {
      const style = s.bold && s.italic ? "BI" : s.bold ? "B" : s.italic ? "I" : "";
      return style ? `<text:span text:style-name="${style}">${odtText(s.text)}</text:span>` : odtText(s.text);
    })
    .join("");

const ODF_NAMESPACES =
  `xmlns:office="${ODF_OFFICE_NS}" xmlns:text="${ODF_TEXT_NS}" xmlns:style="${ODF_STYLE_NS}" xmlns:fo="${ODF_FO_NS}"`;

function odtStylesXml() {
  let headings = "";
  for (let level = 1; level <= MAX_HEADING; level++) {
    headings +=
      `<style:style style:name="Heading_20_${level}" style:display-name="Heading ${level}" style:family="paragraph" ` +
      `style:default-outline-level="${level}" style:next-style-name="Standard">` +
      `<style:paragraph-properties fo:margin-top="0.42cm" fo:margin-bottom="0.21cm" fo:keep-with-next="always"/>` +
      `<style:text-properties fo:font-size="${HEADING_HALF_POINTS[level] / 2}pt" fo:font-weight="bold"/></style:style>`;
  }
  return (
    `<?xml version="1.0" encoding="UTF-8"?><office:document-styles ${ODF_NAMESPACES} office:version="1.2">` +
    `<office:styles><style:style style:name="Standard" style:family="paragraph">` +
    `<style:paragraph-properties fo:margin-bottom="0.28cm"/>` +
    `<style:text-properties fo:font-size="${BODY_HALF_POINTS / 2}pt"/></style:style>${headings}</office:styles>` +
    `</office:document-styles>`
  );
}

const ODT_AUTOMATIC_STYLES =
  `<office:automatic-styles>` +
  `<style:style style:name="B" style:family="text"><style:text-properties fo:font-weight="bold"/></style:style>` +
  `<style:style style:name="I" style:family="text"><style:text-properties fo:font-style="italic"/></style:style>` +
  `<style:style style:name="BI" style:family="text"><style:text-properties fo:font-weight="bold" fo:font-style="italic"/></style:style>` +
  `<text:list-style style:name="L1"><text:list-level-style-bullet text:level="1" text:bullet-char="•">` +
  `<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">` +
  `<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.27cm" ` +
  `fo:text-indent="-0.635cm" fo:margin-left="1.27cm"/></style:list-level-properties>` +
  `</text:list-level-style-bullet></text:list-style></office:automatic-styles>`;

const ODT_MANIFEST =
  `<?xml version="1.0" encoding="UTF-8"?>` +
  `<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">` +
  `<manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="${ODT_MIME}"/>` +
  `<manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>` +
  `<manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>` +
  `</manifest:manifest>`;

/**
 * @param {import("./convertDocModel.js").DocElement[]} elements
 * @returns {Uint8Array} the .odt zip
 */
export function generateOdt(elements) {
  let body = "";
  let inList = false;
  for (const el of elements) {
    if (el.type === "list-item") {
      if (!inList) body += `<text:list text:style-name="L1">`;
      inList = true;
      body += `<text:list-item><text:p text:style-name="Standard">${odtSpans(el.spans)}</text:p></text:list-item>`;
      continue;
    }
    if (inList) body += "</text:list>";
    inList = false;
    if (el.type === "heading") {
      const level = Math.min(MAX_HEADING, el.level || 1);
      body += `<text:h text:style-name="Heading_20_${level}" text:outline-level="${level}">${odtSpans(el.spans)}</text:h>`;
    } else {
      body += `<text:p text:style-name="Standard">${odtSpans(el.spans)}</text:p>`;
    }
  }
  if (inList) body += "</text:list>";
  const contentXml =
    `<?xml version="1.0" encoding="UTF-8"?><office:document-content ${ODF_NAMESPACES} office:version="1.2">` +
    `${ODT_AUTOMATIC_STYLES}<office:body><office:text>${body}</office:text></office:body></office:document-content>`;
  // The mimetype entry must come first and be stored uncompressed
  return zipSync({
    mimetype: [strToU8(ODT_MIME), { level: 0 }],
    "META-INF/manifest.xml": strToU8(ODT_MANIFEST),
    "styles.xml": strToU8(odtStylesXml()),
    "content.xml": strToU8(contentXml),
  });
}

// ==========================================
// LEGACY .DOC (Word 97-2003)
// ==========================================

/**
 * Minimal OLE compound-file reader: just enough to pull named streams.
 * @param {Uint8Array} bytes
 * @returns {{ stream: (name: string) => Uint8Array | null }}
 */
function readCompoundFile(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const sectorSize = 1 << view.getUint16(0x1e, true);
  const miniSectorSize = 1 << view.getUint16(0x20, true);
  const miniCutoff = view.getUint32(0x38, true);
  const perSector = sectorSize / 4;
  const sectorAt = (s) => (s + 1) * sectorSize;
  const u32 = (pos) => (pos + 4 <= bytes.length ? view.getUint32(pos, true) : 0xffffffff);

  const fatSectors = [];
  for (let i = 0; i < CFB_HEADER_DIFAT_ENTRIES; i++) {
    const s = u32(0x4c + i * 4);
    if (s <= CFB_MAX_REGULAR_SECTOR) fatSectors.push(s);
  }
  const seen = new Set();
  for (let d = u32(0x44); d <= CFB_MAX_REGULAR_SECTOR && !seen.has(d); d = u32(sectorAt(d) + (perSector - 1) * 4)) {
    seen.add(d);
    for (let i = 0; i < perSector - 1; i++) {
      const s = u32(sectorAt(d) + i * 4);
      if (s <= CFB_MAX_REGULAR_SECTOR) fatSectors.push(s);
    }
  }
  const fat = new Uint32Array(fatSectors.length * perSector);
  fatSectors.forEach((s, k) => {
    for (let i = 0; i < perSector; i++) fat[k * perSector + i] = u32(sectorAt(s) + i * 4);
  });

  const chain = (start, table) => {
    const out = [];
    for (let s = start; s <= CFB_MAX_REGULAR_SECTOR && s < table.length && out.length < table.length; s = table[s]) out.push(s);
    return out;
  };
  const readChain = (start, size) => {
    const sectors = chain(start, fat);
    const out = new Uint8Array(sectors.length * sectorSize);
    sectors.forEach((s, k) => out.set(bytes.subarray(sectorAt(s), sectorAt(s) + sectorSize), k * sectorSize));
    return size === undefined ? out : out.subarray(0, size);
  };

  const dir = readChain(u32(0x30));
  const dirView = new DataView(dir.buffer, dir.byteOffset, dir.byteLength);
  const entries = [];
  for (let off = 0; off + CFB_DIR_ENTRY_SIZE <= dir.length; off += CFB_DIR_ENTRY_SIZE) {
    const nameLen = dirView.getUint16(off + 0x40, true);
    entries.push({
      name: UTF16LE.decode(dir.subarray(off, off + Math.max(0, nameLen - 2))),
      type: dir[off + 0x42],
      start: dirView.getUint32(off + 0x74, true),
      size: dirView.getUint32(off + 0x78, true),
    });
  }
  const root = entries.find((e) => e.type === CFB_DIR_ROOT);
  const miniStream = root ? readChain(root.start, root.size) : new Uint8Array(0);
  const miniFatBytes = readChain(u32(0x3c));
  const miniFat = new Uint32Array(miniFatBytes.length / 4);
  const miniView = new DataView(miniFatBytes.buffer, miniFatBytes.byteOffset, miniFatBytes.byteLength);
  for (let i = 0; i < miniFat.length; i++) miniFat[i] = miniView.getUint32(i * 4, true);

  return {
    stream(name) {
      const entry = entries.find((e) => e.type === CFB_DIR_STREAM && e.name === name);
      if (!entry) return null;
      if (entry.size >= miniCutoff) return readChain(entry.start, entry.size);
      const sectors = chain(entry.start, miniFat);
      const out = new Uint8Array(sectors.length * miniSectorSize);
      sectors.forEach((s, k) =>
        out.set(miniStream.subarray(s * miniSectorSize, (s + 1) * miniSectorSize), k * miniSectorSize),
      );
      return out.subarray(0, entry.size);
    },
  };
}

/** Reassembles the document text from the piece table in the Clx. */
function readPieceTable(word, clx, maxChars) {
  const v = new DataView(clx.buffer, clx.byteOffset, clx.byteLength);
  let pos = 0;
  while (pos < clx.length && clx[pos] === CLX_PRC) pos += 3 + v.getInt16(pos + 1, true);
  if (clx[pos] !== CLX_PCDT) throw new Error("Couldn't find the text inside this .doc file.");
  const lcb = v.getUint32(pos + 1, true);
  const plc = pos + 5;
  const pieces = (lcb - 4) / (4 + PCD_SIZE);
  let text = "";
  for (let i = 0; i < pieces && text.length < maxChars; i++) {
    const count = v.getUint32(plc + (i + 1) * 4, true) - v.getUint32(plc + i * 4, true);
    const fcRaw = v.getUint32(plc + (pieces + 1) * 4 + i * PCD_SIZE + 2, true);
    if (fcRaw & PIECE_COMPRESSED) {
      const fc = (fcRaw & PIECE_FC_MASK) / 2;
      text += CP1252.decode(word.subarray(fc, fc + count));
    } else {
      text += UTF16LE.decode(word.subarray(fcRaw, fcRaw + count * 2));
    }
  }
  return text.slice(0, maxChars);
}

/** Drops field instructions and maps Word's control characters to text. */
function cleanDocText(text) {
  let out = "";
  const fields = []; // per open field: still in its instruction part?
  for (const ch of text) {
    const c = ch.charCodeAt(0);
    if (c === DOC_FIELD_BEGIN) fields.push(true);
    else if (c === DOC_FIELD_SEPARATE && fields.length) fields[fields.length - 1] = false;
    else if (c === DOC_FIELD_END) fields.pop();
    else if (!fields.some(Boolean)) out += ch;
  }
  return out
    .replace(/\x07\x07/g, "\r") // cell end + row end
    .replace(/\x07/g, TABLE_CELL_JOIN)
    .replace(/\x0b/g, "\n")
    .replace(/\x0c/g, "\r")
    .replace(/\x1e/g, "-")
    .replace(/[\x00-\x08\x0e-\x1f]/g, "");
}

/**
 * @param {Uint8Array} bytes
 * @returns {import("./convertDocModel.js").DocElement[]}
 */
export function parseDoc(bytes) {
  if (!CFB_SIGNATURE.every((b, i) => bytes[i] === b)) {
    throw new Error("This .doc isn't a Word 97-2003 document. Try saving it as .docx.");
  }
  const cfb = readCompoundFile(bytes);
  const word = cfb.stream("WordDocument");
  if (!word) throw new Error("This file has no Word document inside it.");
  const fib = new DataView(word.buffer, word.byteOffset, word.byteLength);
  if (fib.getUint16(0, true) !== WORD97_IDENT) {
    throw new Error("Word 95 and older .doc files aren't supported. Re-save it as .docx.");
  }
  const flags = fib.getUint16(FIB_FLAGS, true);
  if (flags & FIB_ENCRYPTED) throw new Error("This .doc is password-protected.");
  const table = cfb.stream(flags & FIB_WHICH_TABLE ? "1Table" : "0Table");
  if (!table) throw new Error("This .doc file is missing its table stream.");
  const fcClx = fib.getUint32(FIB_FC_CLX, true);
  const lcbClx = fib.getUint32(FIB_LCB_CLX, true);
  const text = readPieceTable(word, table.subarray(fcClx, fcClx + lcbClx), fib.getInt32(FIB_CCP_TEXT, true));
  const out = [];
  for (const para of cleanDocText(text).split("\r")) {
    pushBlock(out, "paragraph", 0, [{ text: para.replace(/[ \t]+$/g, "") }]);
  }
  return out;
}
