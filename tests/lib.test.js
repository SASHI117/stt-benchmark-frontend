const test = require("node:test");
const assert = require("node:assert/strict");
const lib = require("../lib.js");

const rows = [
  { provider: "A", model: "a", wer: 0.4, latency_ms: 900, status: "success", text: "x" },
  { provider: "G", model: null, wer: null, latency_ms: null, status: "skipped", text: "",
    error: "language_code is required for Google" },
  { provider: "B", model: "b", wer: 0.1, latency_ms: 2500, status: "success", text: "y" },
  { provider: "C", model: null, wer: null, latency_ms: null, status: "failed", text: "", error: "401" },
];

test("statusInfo distinguishes skipped from failed", () => {
  assert.equal(lib.statusInfo(rows[1]).label, "Skipped");
  assert.equal(lib.statusInfo(rows[3]).label, "Failed");
  assert.equal(lib.statusInfo({ status: "weird" }).label, "Failed");
});

test("sortResults orders by value and keeps nulls last in both directions", () => {
  const asc = lib.sortResults(rows, "wer", "asc").map((r) => r.provider);
  const desc = lib.sortResults(rows, "wer", "desc").map((r) => r.provider);
  assert.deepEqual(asc.slice(0, 2), ["B", "A"]);
  assert.deepEqual(desc.slice(0, 2), ["A", "B"]);
  assert.deepEqual(asc.slice(2).sort(), ["C", "G"]);
  assert.deepEqual(desc.slice(2).sort(), ["C", "G"]);
});

test("sortResults does not mutate its input", () => {
  const copy = rows.map((r) => r.provider);
  lib.sortResults(rows, "latency_ms", "desc");
  assert.deepEqual(rows.map((r) => r.provider), copy);
});

test("formatters handle missing values", () => {
  assert.equal(lib.formatWer(null), "-");
  assert.equal(lib.formatWer(0.12345), "0.123");
  assert.equal(lib.formatLatency(null), "-");
  assert.equal(lib.formatLatency(1840.6), "1841 ms");
});

test("buildExport keeps status and error so failures survive export", () => {
  const out = lib.buildExport({ audio_file: "c.wav", reference_text: "r", language_code: "te-IN" }, rows);
  assert.equal(out.language_code, "te-IN");
  assert.equal(out.results[1].status, "skipped");
  assert.match(out.results[1].error, /language_code/);
});
