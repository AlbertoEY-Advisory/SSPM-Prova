const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Resolve a dotted path like "policy.description.purpose"
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
 * Check whether a value should be considered "missing"
 */
function isMissing(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

/**
 * Extract regex from a Markdown naming convention document.
 * Expected format:
 *
 * ## Regex Validation Rule
 *
 * ```regex
 * ^something$
 * ```
 */
function extractRegexFromMarkdown(mdPath) {
  if (!fs.existsSync(mdPath)) {
    throw new Error(`Naming convention file not found: ${mdPath}`);
  }

  const content = fs.readFileSync(mdPath, "utf8");
  const lines = content.split(/\r?\n/);

  let inSection = false;
  let inFence = false;
  let regexLines = [];

  for (const line of lines) {
    const heading = line.trim().toLowerCase();

    // Enter the "Regex Validation Rule" section
    if (heading.startsWith("## ") && heading.includes("regex validation rule".toLowerCase())) {
      inSection = true;
      continue;
    }

    if (!inSection) continue;

    // Look for fenced code block
    if (line.trim().startsWith("```")) {
      // First fence inside the section: start collecting
      if (!inFence) {
        inFence = true;
        // If there's content on the same line after ```, ignore it; we only want inner lines
        regexLines = [];
      } else {
        // Closing fence: stop
        break;
      }
      continue;
    }

    if (inFence) {
      regexLines.push(line);
    }
  }

  const regexText = regexLines.join("\n").trim();
  if (!regexText) {
    throw new Error(`No regex found under "Regex Validation Rule" in ${mdPath}`);
  }

  return regexText;
}

/**
 * ---- MAIN SCRIPT ----
 */

const input = process.argv[2];

if (!input) {
  console.error("Usage: node schema-validator.js <input.yaml>");
  process.exit(1);
}

// Load YAML
let data;
try {
  data = yaml.load(fs.readFileSync(input, "utf8")) || {};
} catch (err) {
  console.error(`❌ Failed to parse YAML: ${input}`);
  console.error(err.message);
  process.exit(1);
}

const rootKeys = Object.keys(data);
if (rootKeys.length === 0) {
  console.error("❌ YAML document is empty.");
  process.exit(1);
}

// Determine document type
const firstKey = rootKeys[0];
let schemaFile;
let namingDocPath;
let namePath;

if (firstKey === "policy") {
  schemaFile = path.join(__dirname, "..", "..", "schemas", "policy-schema.json");
  namingDocPath = path.join(__dirname, "..", "..", "docs", "policies", "naming-convention.md");
  namePath = "policy.name";
} else if (firstKey === "useCase") {
  schemaFile = path.join(__dirname, "..", "..", "schemas", "usecase-schema.json");
  namingDocPath = path.join(__dirname, "..", "..", "docs", "use-cases", "naming-convention.md");
  namePath = "useCase.useCaseId";
} else {
  console.error(`❌ Unsupported document type: "${firstKey}"`);
  console.error('Top-level key must be "policy:" or "useCase:".');
  process.exit(1);
}

// Load schema
const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
const requiredPaths = schema.requiredPaths || [];

const missing = [];

// 1) Structural validation
for (const p of requiredPaths) {
  const value = getPath(data, p);
  if (isMissing(value)) {
    missing.push(p);
  }
}

// 2) Naming convention validation
try {
  const regexText = extractRegexFromMarkdown(namingDocPath);
  const nameValue = getPath(data, namePath);

  if (isMissing(nameValue)) {
    missing.push(namePath);
  } else {
    const nameRegex = new RegExp(regexText);
    if (!nameRegex.test(String(nameValue))) {
      console.error(`❌ Name does not match naming convention regex from ${namingDocPath}`);
      console.error(`  Name:  ${nameValue}`);
      console.error(`  Regex: ${regexText}`);
      process.exit(1);
    }
  }
} catch (err) {
  console.error(`❌ Failed to validate naming convention: ${err.message}`);
  process.exit(1);
}

// Final decision
if (missing.length > 0) {
  console.error(`❌ Validation failed for ${input}`);
  console.error("Missing required fields:");
  for (const m of missing) {
    console.error(`  - ${m}`);
  }
  process.exit(1);
}

console.log(`✅ Validation passed: ${input}`);

process.exit(0);
