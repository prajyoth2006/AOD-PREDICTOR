const msgbox = document.querySelector("#msgbox");

const logoutBtn = document.querySelector("#logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      // UPDATED: Changed to relative path to use Netlify Proxy
      const res = await fetch(
        "/api/v1/user/logout", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }
      );

      const data = await res.json().catch(() => ({
        message: "No response body"
      }));

      if (res.ok) {
        if (msgbox) msgbox.innerHTML = data.message;
        window.location.replace("/index.html");
      } else {
        if (msgbox) msgbox.innerHTML = data.message;
      }
    } catch (error) {
      if (msgbox) msgbox.innerHTML = error.message;
    }
  });
}

const profileBtn = document.querySelector("#profile");
if (profileBtn) {
  profileBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.replace("/pages/profile.html");
  });
}

const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (msgbox) {
      msgbox.style.display = "block";
      msgbox.className = "";
      msgbox.style.backgroundColor = "#666";
      msgbox.innerText = "⏳ Predicting...";
    }

    try {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());

      const features = [
        parseFloat(data.zust),
        parseFloat(data.BA),
        parseFloat(data.tsr),
        parseFloat(data.tisr),
        parseFloat(data.LST),
        parseFloat(data["t at 1000 hPa"]),
        parseFloat(data["d at 850 hPa"]),
        parseFloat(data.NDVI),
        parseInt(data.ptype),
        parseFloat(data.ws_100m)
      ];

      // KEEP AS IS: This is a different service (ML model)
      const response = await fetch(
        "https://aod-ml-service.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features })
        }
      );

      if (!response.ok) {
        throw new Error("Server error: " + response.status);
      }

      const result = await response.json();
      if (msgbox) {
        msgbox.className = "success";
        msgbox.innerText =
          "✅ Predicted AOD: " + result.prediction.toFixed(4);
      }
    } catch (error) {
      if (msgbox) {
        msgbox.className = "error";
        msgbox.innerText = "❌ Error: " + error.message;
      }
    }
  });
}