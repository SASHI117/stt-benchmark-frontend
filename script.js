// 🔐 AUTH GUARD (ADD THIS AT TOP)
const session = JSON.parse(localStorage.getItem("session"));

if (!session || session.user !== "admin@example.com") {
  window.location.href = "login_new.html";
}

// ===============================
// GLOBAL STATE FOR SORTING
// ===============================
let currentResults = [];
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

  // Validation
  if (!audioFile || !referenceText) {
    alert("Please provide both audio file and reference text");
    return;
  }

  // UI State
  emptyState.classList.add("hidden");
  loading.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  submitBtn.disabled = true;
  submitBtn.textContent = "Comparing...";
  resultsBody.innerHTML = "";

  // Prepare form data
  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append("reference_text", referenceText);
  if (languageCode) {
    formData.append("language_code", languageCode);
  }

  try {
    const response = await fetch(
      "https://stt-benchmark-backend-production.up.railway.app/benchmark",
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // 🔹 STORE RESULTS (NO DEFAULT SORT)
    currentResults = data.results;

    renderResults(currentResults);

    loading.classList.add("hidden");
    resultsContainer.classList.remove("hidden");

  } catch (error) {
    console.error(error);
    alert("Failed to connect to backend");
    loading.classList.add("hidden");
    emptyState.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Compare STT Providers";
  }
});

// ===============================
// RENDER RESULTS (UNCHANGED LOGIC)
// ===============================
function renderResults(results) {
  resultsBody.innerHTML = "";

  results.forEach((result) => {
    const row = document.createElement("div");
    row.className = "result-row";

    // Provider
    const providerCell = document.createElement("div");
    providerCell.className = "provider-name";
    providerCell.textContent = result.provider;

    // Model
    const modelCell = document.createElement("div");
    modelCell.className = "model-name";
    modelCell.textContent = result.model || "—";

    // WER
    const werCell = document.createElement("div");
    werCell.className = "wer-value";
    werCell.textContent = result.wer != null ? result.wer.toFixed(3) : "-";

    // Latency
    const latencyCell = document.createElement("div");
    latencyCell.className = "latency-value";
    latencyCell.textContent =
      result.latency_ms != null ? `${result.latency_ms} ms` : "-";

    // Status
    const statusCell = document.createElement("div");
    statusCell.style.textAlign = "center";

    const statusBadge = document.createElement("span");
    statusBadge.className = `status-badge ${
      result.status === "success" ? "success" : "failed"
    }`;

    const statusDot = document.createElement("div");
    statusDot.className = "status-dot";

    const statusText = document.createElement("span");
    statusText.textContent =
      result.status === "success" ? "Success" : "Failed";

    statusBadge.appendChild(statusDot);
    statusBadge.appendChild(statusText);
    statusCell.appendChild(statusBadge);

    // Transcript
    const transcriptCell = document.createElement("div");
    const transcriptBox = document.createElement("div");
    transcriptBox.className = "transcript-box";
    transcriptBox.textContent = result.text || "—";
    transcriptCell.appendChild(transcriptBox);

    // Append cells
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
// SORTING HANDLERS (NEW FEATURE)
// ===============================
document.querySelectorAll(".sortable").forEach((header) => {
  header.addEventListener("click", () => {
    const key = header.dataset.sort;

    // Toggle sort order
    sortState[key] = sortState[key] === "asc" ? "desc" : "asc";

    currentResults.sort((a, b) => {
      if (a[key] == null) return 1;
      if (b[key] == null) return -1;

      return sortState[key] === "asc"
        ? a[key] - b[key]
        : b[key] - a[key];
    });

    renderResults(currentResults);
  });
});
