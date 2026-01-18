const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // ONLY valid credentials
  if (username === "farmvaidya_admin" && password === "farmvaidya_2026") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username); // optional but good
    window.location.href = "index.html";
  } else {
    errorMsg.classList.remove("hidden");
  }
});
