const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Utility: safely resolve a dotted path like "policy.description.purpose"
 */
function getPath(obj, pathStr) {
  if (!pathStr) return undefined;
  const parts = pathStr.split(".");
  let current = obj;
  for (const p of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[p];
  }
  return current;
}

/**
 * Render a heading section
 */
function renderHeading(section) {
  const level = section.level || 1;
  const prefix = "#".repeat(level);
  return `${prefix} ${section.text || ""}`.trim();
}

/**
 * Render a horizontal separator
 */
function renderSeparator() {
  return "---";
}

/**
 * Render a simple field section (just the raw value)
 */
function renderField(section, data) {
  const value = getPath(data, section.path);
  const text = value != null ? String(value) : section.fallback || "";
  return text;
}

/**
 * Render a key–value list (e.g. Description, Naming Breakdown, etc.)
 */
function renderKvList(section, data) {
  const lines = [];
  if (section.title) {
    lines.push(`## ${section.title}`);
  }
  lines.push("");

  const items = section.items || [];
  for (const item of items) {
    const value = getPath(data, item.path);
    const text = value != null ? String(value) : "";
    lines.push(`- **${item.label}**: ${text}`);
  }

  return lines.join("\n");
}

/**
 * Render a bullet list section
 */
function renderList(section, data) {
  const lines = [];
  if (section.title) {
    lines.push(`## ${section.title}`);
  }
  lines.push("");

  const value = getPath(data, section.path);

  if (Array.isArray(value) && value.length > 0) {
    for (const entry of value) {
      lines.push(`* ${String(entry)}`);
    }
  } else if (value != null && !Array.isArray(value)) {
    // Single scalar value
    lines.push(`* ${String(value)}`);
  } else {
    lines.push(section.emptyText || "_None_");
  }

  return lines.join("\n");
}

/**
 * Render a code block section (used for last_json_export, etc.)
 */
function renderCodeBlock(section, data) {
  const lines = [];
  if (section.title) {
    lines.push(`## ${section.title}`);
    lines.push("");
  }

  const value = getPath(data, section.path);
  let text = "";

  if (typeof value === "string") {
    text = value.replace(/\r/g, "");
  } else if (value != null) {
    // Object/array: stringify as JSON for now
    text = JSON.stringify(value, null, 2);
  } else if (section.emptyText) {
    text = section.emptyText;
  }

  const lang = section.language || "";
  lines.push("```" + lang);
  if (text) lines.push(text);
  lines.push("```");

  return lines.join("\n");
}

/**
 * Generic renderer: consumes data + schema JSON and produces Markdown
 */
function renderDocument(data, schema) {
  const sections = schema.sections || [];
  const out = [];

  for (const section of sections) {
    switch (section.type) {
      case "heading":
        out.push(renderHeading(section));
        break;
      case "separator":
        out.push(renderSeparator());
        break;
      case "field":
        out.push(renderField(section, data));
        break;
      case "kv-list":
        out.push(renderKvList(section, data));
        break;
      case "list":
        out.push(renderList(section, data));
        break;
      case "codeblock":
        out.push(renderCodeBlock(section, data));
        break;
      default:
        // Unknown type -> skip
        continue;
    }
    out.push(""); // blank line after each section
  }

  // Remove trailing blank lines
  while (out.length && out[out.length - 1].trim() === "") {
    out.pop();
  }

  return out.join("\n");
}

/**
 * ---- MAIN SCRIPT ----
 */

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error("Usage: node MD-converter.js <input.yaml> <output.md>");
  process.exit(1);
}

// Load YAML
const yamlContent = yaml.load(fs.readFileSync(input, "utf8"));
const data = yamlContent || {};

const rootKeys = Object.keys(data);
if (rootKeys.length === 0) {
  console.error("YAML document is empty. Unable to determine document type.");
  process.exit(1);
}

// Determine document type from first top-level key
const firstKey = rootKeys[0];

let schemaFile;
if (firstKey === "policy") {
  schemaFile = path.join(__dirname, "..", "..", "schemas", "policy-schema.json");
} else if (firstKey === "useCase") {
  schemaFile = path.join(__dirname, "..", "..", "schemas", "usecase-schema.json");
} else {
  console.error(`Unsupported document type: "${firstKey}".`);
  console.error('Top-level key must be "policy:" or "useCase:".');
  process.exit(1);
}

// Load JSON schema (layout + requiredPaths etc.)
const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));

// Render Markdown according to schema
const md = renderDocument(data, schema);

// Write result
fs.writeFileSync(output, md, "utf8");

console.log(`Converted (${firstKey}):`, input, "→", output);
