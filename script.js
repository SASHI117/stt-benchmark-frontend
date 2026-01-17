// DOM Elements
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

// Update upload text when file is selected
audioInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadText.textContent = file.name;
  } else {
    uploadText.textContent = "Click to upload";
  }
});

// Form Submit Handler
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

  // Show loading state
  emptyState.classList.add("hidden");
  loading.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  submitBtn.disabled = true;
  submitBtn.textContent = "Comparing...";

  // Clear previous results
  resultsBody.innerHTML = "";

  // Prepare form data
  const formData = new FormData();
  formData.append("audio", audioFile);
  formData.append("reference_text", referenceText);

  if (languageCode) {
    formData.append("language_code", languageCode);
  }

  try {
    // Call backend API
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
    const results = data.results;

    // Sort results by WER (lower is better)
    results.sort((a, b) => {
      if (a.wer == null) return 1;
      if (b.wer == null) return -1;
      return a.wer - b.wer;
    });

    // Render results
    renderResults(results);

    // Show results container
    loading.classList.add("hidden");
    resultsContainer.classList.remove("hidden");

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to connect to backend. Please check your connection and try again.");

    loading.classList.add("hidden");
    emptyState.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Compare STT Providers";
  }
});

// Render Results Function
function renderResults(results) {
  resultsBody.innerHTML = "";

  results.forEach((result) => {
    const row = document.createElement("div");
    row.className = "result-row";

    // Provider
    const providerCell = document.createElement("div");
    providerCell.className = "provider-name";
    providerCell.textContent = result.provider;

    // ✅ Model (NEW)
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
    latencyCell.textContent = result.latency_ms != null ? `${result.latency_ms} ms` : "-";

    // Status
    const statusCell = document.createElement("div");
    statusCell.style.textAlign = "center";

    const statusBadge = document.createElement("span");
    statusBadge.className = `status-badge ${result.status === "success" ? "success" : "failed"}`;

    const statusDot = document.createElement("div");
    statusDot.className = "status-dot";

    const statusText = document.createElement("span");
    statusText.textContent = result.status === "success" ? "Success" : "Failed";

    statusBadge.appendChild(statusDot);
    statusBadge.appendChild(statusText);
    statusCell.appendChild(statusBadge);

    // Transcript
    const transcriptCell = document.createElement("div");
    const transcriptBox = document.createElement("div");
    transcriptBox.className = "transcript-box";
    transcriptBox.textContent = result.text || "—";
    transcriptCell.appendChild(transcriptBox);

    // Append cells (ORDER MATTERS)
    row.appendChild(providerCell);
    row.appendChild(modelCell);        // ✅ added
    row.appendChild(werCell);
    row.appendChild(latencyCell);
    row.appendChild(statusCell);
    row.appendChild(transcriptCell);

    resultsBody.appendChild(row);
  });
}
