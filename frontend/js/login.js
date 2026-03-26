document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  let email = document.querySelector("#email").value.trim();
  let password = document.querySelector("#password").value.trim();
  let msgbox = document.querySelector("#msgbox");
  let loader = document.querySelector("#loader");

  if (!email || !password) {
    alert("All fields are necessary");
    return;
  }

  loader.style.display = "block";   // 🔥 SHOW LOADER
  msgbox.innerHTML = "";

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
    msgbox.innerHTML = "Server is starting... please wait";
    msgbox.style.backgroundColor = "orange";
  } finally {
    loader.style.display = "none";   // 🔥 HIDE LOADER AFTER RESPONSE
  }
});