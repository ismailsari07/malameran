/**
 * Asserts that no colour-only CSS property is handed a variable that resolves
 * to an image.
 *
 * The bug this exists to prevent: a Tailwind background utility pointed at a
 * CSS variable emits `background-color: var(...)`, and the grounds in this
 * project are layered gradients. A gradient is an <image>, not a <color>. Because var() is
 * substituted at computed-value time the parser cannot reject it, so the
 * declaration is accepted and then falls back to the property's initial value
 * — transparent — with no warning, no console error and nothing in the build
 * output. The element simply renders with no background.
 *
 * Asserting that a declaration was emitted does not catch this: the emitted
 * declaration is exactly the one you would assert. The check has to go one
 * level further and ask whether the substituted value is legal for the
 * property.
 *
 * Run against the built CSS: pnpm build && node scripts/check-css-vars.mjs
 *
 * Note: Tailwind scans comments as well as code, so a class name written in
 * prose generates that class. Nothing in this file, or in any source comment,
 * should spell out a utility that this check would then flag.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CSS_DIR = ".next/static/chunks";

/** Properties whose value must be a <color>. A gradient here is a silent bug. */
const COLOUR_ONLY_PROPERTIES = [
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-inline-color",
  "border-block-color",
  "outline-color",
  "text-decoration-color",
  "caret-color",
  "accent-color",
  "fill",
  "stroke",
  "column-rule-color",
];

/** Anything that produces an <image> rather than a <color>. */
const IMAGE_FUNCTIONS =
  /\b(?:repeating-)?(?:linear|radial|conic)-gradient\(|\burl\(|\bimage-set\(|\bcross-fade\(|\belement\(/;

function loadCss() {
  let files;
  try {
    files = readdirSync(CSS_DIR).filter((f) => f.endsWith(".css"));
  } catch {
    console.error(`No built CSS at ${CSS_DIR}. Run \`pnpm build\` first.`);
    process.exit(2);
  }
  if (files.length === 0) {
    console.error(`No .css files in ${CSS_DIR}. Run \`pnpm build\` first.`);
    process.exit(2);
  }
  return files.map((f) => readFileSync(join(CSS_DIR, f), "utf8")).join("\n");
}

/**
 * Every definition of every custom property. A variable can be declared more
 * than once — Tailwind emits a static fallback plus an @supports block for
 * color-mix — so all of them are collected and any image among them counts.
 */
function collectVariableDefinitions(css) {
  const definitions = new Map();
  // --name: value;  up to the next top-level semicolon or closing brace.
  const pattern = /(--[A-Za-z0-9_-]+)\s*:\s*([^;}]*)/g;
  for (const match of css.matchAll(pattern)) {
    const [, name, rawValue] = match;
    const value = rawValue.trim();
    if (!value) continue;
    const existing = definitions.get(name);
    if (existing) existing.push(value);
    else definitions.set(name, [value]);
  }
  return definitions;
}

/** Follows var(--a) → var(--b) → … until a literal value or a cycle. */
function resolve(name, definitions, seen = new Set()) {
  if (seen.has(name)) return [];
  seen.add(name);

  const values = definitions.get(name);
  if (!values) return [];

  const resolved = [];
  for (const value of values) {
    const indirection = value.match(/^var\(\s*(--[A-Za-z0-9_-]+)\s*\)$/);
    if (indirection) {
      resolved.push(...resolve(indirection[1], definitions, seen));
    } else {
      resolved.push(value);
    }
  }
  return resolved;
}

const css = loadCss();
const definitions = collectVariableDefinitions(css);

const problems = [];
const checked = [];

for (const property of COLOUR_ONLY_PROPERTIES) {
  // property: var(--x)  — with or without a fallback argument.
  const pattern = new RegExp(
    `(?<![-\\w])${property}\\s*:\\s*var\\(\\s*(--[A-Za-z0-9_-]+)`,
    "g",
  );
  for (const match of css.matchAll(pattern)) {
    const variable = match[1];
    const values = resolve(variable, definitions);
    if (values.length === 0) {
      problems.push(
        `${property}: var(${variable}) — the variable is never defined`,
      );
      continue;
    }
    const offending = values.find((v) => IMAGE_FUNCTIONS.test(v));
    if (offending) {
      problems.push(
        `${property}: var(${variable}) resolves to an image, not a colour\n` +
          `      ${variable}: ${offending.slice(0, 90)}${offending.length > 90 ? "…" : ""}\n` +
          `      A gradient is invalid for ${property} and falls back to the initial value.\n` +
          `      Use the \`background\` shorthand — the .ground-* classes — instead.`,
      );
    } else {
      checked.push(`${property}: var(${variable})`);
    }
  }
}

const unique = [...new Set(checked)];
const uniqueProblems = [...new Set(problems)];

console.log(`Checked ${unique.length} colour properties fed by a variable.`);
for (const line of unique.sort()) console.log(`  ok   ${line}`);

if (uniqueProblems.length > 0) {
  console.error(`\n${uniqueProblems.length} problem(s):`);
  for (const line of uniqueProblems) console.error(`  FAIL ${line}`);
  process.exit(1);
}
console.log("\nNo colour property is fed a gradient.");
