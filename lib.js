// Pure helpers shared by the page (script.js) and the Node tests.
(function (root) {
  const STATUS = {
    success: { cls: "success", label: "Success" },
    skipped: { cls: "skipped", label: "Skipped" },
    failed: { cls: "failed", label: "Failed" },
  };

  function statusInfo(result) {
    return STATUS[result.status] || STATUS.failed;
  }

  function formatWer(wer) {
    return wer == null ? "-" : wer.toFixed(3);
  }

  function formatLatency(ms) {
    return ms == null ? "-" : `${Math.round(ms)} ms`;
  }

  // Rows without a value (failed/skipped) always sort to the bottom,
  // whichever direction is chosen.
  function sortResults(results, key, direction) {
    const sign = direction === "desc" ? -1 : 1;
    return [...results].sort((a, b) => {
      if (a[key] == null && b[key] == null) return 0;
      if (a[key] == null) return 1;
      if (b[key] == null) return -1;
      return sign * (a[key] - b[key]);
    });
  }

  function buildExport(meta, results) {
    return {
      audio_file: meta.audio_file,
      reference_text: meta.reference_text,
      language_code: meta.language_code || null,
      results: results.map((r) => ({
        provider: r.provider,
        model: r.model,
        status: r.status,
        transcript: r.text,
        wer: r.wer,
        latency_ms: r.latency_ms,
        error: r.error || null,
      })),
    };
  }

  const api = { statusInfo, formatWer, formatLatency, sortResults, buildExport };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.BenchLib = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
