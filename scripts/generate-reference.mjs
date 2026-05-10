import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const runtimeTypes = path.join(root, "runtime/types");
const referenceDir = path.join(root, "skills/docs/reference");

const referenceTitles = new Map([
  ["jsx.md", "JSX"],
]);

let referenceLinks = new Map();

function fenced(value) {
  return `\`\`\`ts\n${value.trim()}\n\`\`\``;
}

function withoutJsDoc(value) {
  return value
    .replace(/^\s*\/\*\*[\s\S]*?\*\/\s*/u, "")
    .replaceAll(/\n[ \t]*\/\*\*[\s\S]*?\*\/[ \t]*(?=\n)/gu, "");
}

function leadingJsDoc(source, start) {
  let index = start;
  while (index > 0 && /\s/u.test(source[index - 1])) {
    index -= 1;
  }

  if (source.slice(index - 2, index) !== "*/") {
    return "";
  }

  const open = source.lastIndexOf("/**", index - 2);
  if (open < 0) {
    return "";
  }

  return source.slice(open, index).trim();
}

function trimLeadingJsDoc(source) {
  return source.replace(/^\s*\/\*\*[\s\S]*?\*\/\s*/u, "");
}

function parseJsDoc(comment) {
  if (!comment) {
    return { description: "", params: [], returns: "" };
  }

  const lines = comment
    .replace(/^\/\*\*\s*/u, "")
    .replace(/\s*\*\/$/u, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/u, "").trim());

  const description = [];
  const params = [];
  let returns = "";

  for (const line of lines) {
    if (!line) {
      if (description.length > 0 && description.at(-1) !== "") {
        description.push("");
      }
      continue;
    }

    const param = line.match(
      /^@param(?:\s+\{(?<type>[^}]+)\})?\s+(?<name>\[[^\]]+\]|[^\s]+)(?:\s+-\s+|\s+)?(?<description>.*)$/u,
    );
    if (param?.groups) {
      params.push({
        name: param.groups.name,
        type: param.groups.type ?? "",
        description: param.groups.description ?? "",
      });
      continue;
    }

    const returnValue = line.match(
      /^@returns?(?:\s+\{(?<type>[^}]+)\})?(?:\s+-\s+|\s+)?(?<description>.*)$/u,
    );
    if (returnValue?.groups) {
      const type = returnValue.groups.type
        ? `\`${returnValue.groups.type}\``
        : "";
      const text = returnValue.groups.description ?? "";
      returns = [type, text].filter(Boolean).join(" - ");
      continue;
    }

    if (!line.startsWith("@")) {
      description.push(line);
    }
  }

  return {
    description: description.join("\n").trim(),
    params,
    returns,
  };
}

function tableCode(value, currentFile) {
  return linkTypeText(value.replaceAll("\n", " "), currentFile).replaceAll("|", "\\|");
}

function displayName(value) {
  return value.replace(/\?$/u, "");
}

function anchorFor(name) {
  return name.toLowerCase();
}

function linkTypeName(name, currentFile) {
  const file = referenceLinks.get(name);
  if (!file) {
    return `\`${name}\``;
  }

  const href = file === currentFile
    ? `#${anchorFor(name)}`
    : `${file}#${anchorFor(name)}`;
  return `[\`${name}\`](${href})`;
}

function linkTypeText(value, currentFile = "") {
  return value.replace(/`([^`]+)`/gu, (match, inner) =>
    referenceLinks.has(inner) ? linkTypeName(inner, currentFile) : match,
  );
}

function linkBareTypeText(value, currentFile = "") {
  return value.replace(/\b[A-Z][A-Za-z0-9_]*\b/gu, (name) =>
    linkTypeName(name, currentFile),
  );
}

function renderJsDoc(comment, currentFile) {
  const doc = parseJsDoc(comment);
  const lines = [];
  if (doc.description) {
    lines.push(linkTypeText(doc.description, currentFile), "");
  }

  if (doc.params.length > 0) {
    lines.push("#### Parameters", "");
    for (const param of doc.params) {
      const type = param.type ? ` ${linkBareTypeText(param.type, currentFile)}` : "";
      lines.push(`- \`${param.name}\`${type} - ${param.description}`.trim(), "");
    }
  }

  if (doc.returns) {
    lines.push("#### Returns", "", linkTypeText(doc.returns, currentFile), "");
  }

  return lines;
}

function matchingBraceIndex(source, openIndex) {
  let depth = 0;
  let quote = "";
  for (let index = openIndex; index < source.length; index += 1) {
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
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }
  return -1;
}

function topLevelStatements(source) {
  const statements = [];
  let start = 0;
  let angle = 0;
  let brace = 0;
  let bracket = 0;
  let paren = 0;
  let quote = "";
  let blockComment = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const previous = source[index - 1];
    const next = source[index + 1];
    if (blockComment) {
      if (previous === "*" && char === "/") {
        blockComment = false;
      }
      continue;
    }
    if (!quote && char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
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
      (char === ";" || char === ",") &&
      angle === 0 &&
      brace === 0 &&
      bracket === 0 &&
      paren === 0
    ) {
      const statement = source.slice(start, index).trim();
      if (statement) {
        statements.push(statement);
      }
      start = index + 1;
    }
  }

  const tail = source.slice(start).trim();
  if (tail) {
    statements.push(tail);
  }
  return statements;
}

function members(body) {
  const openIndex = body.indexOf("{");
  if (openIndex < 0) {
    return [];
  }

  const closeIndex = matchingBraceIndex(body, openIndex);
  if (closeIndex < 0) {
    return [];
  }

  return topLevelStatements(body.slice(openIndex + 1, closeIndex))
    .map((statement) => {
      const jsdoc = statement.match(/^\s*\/\*\*[\s\S]*?\*\//u)?.[0] ?? "";
      const signature = trimLeadingJsDoc(statement).trim();
      const propertyMatch = signature.match(
        /^(?:readonly\s+)?(?<name>[A-Za-z0-9_$]+)(?<optional>\?)?:\s*(?<type>[\s\S]+)$/u,
      );
      if (propertyMatch?.groups) {
        const doc = parseJsDoc(jsdoc);
        return {
          kind: "property",
          name: `${propertyMatch.groups.name}${propertyMatch.groups.optional ?? ""}`,
          type: propertyMatch.groups.type.trim(),
          doc,
        };
      }

      const methodMatch = signature.match(
        /^(?<name>[A-Za-z0-9_$]+)\((?<args>[\s\S]*?)\):\s*(?<type>[\s\S]+)$/u,
      );
      if (methodMatch?.groups) {
        const doc = parseJsDoc(jsdoc);
        return {
          kind: "method",
          name: methodMatch.groups.name,
          args: methodMatch.groups.args.trim(),
          type: methodMatch.groups.type.trim(),
          doc,
        };
      }

      return undefined;
    })
    .filter(Boolean);
}

function renderMemberDocsBeforeSignature(body, currentFile) {
  const documented = members(body).filter(
    (row) => row.doc.description || row.doc.params.length > 0 || row.doc.returns,
  );
  if (documented.length === 0) {
    return [];
  }

  const properties = documented.filter((row) => row.kind === "property");
  const methods = documented.filter((row) => row.kind === "method");
  const output = [];

  if (properties.length > 0) {
    output.push(
      ...properties.flatMap((row) => [
        `- \`${displayName(row.name)}\` ${linkTypeText(row.doc.description, currentFile)}`,
      ]),
      "",
    );
  }

  for (const method of methods) {
    output.push(
      `#### \`${method.name}()\``,
      "",
      ...(method.doc.description ? [linkTypeText(method.doc.description, currentFile), ""] : []),
    );

    if (method.doc.params.length > 0) {
      output.push(
        "Parameters:",
        "",
        "| Parameter | Type | Description |",
        "| --- | --- | --- |",
        ...method.doc.params.map((param) =>
          `| ${tableCode(param.name, currentFile)} | ${param.type ? linkBareTypeText(param.type, currentFile).replaceAll("|", "\\|") : ""} | ${param.description.replaceAll("|", "\\|")} |`,
        ),
        "",
      );
    }

    if (method.doc.returns) {
      output.push("Returns:", "", linkTypeText(method.doc.returns, currentFile), "");
    }

    output.push(
      "```ts",
      `${method.name}(${method.args}): ${method.type};`,
      "```",
      "",
    );
  }

  return output;
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
    const jsdoc = leadingJsDoc(source, match.index);
    const body = readBalancedStatement(source, match.index);
    blocks.push({
      name: match.groups.name,
      body,
      jsdoc,
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

async function listTypeFiles() {
  const names = await readdir(runtimeTypes);
  const typeFiles = names
    .filter((name) => name.endsWith(".d.ts") && name !== "index.d.ts")
    .sort((a, b) => a.localeCompare(b));
  const typeFileSet = new Set(typeFiles);
  const indexSource = await readTypeFile("index.d.ts");
  const referenceOrder = [...indexSource.matchAll(/<reference path="\.\/([^"]+\.d\.ts)" \/>/gu)]
    .map((match) => match[1])
    .filter((name) => typeFileSet.has(name));
  return [
    ...referenceOrder,
    ...typeFiles.filter((name) => !referenceOrder.includes(name)),
  ];
}

function docFileFor(sourceFile) {
  return `${path.basename(sourceFile, ".d.ts")}.md`;
}

function titleForDoc(file) {
  if (referenceTitles.has(file)) {
    return referenceTitles.get(file);
  }

  return path
    .basename(file, ".md")
    .split("-")
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

async function readDoc(file, fallback) {
  try {
    return await readFile(path.join(referenceDir, file), "utf8");
  } catch {
    return fallback;
  }
}

function componentReference(source, currentFile) {
  const components = extractStatements(
    source,
    /export function (?<name>\w+)\(/g,
  );
  return [
    "## Generated Component Signatures",
    "",
    ...components.flatMap(({ name, body, jsdoc }) => [
      `### ${name}`,
      "",
      ...renderJsDoc(jsdoc, currentFile),
      ...renderMemberDocsBeforeSignature(body, currentFile),
      fenced(withoutJsDoc(body)),
      "",
    ]),
  ].join("\n");
}

function typeReference(source, currentFile) {
  const types = extractStatements(
    source,
    /type (?<name>[A-Za-z0-9_]+)(?:<[^=]+>)? = /g,
  );
  return [
    "## Generated Type Declarations",
    "",
    ...types.flatMap(({ name, body, jsdoc }) => [
      `### ${name}`,
      "",
      ...renderJsDoc(jsdoc, currentFile),
      ...renderMemberDocsBeforeSignature(body, currentFile),
      fenced(withoutJsDoc(body)),
      "",
    ]),
  ].join("\n");
}

function bridgeReference(source, currentFile) {
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
    ...exports.flatMap(({ name, body, jsdoc }) => [
      `### ${name}`,
      "",
      ...renderJsDoc(jsdoc, currentFile),
      ...renderMemberDocsBeforeSignature(body, currentFile),
      fenced(withoutJsDoc(body)),
      "",
    ]),
    "## Generated Bridge Helper Types",
    "",
    ...types.flatMap(({ name, body, jsdoc }) => [
      `### ${name}`,
      "",
      ...renderJsDoc(jsdoc, currentFile),
      ...renderMemberDocsBeforeSignature(body, currentFile),
      fenced(withoutJsDoc(body)),
      "",
    ]),
  ].join("\n");
}

function buildReferenceLinks(sourcesByFile) {
  const links = new Map();

  for (const [sourceName, source] of sourcesByFile) {
    const doc = docFileFor(sourceName);

    const typeNames = extractStatements(
      source,
      /type (?<name>[A-Za-z0-9_]+)(?:<[^=]+>)? = /g,
    );
    for (const type of typeNames) {
      links.set(type.name, doc);
    }

    const functionNames = extractStatements(
      source,
      /export function (?<name>\w+)\(/g,
    );
    for (const fn of functionNames) {
      links.set(fn.name, doc);
    }

    const exportNames = extractStatements(
      source,
      /export declare (?:const|function) (?<name>[A-Za-z0-9_]+)/g,
    );
    for (const item of exportNames) {
      links.set(item.name, doc);
    }
  }

  return links;
}

function referenceIndex(docs) {
  return [
    "# Reference",
    "",
    "Runtime declarations remain the source of truth. Generated reference content is sourced from `runtime/types/*.d.ts`.",
    "",
    "## Pages",
    "",
    ...docs.map((doc) => `- [${doc.title}](${doc.file})`),
    "",
  ].join("\n");
}

function fallbackFor(file, title) {
  return `# ${title}\n\nThe generated section below is sourced from \`runtime/types/${file}\`.\n`;
}

function generatedReference(file, source, docFile) {
  if (file === "await.d.ts") {
    return componentReference(source, docFile);
  }

  if (file === "bridge.d.ts") {
    return bridgeReference(source, docFile);
  }

  if (file === "jsx.d.ts") {
    return fenced(source);
  }

  return typeReference(source, docFile);
}

async function removeStaleGeneratedDocs(docs) {
  const current = new Set(docs.map((doc) => doc.file));
  const names = await readdir(referenceDir);
  await Promise.all(names
    .filter((name) => name.endsWith(".md") && !current.has(name))
    .map(async (name) => {
      const file = path.join(referenceDir, name);
      const source = await readFile(file, "utf8");
      if (
        source.includes("The generated section below is sourced from `runtime/types/") &&
        source.includes("<!-- GENERATED:START -->")
      ) {
        await unlink(file);
      }
    }));
}

async function main() {
  await mkdir(referenceDir, { recursive: true });

  const typeFiles = await listTypeFiles();
  const sourcesByFile = new Map(
    await Promise.all(typeFiles.map(async (file) => [file, await readTypeFile(file)])),
  );

  referenceLinks = buildReferenceLinks(sourcesByFile);

  const docs = typeFiles.map((file) => {
    const docFile = docFileFor(file);
    const title = titleForDoc(docFile);
    return {
      file: docFile,
      title,
      fallback: fallbackFor(file, title),
      generated: generatedReference(file, sourcesByFile.get(file), docFile),
    };
  });

  for (const doc of docs) {
    const existing = await readDoc(doc.file, doc.fallback);
    await writeFile(
      path.join(referenceDir, doc.file),
      replaceGenerated(existing, doc.generated),
    );
  }

  await removeStaleGeneratedDocs(docs);
  await writeFile(path.join(referenceDir, "index.md"), referenceIndex(docs));
}

await main();
