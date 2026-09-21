/**
 * errorReport.js
 * Turns a failed Catalytic Converter run into a prefilled GitHub issue.
 *
 * The site is static, so there is no token and nothing is sent silently: the
 * report opens github.com's "new issue" form already filled in, and the person
 * reviews it before submitting. File NAMES and file contents never go in the
 * report (the repo is public) — only extension, MIME type and size.
 */

const REPO = "cptnbrando/wearedogs";
const MAX_URL = 7000; // GitHub rejects very long prefill URLs (~8KB)
const MAX_STACK = 1500;

/** Plain, serializable snapshot of anything that was thrown. */
export function describeError(err) {
  if (!err) return { name: "Error", message: "Unknown error", stack: "" };
  // MediaRecorder hands over an ErrorEvent-like object, not an Error
  const inner = err.error instanceof Error ? err.error : err;
  const cause = inner.cause ? describeError(inner.cause) : null;
  return {
    name: inner.name || inner.constructor?.name || "Error",
    message: String(inner.message || inner.type || inner),
    stack: String(inner.stack || "").slice(0, MAX_STACK),
    ...(cause ? { cause: { name: cause.name, message: cause.message } } : {}),
  };
}

/**
 * True when the browser could not get the file's bytes at all — the file is
 * too big to hold in memory, or it moved/changed after it was picked.
 */
export function isReadFailure(err) {
  const name = err?.name || "";
  if (name === "NotReadableError" || name === "NotFoundError") return true;
  return name === "RangeError" && /alloc|buffer|length/i.test(err?.message || "");
}

/** Message for the error panel; the raw browser text stays in the report. */
export function friendlyErrorMessage(err, fileSize = 0) {
  if (isReadFailure(err)) {
    const big = fileSize > 1024 * 1024 * 1024;
    return big
      ? `The browser could not read this file. At ${formatSize(fileSize)} it is too large to load into memory for this conversion.`
      : "The browser could not read this file. It was probably moved, renamed or changed after you picked it — drop it in again.";
  }
  return err?.message || "An error occurred during format conversion.";
}

function formatSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
}

function environment() {
  const nav = typeof navigator === "undefined" ? {} : navigator;
  return {
    userAgent: nav.userAgent || "unknown",
    deviceMemory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "unknown",
    cores: nav.hardwareConcurrency || "unknown",
    page: typeof location === "undefined" ? "" : location.pathname,
    time: new Date().toISOString(),
  };
}

/**
 * @param {object} f failure context
 * @param {string} f.stage       'load' | 'convert' | 'zip' | 'batch'
 * @param {object} f.error       describeError() output
 * @param {string} [f.shown]     message the person actually saw
 * @param {object} [f.input]     { ext, mime, size, fileType, inputFormat }
 * @param {string} [f.target]    the output format that was running
 * @param {string[]} [f.targets] every selected output format
 * @param {object} [f.settings]  conversion knobs in play
 * @param {object} [f.notes]     extra key/values (e.g. audio decode state)
 * @returns {{ title: string, body: string }}
 */
export function buildConversionReport(f) {
  const input = f.input || {};
  const from = input.inputFormat || input.ext || "?";
  const to = f.target || (f.targets || []).join("+") || "?";
  const title = `[converter] ${from} → ${to} failed: ${f.error.name}`;

  const lines = [
    "<!-- Filed from the Catalytic Converter error panel. No file name or file contents are included. Add anything else you noticed above this line. -->",
    "",
    "### What failed",
    `- **Stage:** ${f.stage}`,
    `- **Conversion:** ${input.fileType || "?"} \`${from}\` → \`${to}\``,
    `- **Selected outputs:** ${(f.targets || []).map((t) => `\`${t}\``).join(", ") || "n/a"}`,
    `- **Error:** \`${f.error.name}: ${f.error.message}\``,
  ];
  if (f.error.cause) {
    lines.push(`- **Caused by:** \`${f.error.cause.name}: ${f.error.cause.message}\``);
  }
  if (f.shown && f.shown !== f.error.message) {
    lines.push(`- **Shown to user:** ${f.shown}`);
  }

  lines.push(
    "",
    "### Input file",
    `- **Extension:** \`.${input.ext || "?"}\``,
    `- **MIME type:** \`${input.mime || "(none reported)"}\``,
    `- **Size:** ${formatSize(input.size)} (${input.size ?? "?"} bytes)`,
  );

  const kv = (obj) =>
    Object.entries(obj || {})
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `- **${k}:** ${v}`);

  const settings = kv(f.settings);
  if (settings.length) lines.push("", "### Settings", ...settings);
  const notes = kv(f.notes);
  if (notes.length) lines.push("", "### Notes", ...notes);

  lines.push("", "### Environment", ...kv(environment()));

  return { title, body: lines.join("\n"), stack: f.error.stack || "" };
}

const stackSection = (stack) =>
  stack ? `\n\n### Stack\n\`\`\`\n${stack}\n\`\`\`\n` : "";

/** Prefilled github.com new-issue URL, trimmed to fit GitHub's URL limit. */
export function issueUrl(report) {
  const make = (stack) =>
    `https://github.com/${REPO}/issues/new?` +
    new URLSearchParams({
      title: report.title,
      body: report.body + stackSection(stack),
      labels: "bug",
    }).toString();

  let stack = report.stack || "";
  let url = make(stack);
  while (url.length > MAX_URL && stack.length > 0) {
    // Drop from the bottom — the throwing frame is at the top
    stack = stack.slice(0, Math.max(0, stack.length - 300));
    url = make(stack);
  }
  return url;
}

/** Full markdown text, for the clipboard. */
export function reportText(report) {
  return `${report.title}\n\n${report.body}${stackSection(report.stack)}`;
}

/**
 * Opens the prefilled issue in a new tab. A real link click (rather than
 * window.open) keeps popup blockers quiet and never hands over window.opener.
 */
export function openIssue(report) {
  const a = document.createElement("a");
  a.href = issueUrl(report);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
