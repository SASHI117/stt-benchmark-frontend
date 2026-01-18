// version: farmvaidya-login-2026-final-final

function clearUsername() {
  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    usernameInput.value = "";
  }
}

// Clear on page load
window.addEventListener("load", clearUsername);

// Clear again when user focuses the field
document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    usernameInput.addEventListener("focus", clearUsername);
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
