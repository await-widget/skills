import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const runtimeTypes = path.join(root, "runtime/types");
const referenceDir = path.join(root, "skills/docs/reference");

const files = {
  components: "await.d.ts",
  props: "prop.d.ts",
  bridge: "bridge.d.ts",
  globals: "global.d.ts",
  jsx: "jsx.d.ts",
};

function lineOf(source, needle) {
  const index = source.indexOf(needle);
  if (index < 0) {
    return 1;
  }
  return source.slice(0, index).split("\n").length;
}

function fenced(value) {
  return `\`\`\`ts\n${value.trim()}\n\`\`\``;
}

function readBalancedStatement(source, start) {
  let angle = 0;
  let brace = 0;
  let bracket = 0;
  let paren = 0;
  let quote = "";
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const previous = source[index - 1];
    if (quote) {
      if (char === quote && previous !== "\\") {
        quote = "";
      }
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "<") angle += 1;
    if (char === ">" && angle > 0) angle -= 1;
    if (char === "{") brace += 1;
    if (char === "}" && brace > 0) brace -= 1;
    if (char === "[") bracket += 1;
    if (char === "]" && bracket > 0) bracket -= 1;
    if (char === "(") paren += 1;
    if (char === ")" && paren > 0) paren -= 1;
    if (
      char === ";" &&
      angle === 0 &&
      brace === 0 &&
      bracket === 0 &&
      paren === 0
    ) {
      return source.slice(start, index + 1);
    }
  }
  return source.slice(start);
}

function extractStatements(source, pattern) {
  const blocks = [];
  for (const match of source.matchAll(pattern)) {
    const body = readBalancedStatement(source, match.index);
    blocks.push({
      name: match.groups.name,
      body,
      line: lineOf(source, body),
    });
  }
  return blocks;
}

function replaceGenerated(existing, generated) {
  const start = "<!-- GENERATED:START -->";
  const end = "<!-- GENERATED:END -->";
  if (!existing.includes(start) || !existing.includes(end)) {
    return `${existing.trim()}\n\n${start}\n${generated.trim()}\n${end}\n`;
  }
  return existing.replace(
    new RegExp(`${start}[\\s\\S]*?${end}`),
    `${start}\n${generated.trim()}\n${end}`,
  );
}

async function readTypeFile(name) {
  return readFile(path.join(runtimeTypes, name), "utf8");
}

async function readDoc(file, fallback) {
  try {
    return await readFile(path.join(referenceDir, file), "utf8");
  } catch {
    return fallback;
  }
}

function componentReference(source) {
  const components = extractStatements(
    source,
    /export function (?<name>\w+)\(/g,
  );
  return [
    "## Generated Component Signatures",
    "",
    ...components.flatMap(({ name, body, line }) => [
      `### ${name}`,
      "",
      `Source: \`runtime/types/${files.components}:${line}\``,
      "",
      fenced(body),
      "",
    ]),
  ].join("\n");
}

function typeReference(source, sourceName) {
  const types = extractStatements(
    source,
    /type (?<name>[A-Za-z0-9_]+)(?:<[^=]+>)? = /g,
  );
  return [
    "## Generated Type Declarations",
    "",
    ...types.flatMap(({ name, body, line }) => [
      `### ${name}`,
      "",
      `Source: \`runtime/types/${sourceName}:${line}\``,
      "",
      fenced(body),
      "",
    ]),
  ].join("\n");
}

function bridgeReference(source) {
  const exports = extractStatements(
    source,
    /export declare (?:const|function) (?<name>[A-Za-z0-9_]+)/g,
  );
  const types = extractStatements(
    source,
    /type (?<name>[A-Za-z0-9_]+)(?:<[^=]+>)? = /g,
  );
  return [
    "## Generated Bridge Declarations",
    "",
    ...exports.flatMap(({ name, body, line }) => [
      `### ${name}`,
      "",
      `Source: \`runtime/types/${files.bridge}:${line}\``,
      "",
      fenced(body),
      "",
    ]),
    "## Generated Bridge Helper Types",
    "",
    ...types.flatMap(({ name, body, line }) => [
      `### ${name}`,
      "",
      `Source: \`runtime/types/${files.bridge}:${line}\``,
      "",
      fenced(body),
      "",
    ]),
  ].join("\n");
}

async function main() {
  await mkdir(referenceDir, { recursive: true });

  const awaitSource = await readTypeFile(files.components);
  const propSource = await readTypeFile(files.props);
  const bridgeSource = await readTypeFile(files.bridge);
  const globalSource = await readTypeFile(files.globals);
  const jsxSource = await readTypeFile(files.jsx);

  const docs = [
    {
      file: "components.md",
      fallback:
        "# Components\n\nImport components only from `await`. The generated section below is sourced from `runtime/types/await.d.ts`.\n",
      generated: componentReference(awaitSource),
    },
    {
      file: "props-and-modifiers.md",
      fallback:
        "# Props And Modifiers\n\nProps and modifiers are the styling and layout surface for Await widgets. The generated section below is sourced from `runtime/types/prop.d.ts`.\n",
      generated: typeReference(propSource, files.props),
    },
    {
      file: "bridge-apis.md",
      fallback:
        "# Bridge APIs\n\nBridge APIs are global objects provided by the Await host. The generated section below is sourced from `runtime/types/bridge.d.ts`.\n",
      generated: bridgeReference(bridgeSource),
    },
    {
      file: "global-types.md",
      fallback:
        "# Global Types\n\nShared widget, timeline, media, system, and data types. The generated section below is sourced from `runtime/types/global.d.ts`.\n",
      generated: typeReference(globalSource, files.globals),
    },
    {
      file: "jsx-runtime.md",
      fallback:
        "# JSX Runtime\n\nAwait widgets use the Await JSX runtime, not browser HTML. The generated section below is sourced from `runtime/types/jsx.d.ts`.\n",
      generated: fenced(jsxSource),
    },
  ];

  for (const doc of docs) {
    const existing = await readDoc(doc.file, doc.fallback);
    await writeFile(
      path.join(referenceDir, doc.file),
      replaceGenerated(existing, doc.generated),
    );
  }
}

await main();
