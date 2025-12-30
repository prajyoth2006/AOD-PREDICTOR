const msgbox = document.querySelector("#msgbox");

document.querySelector("#logout").addEventListener("click", async (event) => {
  event.preventDefault();
  try {
  let res = await fetch("https://aod-predictor.onrender.com/api/v1/user/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });
  console.log("Entered");

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.warn("Failed to parse JSON:", e);
    data = { message: "No response body or invalid JSON" };
  }

  if (res.ok) {
    if (msgbox) msgbox.innerHTML = `${data.message}`;
    window.location.replace("http://localhost:5500/index.html");
  } else {
    console.log(data.message);
    if (msgbox) msgbox.innerHTML = `${data.message}`;
  }

} catch (error) {
  console.log(`Error occurred while fetching logout API. Error: ${error}`);
  alert(`Error: ${error}`);
  if (msgbox) msgbox.innerHTML = `${error.message}`;
}
});

document.querySelector("#profile").addEventListener("click",async(event) => {
  event.preventDefault();
  window.location.replace("http://localhost:5500/pages/profile.html");
});

document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const msgbox = document.querySelector("#msgbox");

  msgbox.style.display = "block";
  msgbox.className = "";
  msgbox.style.backgroundColor = "#666";
  msgbox.innerText = "⏳ Predicting...";

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

    const response = await fetch("https://aod-ml-service.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features })
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const result = await response.json();
    msgbox.className = "success";
    msgbox.innerText = "✅ Predicted AOD: " + result.prediction.toFixed(4);
  } catch (error) {
    msgbox.className = "error";
    msgbox.innerText = "❌ Error: " + error.message;
  }
});