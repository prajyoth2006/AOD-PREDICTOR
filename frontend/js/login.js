import { API_BASE_URL } from "./constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.querySelector("#loader");
  const msgbox = document.querySelector("#msgbox");
  const form = document.querySelector("form");

  // ==========================================
  // 1. Initial Auth Check (Waking up the server)
  // ==========================================
  
  // Show the loader and a message immediately when the page loads
  if (loader) loader.style.display = "block";
  if (msgbox) {
    msgbox.innerHTML = "Checking session... (Server may be waking up)";
    msgbox.style.backgroundColor = "orange";
    msgbox.style.display = "block";
  }
  
  // Optionally hide the form so they don't try to type while it's loading
  if (form) form.style.opacity = "0.5"; 
  if (form) form.style.pointerEvents = "none";

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/user/user-details`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      // User is logged in! Redirect instantly.
      window.location.replace("/pages/aod.html");
      return; 
    }
  } catch (err) {
    console.log("No active session or server took too long to wake up.");
  } finally {
    // Check finished. They are not logged in. 
    // Hide the loader, clear the message, and enable the form.
    if (loader) loader.style.display = "none";
    if (msgbox) msgbox.innerHTML = "";
    if (form) form.style.opacity = "1";
    if (form) form.style.pointerEvents = "auto";
  }

  // ==========================================
  // 2. Attach Login Form Handler
  // ==========================================
  
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      let email = document.querySelector("#email").value.trim();
      let password = document.querySelector("#password").value.trim();

      if (!email || !password) {
        alert("All fields are necessary");
        return;
      }

      loader.style.display = "block";   
      msgbox.innerHTML = "Logging in...";
      msgbox.style.backgroundColor = "orange";

      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        let data = null;
        try {
          data = await res.json();
        } catch {}

        if (res.ok) {
          msgbox.innerHTML = "Login Successfully!";
          msgbox.style.backgroundColor = "green";

          setTimeout(() => {
            window.location.href = "/pages/aod.html";
          }, 1500);
        } else {
          msgbox.innerHTML = "LOGIN FAILED";
          msgbox.style.backgroundColor = "red";
        }

      } catch (error) {
        msgbox.innerHTML = "Network error. Please try again.";
        msgbox.style.backgroundColor = "red";
      } finally {
        loader.style.display = "none";  
      }
    });
  }
});