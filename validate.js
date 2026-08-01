// Validates data/legal_text.json.
//
// The website reads this file directly from the default branch at run time, so
// a bad merge breaks the published table immediately. This check runs on every
// pull request; run it locally with `node validate.js`.

import { readFileSync } from "node:fs";

const PATH = "data/legal_text.json";
const STATUSES = ["Operational", "Not operational", "Proposed"];

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

const raw = readFileSync(PATH, "utf8");

let rows;
try {
  rows = JSON.parse(raw);
} catch (e) {
  console.error(`${PATH} is not valid JSON — ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(rows) || rows.length === 0) {
  console.error(`${PATH} must be a non-empty array.`);
  process.exit(1);
}

// One record per line keeps pull request diffs readable: an opening "[", one
// line per record, a closing "]".
const lines = raw.replace(/\n$/, "").split("\n");
if (lines[0] !== "[" || lines[lines.length - 1] !== "]") {
  fail("formatting", 'the file must open with "[" and close with "]" on their own lines');
} else if (lines.length - 2 !== rows.length) {
  fail(
    "formatting",
    `expected one record per line (${rows.length} records, ${lines.length - 2} lines). ` +
      "Do not reformat or pretty-print the file.",
  );
}

const isTabs = (value, where, field) => {
  if (!Array.isArray(value)) {
    fail(where, `"${field}" must be an array of {tab, text} objects`);
    return;
  }
  value.forEach((tab, i) => {
    if (typeof tab?.tab !== "string" || !tab.tab.trim()) {
      fail(where, `"${field}[${i}].tab" must be a non-empty string naming the language`);
    }
    if (typeof tab?.text !== "string" || !tab.text.trim()) {
      fail(where, `"${field}[${i}].text" must be a non-empty string`);
    }
  });
};

const seen = new Set();

rows.forEach((row, i) => {
  const where = `record ${i + 1} (${row?.example ?? "unnamed"})`;

  if (typeof row !== "object" || row === null || Array.isArray(row)) {
    fail(where, "must be an object");
    return;
  }

  for (const field of ["example", "country", "nature_of_institutionalization", "links"]) {
    if (typeof row[field] !== "string" || !row[field].trim()) {
      fail(where, `"${field}" must be a non-empty string`);
    }
  }

  if (!Number.isInteger(row.year) || row.year < 1000 || row.year > 2200) {
    fail(where, `"year" must be a four-digit number, got ${JSON.stringify(row.year)}`);
  }

  if (!STATUSES.includes(row.status)) {
    fail(where, `"status" must be one of ${STATUSES.join(", ")} — got ${JSON.stringify(row.status)}`);
  }

  // Optional: a process may have no design clause at all.
  if (row.legal_text_process_design != null) {
    isTabs(row.legal_text_process_design, where, "legal_text_process_design");
  }
  isTabs(row.legal_text_binding, where, "legal_text_binding");

  const key = `${row.example}||${row.country}`.toLowerCase();
  if (seen.has(key)) fail(where, "duplicates an earlier record with the same example and country");
  seen.add(key);

  const known = new Set([
    "example",
    "country",
    "year",
    "status",
    "nature_of_institutionalization",
    "legal_text_process_design",
    "legal_text_binding",
    "links",
  ]);
  for (const field of Object.keys(row)) {
    if (!known.has(field)) {
      fail(where, `unknown field "${field}" — the website ignores it, so it is probably a typo`);
    }
  }
});

if (errors.length) {
  console.error(`${PATH} — ${errors.length} problem(s):\n`);
  for (const error of errors) console.error(`  • ${error}`);
  console.error("\nSee the schema in README.md.");
  process.exit(1);
}

console.log(`${PATH} — ${rows.length} records, all valid.`);
