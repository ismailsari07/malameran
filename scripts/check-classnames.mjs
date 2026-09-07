// A className passed into a component must not fight a utility that component
// already sets on the same element.
//
// `cn()` is a plain join, on purpose: "every component variant in this codebase
// is a closed map of complete class strings, so there is never a conflicting
// pair of utilities to resolve." That is true of the maps and false at any call
// site that adds one. When two utilities from the same property group land in
// one class attribute, the winner is whichever Tailwind emits later — not the
// one written last. That is how `<Button className="hidden lg:inline-flex">`
// stayed visible on mobile: Button's base begins with `inline-flex`, and
// `.inline-flex` is emitted after `.hidden`.
//
// SCOPE, deliberately narrow. Only layout-critical groups where a silent
// override changes the page rather than nudging it, and only where BOTH sides
// are unprefixed — `flex` versus `lg:inline-flex` is well defined, because
// Tailwind always emits responsive variants after the utilities they override.
// Margins, padding, colour and type are not checked: no component base sets a
// margin, and a colour clash is visible the moment you look at it.
//
// Run: pnpm check:classnames

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Utilities that decide layout, grouped by the CSS property they set. */
const GROUPS = {
  display: [
    "block",
    "inline-block",
    "inline",
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
    "contents",
    "hidden",
    "table",
    "flow-root",
  ],
  position: ["static", "fixed", "absolute", "relative", "sticky"],
  width: ["w-full", "w-auto", "w-fit", "w-screen", "w-min", "w-max"],
  "flex-direction": [
    "flex-row",
    "flex-row-reverse",
    "flex-col",
    "flex-col-reverse",
  ],
};

const groupOf = new Map();
for (const [group, utils] of Object.entries(GROUPS)) {
  for (const u of utils) groupOf.set(u, group);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const files = walk("src");

/**
 * A component's risky utilities.
 *
 * Only files that merge `className` through `cn()` are considered: a component
 * that assigns `className={className}` bare puts nothing of its own on that
 * element, so nothing can conflict. For the rest, every class-like literal in
 * the file counts — Button reaches its base through two helper hops, and
 * following those properly would be a parser rather than a check.
 */
const componentUtils = new Map();
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const name = /export function ([A-Z][A-Za-z]*)/.exec(src)?.[1];
  if (!name) continue;
  if (!/cn\(\s*[^)]*className/s.test(src)) continue;

  const utils = new Set();
  for (const [, literal] of src.matchAll(/"([^"\n]*)"/g)) {
    for (const cls of literal.split(/\s+/)) {
      if (groupOf.has(cls)) utils.add(cls);
    }
  }
  if (utils.size) componentUtils.set(name, utils);
}

const findings = [];
for (const file of files) {
  const src = readFileSync(file, "utf8");

  for (const match of src.matchAll(
    /<([A-Z][A-Za-z]*)\b((?:[^>"']|"[^"]*"|'[^']*')*?)\/?>/g,
  )) {
    const [, tag, attrs] = match;
    const passed = /className="([^"]*)"/.exec(attrs)?.[1];
    if (!passed) continue;
    const owned = componentUtils.get(tag);
    if (!owned) continue;

    for (const cls of passed.split(/\s+/)) {
      // Only unprefixed utilities. A variant is resolved by Tailwind's own
      // ordering and is safe.
      if (cls.includes(":")) continue;
      const group = groupOf.get(cls);
      if (!group) continue;
      const clash = [...owned].find((o) => groupOf.get(o) === group);
      if (!clash) continue;

      // From the match offset, not a string search: a comment quoting the same
      // className would otherwise be reported instead of the call site.
      const line = src.slice(0, match.index).split("\n").length;
      findings.push({ file, line, tag, cls, clash, group });
    }
  }
}

if (findings.length) {
  for (const f of findings) {
    console.error(`${f.file}:${f.line}  <${f.tag} className="… ${f.cls} …">`);
    console.error(
      `  ${f.tag} already sets "${f.clash}" on that element (${f.group}).`,
    );
    console.error(
      `  Both are unprefixed, so the cascade decides, not the class order.`,
    );
    console.error(`  Make it a prop on ${f.tag} instead.\n`);
  }
  console.error(`${findings.length} conflicting className override(s).`);
  process.exit(1);
}

console.log(
  `No className override fights a component's own display, position, width or flex-direction.`,
);
console.log(
  `Checked ${files.length} files against ${componentUtils.size} components.`,
);
