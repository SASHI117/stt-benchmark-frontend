// Aggressive anti-autofill
document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  
  // Clear immediately
  if (usernameInput) {
    usernameInput.value = "";
    
    // Clear on any autofill attempt
    setTimeout(() => {
      usernameInput.value = "";
    }, 100);
    
    setTimeout(() => {
      usernameInput.value = "";
    }, 500);
  }
});

// Form submission
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
