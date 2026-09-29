// Where the FastAPI backend lives. Override per deployment by editing this
// file (no build step): e.g. "https://your-backend.example.com".
window.STT_CONFIG = {
  backendUrl: ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:8000"
    : "https://stt-benchmark-backend.onrender.com",
};
