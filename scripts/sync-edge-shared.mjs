#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_DIR = "lib/chatbot";
const TARGET_DIR = "supabase/functions/_shared";

const FILES = ["types.ts", "config.ts", "estimate.ts", "proposal.ts", "canned.ts"];

const BANNER = `/**
 * GENERATED FILE — do not edit by hand.
 * Source: ${SOURCE_DIR}/{{name}}
 * Regenerate: bun run edge:sync
 */
`;

function addTsExtensions(source) {
  return source.replace(
    /(from\s+["'])(\.\.?\/[^"']+?)(["'])/g,
    (match, prefix, specifier, suffix) =>
      /\.(ts|tsx|js|mjs|json)$/.test(specifier)
        ? match
        : `${prefix}${specifier}.ts${suffix}`
  );
}

let written = 0;
for (const name of FILES) {
  const source = readFileSync(join(SOURCE_DIR, name), "utf8");
  const output = BANNER.replace("{{name}}", name) + "\n" + addTsExtensions(source);
  writeFileSync(join(TARGET_DIR, name), output, "utf8");
  console.log(`  ${SOURCE_DIR}/${name} -> ${TARGET_DIR}/${name}`);
  written += 1;
}

console.log(`\n${written} módulo(s) sincronizado(s) para a Edge Function.`);
