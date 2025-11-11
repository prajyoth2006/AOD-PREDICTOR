document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is already logged in (session cookie exists)
  try {
    const res = await fetch("http://localhost:8000/api/v1/user/user-details", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      // Already logged in, redirect directly
      window.location.replace("http://localhost:5500/pages/aod.html");
      return;
    }
  } catch (err) {
    console.log("User not logged in, showing login form.");
  }

  // Attach login handler
  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    let email = document.querySelector("#email").value.trim();
    let password = document.querySelector("#password").value.trim();
    let msgbox = document.querySelector("#msgbox");

    if (!email || !password) {
      alert("All fields are necessary");
      return;
    }

    try {
      console.log("Attempting login...");

      let res = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // For sending cookies
      });

      const data = await res.json();
      console.log("DATA RECEIVED:", data);

      if (res.ok) {
        msgbox.innerHTML = "Login Successfully!";
        msgbox.style.backgroundColor = "green";
        document.querySelector("form").reset();

        setTimeout(() => {
          window.location.href = "http://localhost:5500/pages/aod.html";
        }, 1500);
      } else {
        msgbox.innerHTML = "LOGIN FAILED";
        msgbox.style.backgroundColor = "red";
        console.log(data.message);
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert(`Error connecting to server. Error = ${error.message}`);
      console.log(
        `Error occurred while connecting to backend servers. Error: ${error}`
      );
    }
  });
});