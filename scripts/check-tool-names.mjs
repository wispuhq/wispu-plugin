#!/usr/bin/env node
// Checks that the README and every skill only name tools and arguments that
// exist on Wispu's public MCP profile, and that no internal or provider name
// leaks into customer-facing text. No dependencies: run with `node`.
//
// Conventions the docs follow so this check can read them:
// - A tool is written in backticks: `list_brands`.
// - A call with arguments is written as `tool_name(arg_a, arg_b)`; every
//   argument must be a top-level property of that tool's inputSchema.
// - A bare backticked argument (`expected_revision`) must belong to one of the
//   tools named in the same paragraph or bullet.
//
// The catalog is a vendored copy of the server's snapshot. Refresh it from the
// server repository whenever the public tools change, then fix what fails.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const catalogPath = join(root, "catalog", "public-mcp-tools.snapshot.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const tools = new Map(
  catalog.map((tool) => [tool.name, new Set(Object.keys(tool.inputSchema?.properties ?? {}))]),
);
const allArgs = new Set([...tools.values()].flatMap((props) => [...props]));

// Arguments nearly every tool takes (brand, idempotency_key) may be named in
// any paragraph, even next to a tool that does not take them, such as
// `list_brands` returning the code you then pass as `brand`.
const argCounts = new Map();
for (const props of tools.values()) {
  for (const prop of props) argCounts.set(prop, (argCounts.get(prop) ?? 0) + 1);
}
const universalArgs = new Set(
  [...argCounts].filter(([, count]) => count >= tools.size * 0.9).map(([prop]) => prop),
);

// A snake_case word whose first segment is a tool verb reads as a tool name.
// The verbs come from the catalog, plus verbs of retired tools so their old
// names (save_ideas, draft_content, analyze_post...) keep failing.
const retiredVerbs = ["propose", "analyze", "draft", "find", "check", "revise", "save"];
const toolVerbs = new Set([...[...tools.keys()].map((name) => name.split("_")[0]), ...retiredVerbs]);
const snakeCase = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)+$/;

// Internal names never shown to customers: infrastructure providers, the
// internal product name, retired endpoints and internal rollout labels.
const forbiddenTerms = [
  { label: "Zernio", pattern: /\bzernio\b/i },
  { label: "Nylas", pattern: /\bnylas\b/i },
  { label: "SES", pattern: /\bSES\b/ },
  { label: "Notifuse", pattern: /\bnotifuse\b/i },
  { label: "Kapso", pattern: /\bkapso\b/i },
  { label: "Mux", pattern: /\bmux\b/i },
  { label: "Apify", pattern: /\bapify\b/i },
  { label: "Firecrawl", pattern: /\bfirecrawl\b/i },
  { label: "Nango", pattern: /\bnango\b/i },
  { label: "Tinybird", pattern: /\btinybird\b/i },
  { label: "Vercel", pattern: /\bvercel\b/i },
  { label: "Supabase", pattern: /\bsupabase\b/i },
  { label: "leverio / Leverio OS", pattern: /leverio/i },
  { label: "B2", pattern: /\bB2\b/ },
  { label: "edge_v2", pattern: /edge_v2/i },
  { label: "legacy", pattern: /\blegacy\b/i },
  { label: "mcp.wispu.app", pattern: /mcp\.wispu\.app/i },
  { label: "app.leverio.co", pattern: /app\.leverio\.co/i },
];

// Filler that makes the docs read as generated text.
const styleTerms = [
  { label: "delve", pattern: /\bdelv(e|es|ing)\b/i },
  { label: "leverage", pattern: /\bleverag(e|es|ing)\b/i },
  { label: "robust", pattern: /\brobust\b/i },
  { label: "seamless", pattern: /\bseamless(ly)?\b/i },
  { label: "streamline", pattern: /\bstreamlin(e|es|ed|ing)\b/i },
  { label: "em dash", pattern: /—/ },
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const docFiles = [
  join(root, "README.md"),
  ...walk(join(root, "plugins", "wispu", "skills")).filter((path) => path.endsWith(".md")),
];
const manifestFiles = [
  join(root, ".claude-plugin", "marketplace.json"),
  join(root, "plugins", "wispu", ".claude-plugin", "plugin.json"),
  join(root, "plugins", "wispu", ".mcp.json"),
];

const errors = [];
const report = (file, line, message) =>
  errors.push(`${relative(root, file)}:${line}: ${message}`);

function checkTerms(file, text) {
  text.split("\n").forEach((lineText, index) => {
    for (const { label, pattern } of [...forbiddenTerms, ...styleTerms]) {
      if (pattern.test(lineText)) report(file, index + 1, `forbidden term "${label}"`);
    }
  });
}

// Splits a Markdown file into blocks (paragraphs, bullets, table rows) with
// the line each starts on. Fenced code blocks are left out of the tool check:
// they hold install commands and config, not tool usage.
function blocks(text) {
  const result = [];
  let current = null;
  let fenced = false;
  text.split("\n").forEach((lineText, index) => {
    if (/^\s*```/.test(lineText)) {
      fenced = !fenced;
      current = null;
      return;
    }
    if (fenced) return;
    const startsBlock = /^\s*([-*]|\d+\.)\s/.test(lineText) || /^\s*\|/.test(lineText) || /^#/.test(lineText);
    if (lineText.trim() === "") {
      current = null;
      return;
    }
    if (!current || startsBlock) {
      current = { line: index + 1, text: lineText };
      result.push(current);
    } else {
      current.text += `\n${lineText}`;
    }
  });
  return result;
}

function checkTools(file, text) {
  for (const block of blocks(text)) {
    const spans = [...block.text.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim());
    const named = new Set();
    const bare = [];

    for (const span of spans) {
      const call = span.match(/^([a-z][a-z0-9_]*)\(([^)]*)\)$/);
      if (call) {
        const [, name, argList] = call;
        if (!tools.has(name)) {
          report(file, block.line, `unknown tool \`${name}\``);
          continue;
        }
        named.add(name);
        for (const arg of argList.split(",").map((value) => value.trim()).filter(Boolean)) {
          if (!tools.get(name).has(arg)) {
            report(file, block.line, `\`${name}\` has no argument \`${arg}\``);
          }
        }
        continue;
      }
      if (tools.has(span)) {
        named.add(span);
        continue;
      }
      if (allArgs.has(span)) {
        bare.push(span);
        continue;
      }
      if (snakeCase.test(span) && toolVerbs.has(span.split("_")[0])) {
        report(file, block.line, `unknown tool \`${span}\``);
      }
    }

    if (named.size === 0) continue;
    for (const arg of bare) {
      if (universalArgs.has(arg)) continue;
      if (![...named].some((name) => tools.get(name).has(arg))) {
        report(file, block.line, `\`${arg}\` is not an argument of ${[...named].map((n) => `\`${n}\``).join(", ")}`);
      }
    }
  }
}

for (const file of docFiles) {
  const text = readFileSync(file, "utf8");
  checkTerms(file, text);
  checkTools(file, text);
}
for (const file of manifestFiles) checkTerms(file, readFileSync(file, "utf8"));

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s) in ${docFiles.length + manifestFiles.length} files.`);
  process.exit(1);
}
console.log(
  `OK: ${docFiles.length} docs and ${manifestFiles.length} manifests checked against ${tools.size} public tools.`,
);
