// version: farmvaidya-login-2026-final

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // VALID ADMIN CREDENTIALS
  const ADMIN_USERNAME = "admin@example.com";
  const ADMIN_PASSWORD = "***REMOVED***";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Create session
    localStorage.setItem(
      "session",
      JSON.stringify({
        user: ADMIN_USERNAME,
        role: "admin",
        loginAt: new Date().toISOString()
      })
    );

    // Redirect to dashboard
    window.location.href = "index.html";
  } else {
    errorMsg.classList.remove("hidden");
  }
});
