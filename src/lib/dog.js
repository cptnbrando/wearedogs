/**
 * dog.js — .dog format parser + converters
 * .dog <-> json, .dog -> ts, .dog -> md
 * Header line drives parsing: dog 1 indent=2 kv=space block=track end=blank case=any punct=none
 */

export function parseHeader(line) {
  const parts = line.trim().split(/\s+/);
  const spec = { format: parts[0], version: parts[1] };
  for (const p of parts.slice(2)) {
    const eq = p.indexOf("=");
    if (eq > 0) spec[p.slice(0, eq)] = p.slice(eq + 1);
  }
  return spec;
}

// The one escape in the format: a backslash immediately before a run of
// spaces protects the run — those spaces are literal value content, never
// separators. Parsing swaps protected spaces for NUL, then restores them.
const protect = (s) => s.replace(/\\( +)/g, (m, sp) => "\x00".repeat(sp.length));
const restore = (s) => s.replace(/\x00/g, " ");

function coerce(raw, bools = "truefalse") {
  const v = restore(raw);
  const s = v.toLowerCase();
  // Always-legal booleans: true/false in ANY casing, and t/f.
  if (s === "true" || s === "t") return true;
  if (s === "false" || s === "f") return false;
  // Declared-encoding booleans (0/1 and y/n are ambiguous with numbers or
  // strings, so they only coerce when the header opts in).
  if (bools === "10") {
    if (v === "1") return true;
    if (v === "0") return false;
  } else if (bools === "yn") {
    if (s === "y") return true;
    if (s === "n") return false;
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

/** Builds a spec object from encoding options (the customizable header). */
export function specFromOpts(o = {}) {
  const spec = { format: "dog", version: "1" };
  const flow = o.flow ?? "block";
  if (flow === "block") {
    spec.indent = String(o.indent ?? 2);
  } else {
    spec.flow = flow;
    if (flow === "wire") spec.bs = "4space";
    spec.fs = "2space";
  }
  spec.kv = "space";
  spec.block = o.block || "track";
  if (flow === "block") spec.end = "blank";
  spec.case = o.case ?? "any";
  spec.punct = "none";
  if ((o.bools ?? "truefalse") !== "truefalse") spec.bools = o.bools;
  return spec;
}

export function headerLine(spec) {
  const head = [spec.format, spec.version];
  for (const [k, v] of Object.entries(spec)) {
    if (k === "format" || k === "version") continue;
    head.push(`${k}=${v}`);
  }
  return head.join(" ");
}

const DEFAULT_OPTS = { indent: 2, block: "track", case: "any", flow: "block", bools: "truefalse" };

/** True when every encoding option matches the dog 1 defaults. */
export function isDefaultOpts(o = {}) {
  return Object.entries(DEFAULT_OPTS).every(
    ([k, d]) => String(o[k] ?? d) === String(d),
  );
}

/**
 * dog 1 is the non-customizable version: untouched defaults = bare "dog 1".
 * Touch ANY option and the file becomes dog 2, its header carrying the rules.
 */
export function headerFromOpts(o = {}) {
  if (isDefaultOpts(o)) return "dog 1";
  const spec = specFromOpts(o);
  spec.version = "2";
  return headerLine(spec);
}

export function parse(text) {
  const lines = text.split(/\r?\n/).map(protect);
  const spec = parseHeader(lines[0]);
  const indentN = Number(spec.indent ?? 2);
  const blockKey = (spec.block ?? "track").toLowerCase();
  const caseAny = (spec.case ?? "any") === "any";
  const bools = spec.bools ?? "truefalse";
  const canon = new Map();
  const blocks = [];
  let cur = null;
  let lastKey = null;

  // Flow modes: line = one block per line, wire = whole payload on one line.
  // Fields split on 2+ spaces (fs=2space), wire blocks on 4+ spaces (bs=4space).
  if (spec.flow === "line" || spec.flow === "wire") {
    const body = lines.slice(1).filter((l) => l.trim());
    const chunks =
      spec.flow === "wire"
        ? body.join(" ").split(/\s{4,}/)
        : body;
    for (const chunk of chunks) {
      const fields = chunk.trim().split(/\s{2,}/);
      if (!fields.length || !fields[0]) continue;
      const sp0 = fields[0].indexOf(" ");
      const kw = sp0 > 0 ? fields[0].slice(0, sp0) : fields[0];
      if ((caseAny ? kw.toLowerCase() : kw) !== blockKey) continue;
      const blk = { name: sp0 > 0 ? restore(fields[0].slice(sp0 + 1).trim()) : "" };
      for (const f of fields.slice(1)) {
        const sp = f.indexOf(" ");
        let key = sp > 0 ? f.slice(0, sp) : f;
        if (caseAny) {
          const lk = key.toLowerCase();
          if (canon.has(lk)) key = canon.get(lk);
          else canon.set(lk, key);
        }
        // bare key = true; repeated key = list
        const val = sp > 0 ? coerce(f.slice(sp + 1), bools) : true;
        if (key in blk && key !== "name") {
          if (Array.isArray(blk[key])) blk[key].push(val);
          else blk[key] = [blk[key], val];
        } else blk[key] = val;
      }
      blocks.push(blk);
    }
    return { spec, tracks: blocks };
  }

  for (const raw of lines.slice(1)) {
    if (!raw.trim()) {
      if (cur) { blocks.push(cur); cur = null; }
      lastKey = null;
      continue;
    }
    const lead = raw.match(/^ */)[0].length;
    if (lead === 0) {
      const sp = raw.indexOf(" ");
      const kw = sp > 0 ? raw.slice(0, sp) : raw;
      if ((caseAny ? kw.toLowerCase() : kw) === blockKey) {
        if (cur) blocks.push(cur);
        cur = { name: sp > 0 ? restore(raw.slice(sp + 1).trim()) : "" };
        lastKey = null;
      }
      continue;
    }
    if (!cur) continue;
    const t = raw.trim();
    // Continuation rule: indented deeper than the field indent = the line
    // belongs to the previous field's value, joined with a space.
    if (lead > indentN + 1 && lastKey) {
      const prev = cur[lastKey];
      if (Array.isArray(prev)) prev[prev.length - 1] = String(prev[prev.length - 1]) + " " + restore(t);
      else cur[lastKey] = String(prev) + " " + restore(t);
      continue;
    }
    const sp = t.indexOf(" ");
    let key = sp > 0 ? t.slice(0, sp) : t;
    if (caseAny) {
      const lk = key.toLowerCase();
      if (canon.has(lk)) key = canon.get(lk);
      else canon.set(lk, key);
    }
    // bare key = true; repeated key = list
    const val = sp > 0 ? coerce(t.slice(sp + 1), bools) : true;
    if (key in cur && key !== "name") {
      if (Array.isArray(cur[key])) cur[key].push(val);
      else cur[key] = [cur[key], val];
    } else cur[key] = val;
    lastKey = key;
  }
  if (cur) blocks.push(cur);
  return { spec, tracks: blocks };
}

export function stringify(doc, opts) {
  const spec = opts
    ? specFromOpts(opts)
    : (doc.spec ?? specFromOpts({}));
  const header = opts ? headerFromOpts(opts) : headerLine(spec);
  const flow = spec.flow ?? "block";
  const bools = spec.bools ?? "truefalse";
  const blockKey = spec.block ?? "track";

  const enc = (v) => {
    if (typeof v === "boolean") {
      if (bools === "10") return v ? "1" : "0";
      if (bools === "tf") return v ? "t" : "f";
      if (bools === "yn") return v ? "y" : "n";
      return v ? "true" : "false";
    }
    // Runs of 2+ spaces are separators, so literal runs inside values are
    // written with the format's one escape: a backslash before the run.
    return String(v)
      .replace(/\s*\r?\n\s*/g, " ")
      .replace(/ {2,}/g, (m) => "\\" + m);
  };

  // repeated key = list, so arrays serialize as repeated fields;
  // true serializes as a bare key.
  const fieldStrs = (t) => {
    const out = [];
    for (const [k, v] of Object.entries(t)) {
      if (k === "name") continue;
      for (const one of Array.isArray(v) ? v : [v]) {
        out.push(one === true && bools === "truefalse" ? k : `${k} ${enc(one)}`);
      }
    }
    return out;
  };

  if (flow === "line" || flow === "wire") {
    const blockStrs = doc.tracks.map((t) =>
      [`${blockKey} ${enc(t.name ?? "")}`, ...fieldStrs(t)].join("  "),
    );
    const body = flow === "wire" ? [blockStrs.join("    ")] : blockStrs;
    return [header, "", ...body, ""].join("\n");
  }

  const indent = " ".repeat(Number(spec.indent ?? 2));
  const out = [header, ""];
  for (const t of doc.tracks) {
    out.push(`${blockKey} ${enc(t.name ?? "")}`);
    for (const f of fieldStrs(t)) out.push(indent + f);
    out.push("");
  }
  return out.join("\n");
}

/**
 * Reads a generated .ts/.js module back into a doc — works when the file fits
 * the exact shape this converter emits: JSON-literal `export const spec` and
 * `export const tracks`. Anything else throws with a clear message.
 */
export function fromTS(text) {
  const tracksMatch = text.match(/export const tracks[^=]*=\s*(\[[\s\S]*?\n\]);/);
  if (!tracksMatch) {
    throw new Error(
      "This TS/JS file doesn't fit the generated shape (needs a JSON-literal `export const tracks = [...]`).",
    );
  }
  let tracks;
  try {
    tracks = JSON.parse(tracksMatch[1]);
  } catch {
    throw new Error("`export const tracks` isn't a pure JSON literal — can't read it back.");
  }
  let spec = null;
  const specMatch = text.match(/export const spec[^=]*=\s*(\{.*?\});/);
  if (specMatch) {
    try { spec = JSON.parse(specMatch[1]); } catch {}
  }
  return { spec: spec ?? parseHeader("dog 1"), tracks };
}
/** Detects the data format of pasted/typed text: dog, json, or yml. */
export function detectDataFormat(text) {
  const first = (text.split(/\r?\n/).find((l) => l.trim()) ?? "").trim();
  if (/^dog\s+\d/i.test(first)) return "dog";
  if (/export const (tracks|spec)/.test(text)) return "ts";
  try {
    JSON.parse(text);
    return "json";
  } catch {}
  if (/^[^\n]*:\s*$/m.test(text) || /^\s*- .*:/m.test(text) || /^#/.test(first)) return "yml";
  return "dog";
}

/**
 * Minimal YAML reader for the flat shape this converter emits:
 * an optional spec: map and a tracks: list of flat key/value entries.
 * Double-quoted scalars are JSON; repeated keys append to lists.
 */
export function fromYAML(text) {
  const scalar = (s) => {
    s = s.trim();
    if (s.startsWith('"')) {
      try { return JSON.parse(s); } catch { return s; }
    }
    if (/^(true)$/i.test(s)) return true;
    if (/^(false)$/i.test(s)) return false;
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    return s;
  };
  const spec = {};
  const tracks = [];
  let mode = null;
  let cur = null;
  for (const raw of text.split(/\r?\n/)) {
    const t = raw.trim();
    if (!t || t.startsWith("#")) continue;
    if (/^spec:\s*$/.test(t)) { mode = "spec"; continue; }
    if (/^tracks:\s*$/.test(t)) { mode = "tracks"; continue; }
    const m = t.match(/^(- )?("(?:[^"\\]|\\.)*"|[^:]+):\s?(.*)$/);
    if (!m) continue;
    const [, dash, rawKey, rawVal] = m;
    const key = String(scalar(rawKey));
    const val = scalar(rawVal);
    if (mode === "spec") { spec[key] = val; continue; }
    if (dash || (!cur && mode === "tracks")) { cur = {}; tracks.push(cur); }
    if (!cur) continue;
    if (key in cur && key !== "name") {
      if (Array.isArray(cur[key])) cur[key].push(val);
      else cur[key] = [cur[key], val];
    } else cur[key] = val;
  }
  return {
    spec: Object.keys(spec).length ? spec : parseHeader("dog 1"),
    tracks,
  };
}
/** Any JSON -> dog doc. Accepts {spec, tracks}, a bare array of flat objects, or a single object. */
export function fromJSON(json) {
  const obj = typeof json === "string" ? JSON.parse(json) : json;
  if (obj && obj.spec && Array.isArray(obj.tracks)) return obj;
  const items = Array.isArray(obj) ? obj : (Array.isArray(obj?.tracks) ? obj.tracks : [obj]);
  const tracks = items.map((it, i) => {
    const t = { name: it.name ?? it.id ?? it.title ?? `block${i + 1}` };
    for (const [k, v] of Object.entries(it)) {
      if (k === "name" || v === null) continue;
      if (Array.isArray(v) && v.every((x) => typeof x !== "object")) {
        t[k] = v; // lists of scalars survive: repeated key = list
        continue;
      }
      if (typeof v === "object") continue;
      t[k] = v;
    }
    return t;
  });
  return { spec: parseHeader("dog 1 indent=2 kv=space block=track end=blank case=any punct=none"), tracks };
}

function inferFields(tracks) {
  const fields = new Map();
  for (const t of tracks) {
    for (const [k, v] of Object.entries(t)) {
      if (!fields.has(k)) fields.set(k, { types: new Set(), count: 0, example: v });
      const f = fields.get(k);
      f.types.add(Array.isArray(v) ? "list" : typeof v);
      f.count++;
    }
  }
  return fields;
}

const tsType = (types) => [...types].sort().map((t) => (t === "list" ? "any[]" : t)).join(" | ");

export function toTS(doc) {
  const fields = inferFields(doc.tracks);
  const total = doc.tracks.length;
  const lines = ["// https://wearedogs.net/.dog", ""];
  lines.push("export interface DogsSpec {");
  for (const k of Object.keys(doc.spec)) lines.push(`  ${JSON.stringify(k)}: string;`);
  lines.push("}", "");
  lines.push("export interface Track {");
  for (const [k, f] of fields) {
    lines.push(`  ${JSON.stringify(k)}${f.count < total ? "?" : ""}: ${tsType(f.types)};`);
  }
  lines.push("}", "");
  lines.push(`export const spec: DogsSpec = ${JSON.stringify(doc.spec)};`, "");
  lines.push(`export const tracks: Track[] = ${JSON.stringify(doc.tracks, null, 2)};`);
  return lines.join("\n");
}

export function toDocs(doc) {
  const fields = inferFields(doc.tracks);
  const total = doc.tracks.length;
  const block = doc.spec?.block ?? "track";
  const esc = (s) => String(s).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  const cell = (v) =>
    v === undefined ? "" : Array.isArray(v) ? v.map(esc).join(", ") : esc(v);
  const keys = [...fields.keys()];

  // The data itself leads: a markdown table of every block.
  const l = [`# ${block}s (${total})`, ""];
  l.push("```");
  l.push(headerLine(doc.spec ?? { format: "dog", version: "1" }));
  l.push("```", "");
  l.push("| " + keys.map(esc).join(" | ") + " |");
  l.push("|" + keys.map(() => "---").join("|") + "|");
  for (const t of doc.tracks) {
    l.push("| " + keys.map((k) => cell(t[k])).join(" | ") + " |");
  }

  // Field inventory below the data.
  l.push("", "## fields", "");
  l.push("| key | type | on | example |", "|---|---|---|---|");
  for (const [k, f] of fields) {
    const ex =
      String(f.example).length > 40
        ? String(f.example).slice(0, 40) + "…"
        : f.example;
    l.push(`| ${esc(k)} | ${esc(tsType(f.types))} | ${f.count}/${total} | ${esc(ex)} |`);
  }
  l.push("", "made with https://wearedogs.net/.dog", "");
  return l.join("\n");
}

export function toJS(doc) {
  return [
    "// https://wearedogs.net/.dog",
    "",
    `export const spec = ${JSON.stringify(doc.spec, null, 2)};`,
    "",
    `export const tracks = ${JSON.stringify(doc.tracks, null, 2)};`,
    "",
    "export default { spec, tracks };",
    "",
  ].join("\n");
}

// YAML: double-quoted JSON strings are valid YAML scalars, so anything
// that isn't a plainly-safe string gets JSON.stringify'd.
function yamlKey(k) {
  return /^[A-Za-z0-9_]+$/.test(k) ? k : JSON.stringify(k);
}

function yamlScalar(v) {
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  const s = String(v);
  const plain =
    /^[A-Za-z][A-Za-z0-9 _.\/()!?-]*$/.test(s) &&
    !/^(true|false|null|yes|no|on|off)$/i.test(s) &&
    !/[ ]$/.test(s);
  return plain ? s : JSON.stringify(s);
}

export function toYAML(doc) {
  const l = ["# https://wearedogs.net/.dog", "spec:"];
  for (const [k, v] of Object.entries(doc.spec)) l.push(`  ${yamlKey(k)}: ${yamlScalar(v)}`);
  l.push("tracks:");
  for (const t of doc.tracks) {
    let first = true;
    for (const [k, v] of Object.entries(t)) {
      l.push(`${first ? "  - " : "    "}${yamlKey(k)}: ${yamlScalar(v)}`);
      first = false;
    }
  }
  return l.join("\n") + "\n";
}

const MIMES = {
  dog: "text/plain",
  json: "application/json",
  js: "text/javascript",
  yml: "application/yaml",
  ts: "text/plain",
  md: "text/markdown",
};

/**
 * Converts data text between formats.
 * @param {string} text - input file content
 * @param {string} inputFmt - 'dog' | 'json'
 * @param {string} outputFmt - 'dog' | 'json' | 'js' | 'yml' | 'ts' | 'md'
 * @param {object} [dogOpts] - .dog encoding options (indent, block, flow, bools, case)
 * @returns {Blob}
 */
export function convertData(text, inputFmt, outputFmt, dogOpts) {
  const doc =
    inputFmt === "json" ? fromJSON(text)
    : inputFmt === "yml" ? fromYAML(text)
    : inputFmt === "ts" || inputFmt === "js" ? fromTS(text)
    : parse(text);
  let out;
  if (outputFmt === "dog") out = stringify(doc, dogOpts ?? {});
  else if (outputFmt === "json") out = JSON.stringify(doc, null, 2);
  else if (outputFmt === "js") out = toJS(doc);
  else if (outputFmt === "yml") out = toYAML(doc);
  else if (outputFmt === "ts") out = toTS(doc);
  else if (outputFmt === "md") out = toDocs(doc);
  else throw new Error(`Unknown data output format: ${outputFmt}`);
  return new Blob([out], { type: MIMES[outputFmt] ?? "text/plain" });
}
