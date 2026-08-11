// ES5 syntax tripwire for everything old TVs execute: the GoPro-lite page,
// the lite hub, and the inline scripts in index.html / 404.html. Runs in the
// build chain so CI fails a deploy that sneaks modern syntax into TV code.
//
// Parser: acorn at ecmaVersion 5 (hoisted via terser, a direct devDep) —
// it throws on let/const, arrows, template literals, classes, etc.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const acorn = require("acorn");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Whole files that must be ES5. */
const ES5_FILES = [
  "public/gopro/tv.js",
  "public/gopro/catalog.js",
  "public/lite/lite.js",
];

/** HTML files whose inline <script> bodies must be ES5. */
const ES5_HTML = ["index.html", "public/404.html", "public/gopro/index.html", "public/lite/index.html"];

let failures = 0;

function checkSource(label, code) {
  try {
    acorn.parse(code, { ecmaVersion: 5 });
    console.log(`  ok   ${label}`);
  } catch (err) {
    failures++;
    console.error(`  FAIL ${label}: ${err.message}`);
  }
}

for (const rel of ES5_FILES) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue; // optional pages may not exist yet
  checkSource(rel, fs.readFileSync(file, "utf8"));
}

for (const rel of ES5_HTML) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  // Inline scripts only — tags with src load separately-checked files.
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  let i = 0;
  while ((m = re.exec(html)) !== null) {
    i++;
    if (!m[1].trim()) continue;
    checkSource(`${rel} <script #${i}>`, m[1]);
  }
}

if (failures > 0) {
  console.error(`check-es5: ${failures} file(s) contain non-ES5 syntax`);
  process.exit(1);
}
console.log("check-es5: all TV-facing scripts are ES5-clean");
