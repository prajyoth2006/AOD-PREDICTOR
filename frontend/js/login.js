import { API_BASE_URL } from "./constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.querySelector("#loader");
  const msgbox = document.querySelector("#msgbox");
  const form = document.querySelector("form");

  // ==========================================
  // 1. Initial Auth Check 
  // ==========================================
  
  if (loader) loader.style.display = "block";
  if (msgbox) {
    msgbox.innerHTML = "Checking session...";
    msgbox.style.backgroundColor = "orange";
    msgbox.style.display = "flex"; // Make sure it is visible
  }
  
  if (form) {
    form.style.opacity = "0.5"; 
    form.style.pointerEvents = "none";
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/user/user-details`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      if (msgbox) {
        msgbox.innerHTML = "Session found! Redirecting...";
        msgbox.style.backgroundColor = "green";
      }
      
      setTimeout(() => {
        window.location.replace("/pages/aod.html");
      }, 1500); 
      
      return; 
    }
  } catch (err) {
    console.log("No active session or server took too long to wake up.");
  } 
  
  // 🔥 THE FIX: The check finished, and they are not logged in.
  // Hide the loader AND completely hide the message box.
  if (loader) loader.style.display = "none";
  if (msgbox) {
    msgbox.innerHTML = "";
    msgbox.style.backgroundColor = "transparent"; // Clear the color
    msgbox.style.display = "none"; // Hide the element entirely
  }
  if (form) {
    form.style.opacity = "1";
    form.style.pointerEvents = "auto";
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
      
      // 🔥 THE FIX: Make the message box visible again for the login attempt
      msgbox.style.display = "flex"; 
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