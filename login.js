// DEMO CREDENTIALS (FarmVaidya)
const VALID_USERNAME = "farmvaidya_admin";
const VALID_PASSWORD = "***REMOVED***";

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html";
  } else {
    errorMsg.classList.remove("hidden");
  }
});
