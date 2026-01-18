// version: farmvaidya-login-2026-final-fix

// Force-clear browser autofilled username
window.addEventListener("load", () => {
  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    usernameInput.value = "";
  }
});

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (
    username === "admin@example.com" &&
    password === "***REMOVED***"
  ) {
    localStorage.setItem(
      "session",
      JSON.stringify({
        user: username,
        role: "admin",
        loginAt: new Date().toISOString()
      })
    );

    window.location.href = "index.html";
  } else {
    errorMsg.classList.remove("hidden");
  }
});
