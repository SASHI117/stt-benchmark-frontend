const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // TEMP credentials
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "index.html";
  } else {
    errorMsg.textContent = "Incorrect username or password";
    errorMsg.classList.remove("hidden");
  }
});
