// ===============================
// GLOBAL STATE
// ===============================
let currentResults = [];
let currentMeta = {
  audio_file: "",
  reference_text: "",
  language_code: ""
};

const { statusInfo, formatWer, formatLatency, sortResults, buildExport } = window.BenchLib;
const BACKEND_URL = window.STT_CONFIG.backendUrl.replace(/\/$/, "");

let sortState = {
  wer: "asc",
  latency_ms: "asc"
};

// ===============================
// DOM ELEMENTS
// ===============================
const form = document.getElementById("benchmarkForm");
const audioInput = document.getElementById("audio");
const uploadText = document.getElementById("uploadText");
const referenceInput = document.getElementById("reference");
const languageSelect = document.getElementById("language_code");
const submitBtn = document.getElementById("submitBtn");

const emptyState = document.getElementById("emptyState");
const loading = document.getElementById("loading");
const resultsContainer = document.getElementById("resultsContainer");
const resultsBody = document.getElementById("resultsBody");
const downloadBtn = document.getElementById("downloadJsonBtn");

// ===============================
// FILE UPLOAD UI
// ===============================
audioInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  uploadText.textContent = file ? file.name : "Click to upload";
});

// ===============================
// FORM SUBMIT HANDLER
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const audioFile = audioInput.files[0];
  const referenceText = referenceInput.value.trim();
  const languageCode = languageSelect.value;

  if (!audioFile || !referenceText) {
    alert("Please provide both audio file and reference text");
    return;
  }

  // Store metadata for JSON export
  currentMeta.audio_file = audioFile.name;
  currentMeta.reference_text = referenceText;
  currentMeta.language_code = languageCode;

  // UI state reset
  emptyState.classList.add("hidden");
  loading.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  downloadBtn.classList.add("hidden");
  submitBtn.disabled = true;
  submitBtn.textContent = "Comparing...";
  resultsBody.innerHTML = "";

  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append("reference_text", referenceText);
  if (languageCode) {
    formData.append("language_code", languageCode);
  }

  try {
    const response = await fetch(`${BACKEND_URL}/benchmark`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const detail = await response.json().then((d) => d.detail).catch(() => null);
      throw new Error(detail || `Server error: ${response.status}`);
    }

    const data = await response.json();
    currentResults = data.results;

    renderResults(currentResults);

    loading.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");

  } catch (error) {
    console.error(error);
    alert(`Benchmark failed: ${error.message}`);
    loading.classList.add("hidden");
    emptyState.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Compare STT Providers";
  }
});

// ===============================
// RENDER RESULTS
// ===============================
function renderResults(results) {
  resultsBody.innerHTML = "";

  results.forEach((result) => {
    const row = document.createElement("div");
    row.className = "result-row";

    const providerCell = document.createElement("div");
    providerCell.className = "provider-name";
    providerCell.textContent = result.provider;

    const modelCell = document.createElement("div");
    modelCell.className = "model-name";
    modelCell.textContent = result.model || "—";

    const werCell = document.createElement("div");
    werCell.className = "wer-value";
    werCell.textContent = formatWer(result.wer);

    const latencyCell = document.createElement("div");
    latencyCell.className = "latency-value";
    latencyCell.textContent = formatLatency(result.latency_ms);

    const statusCell = document.createElement("div");
    statusCell.style.textAlign = "center";

    const status = statusInfo(result);
    const statusBadge = document.createElement("span");
    statusBadge.className = `status-badge ${status.cls}`;
    if (result.error) statusBadge.title = result.error;

    const statusDot = document.createElement("div");
    statusDot.className = "status-dot";

    const statusText = document.createElement("span");
    statusText.textContent = status.label;

    statusBadge.appendChild(statusDot);
    statusBadge.appendChild(statusText);
    statusCell.appendChild(statusBadge);

    const transcriptCell = document.createElement("div");
    const transcriptBox = document.createElement("div");
    transcriptBox.className = "transcript-box";
    // Show why a provider produced nothing instead of a bare dash.
    transcriptBox.textContent = result.text || result.error || "—";
    if (!result.text && result.error) transcriptBox.classList.add("error-text");
    transcriptCell.appendChild(transcriptBox);

    row.appendChild(providerCell);
    row.appendChild(modelCell);
    row.appendChild(werCell);
    row.appendChild(latencyCell);
    row.appendChild(statusCell);
    row.appendChild(transcriptCell);

    resultsBody.appendChild(row);
  });
}

// ===============================
// SORTING HANDLERS
// ===============================
document.querySelectorAll(".sortable").forEach((header) => {
  header.addEventListener("click", () => {
    const key = header.dataset.sort;
    sortState[key] = sortState[key] === "asc" ? "desc" : "asc";

    currentResults = sortResults(currentResults, key, sortState[key]);
    renderResults(currentResults);
  });
});

// ===============================
// DOWNLOAD RESULTS AS JSON ⬇
// ===============================
downloadBtn.addEventListener("click", () => {
  if (!currentResults.length) return;

  const exportData = buildExport(currentMeta, currentResults);

  const blob = new Blob(
    [JSON.stringify(exportData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `stt_benchmark_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});
