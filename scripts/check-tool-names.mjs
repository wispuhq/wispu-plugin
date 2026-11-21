#!/usr/bin/env node
// Checks that the README, the skill, its guides and the commands only name
// tools and arguments that exist on Wispu's public MCP profile, that every
// public tool is named in at least one module guide, and that retired or
// non-public names stay out of customer-facing text. No dependencies: run
// with `node`.
//
// Conventions the docs follow so this check can read them:
// - A tool is written in backticks: `list_brands`.
// - A call with arguments is written as `tool_name(arg_a, arg_b)`; every
//   argument must be a top-level property of that tool's inputSchema.
// - A bare backticked argument (`expected_revision`) must belong to one of the
//   tools named in the same paragraph or bullet.
//
// The catalog is a copy of the server's public tool snapshot. When the public
// tools change, a pull request here brings the new copy; fix what fails.

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

// Terms the public docs never use: retired endpoints and modules that are
// not on the public connection. The Reader is operator-only and website
// traffic is not in the launch, so neither belongs in the public plugin.
// Names that must never appear here at all are checked outside this
// repository, so this list does not have to spell them out.
const forbiddenTerms = [
  { label: "legacy", pattern: /\blegacy\b/i },
  { label: "Reader", pattern: /\bReader\b/ },
  { label: "Google Analytics", pattern: /google analytics/i },
  { label: "mcp.wispu.app", pattern: /mcp\.wispu\.app/i },
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

const guidesDir = join(root, "plugins", "wispu", "skills", "wispu", "guides");
const guideFiles = walk(guidesDir).filter((path) => path.endsWith(".md"));
const docFiles = [
  join(root, "README.md"),
  ...walk(join(root, "plugins", "wispu", "skills")).filter((path) => path.endsWith(".md")),
  ...walk(join(root, "plugins", "wispu", "commands")).filter((path) => path.endsWith(".md")),
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

// Tools named in backticks anywhere in a file, bare or as a call.
function namedTools(text) {
  const names = new Set();
  for (const block of blocks(text)) {
    for (const [, span] of block.text.matchAll(/`([^`]+)`/g)) {
      const name = span.trim().match(/^([a-z][a-z0-9_]*)(\(|$)/)?.[1];
      if (name && tools.has(name)) names.add(name);
    }
  }
  return names;
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

// Coverage: a public tool no guide names is a tool the plugin cannot teach.
const covered = new Set(guideFiles.flatMap((file) => [...namedTools(readFileSync(file, "utf8"))]));
const uncovered = [...tools.keys()].filter((name) => !covered.has(name)).sort();
for (const name of uncovered) {
  errors.push(`catalog: public tool \`${name}\` is not named in any guide under ${relative(root, guidesDir)}`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s) in ${docFiles.length + manifestFiles.length} files.`);
  process.exit(1);
}
console.log(
  `OK: ${docFiles.length} docs and ${manifestFiles.length} manifests checked against ${tools.size} public tools; ` +
    `${covered.size}/${tools.size} tools named in ${guideFiles.length} guides.`,
);
