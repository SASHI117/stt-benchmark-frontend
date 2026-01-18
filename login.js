const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

// ORG credentials (frontend phase only)
const VALID_USERNAME = "admin@example.com";
const VALID_PASSWORD = "***REMOVED***";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    // Store session object (prevents old bug you faced)
    localStorage.setItem(
      "session",
      JSON.stringify({
        user: username,
        role: "admin",
        loginAt: Date.now()
      })
    );

    window.location.href = "index.html";
  } else {
    errorMsg.classList.remove("hidden");
  }
});
