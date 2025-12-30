document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is already logged in
  try {
    // UPDATED: Relative path used
    const res = await fetch("/api/v1/user/user-details", {
      method: "GET",
      credentials: "include", // Essential for sending the cookie back
    });

    if (res.ok) {
      window.location.replace("/pages/aod.html");
      return;
    }
  } catch (err) {
    console.log("User not logged in.");
  }

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
      // UPDATED: Relative path used
      let res = await fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Essential for receiving the cookie
      });

      const data = await res.json();

      if (res.ok) {
        msgbox.innerHTML = "Login Successfully!";
        msgbox.style.backgroundColor = "green";
        document.querySelector("form").reset();

        setTimeout(() => {
          window.location.href = "/pages/aod.html";
        }, 1500);
      } else {
        msgbox.innerHTML = "LOGIN FAILED";
        msgbox.style.backgroundColor = "red";
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert(`Error connecting to server: ${error.message}`);
    }
  });
});