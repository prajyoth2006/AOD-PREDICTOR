const form = document.querySelector("form");
const msgbox = document.querySelector("#msgbox");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = document.querySelector("#email");
    if (!emailInput) return;

    const email = emailInput.value.trim();

    if (!email) {
      alert("Email is required");
      return;
    }

    try {
      // UPDATED: Using relative path for Netlify Proxy
      const res = await fetch(
        "/api/v1/user/forget-pass-req",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          credentials: "include" // Keeps session consistency in Safari
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        if (msgbox) {
          msgbox.innerHTML = "OTP sent successfully!";
          msgbox.style.backgroundColor = "green";
        }

        form.reset();

        setTimeout(() => {
          window.location.replace("/pages/forgotpassword-verify.html");
        }, 1500);
      } else {
        const message = data.message || "Failed to send OTP";
        if (msgbox) {
          msgbox.innerHTML = message;
          msgbox.style.backgroundColor = "red";
        }
        alert(message);
      }
    } catch (error) {
      const message = `Error connecting to server: ${error.message}`;
      alert(message);
      if (msgbox) msgbox.innerHTML = message;
    }
  });
}