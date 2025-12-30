document.querySelector("form").addEventListener("submit",async (event) => {
  event.preventDefault();

  let newPassword = document.querySelector("#password").value.trim();
  let cnfPassword = document.querySelector("#cnfpassword").value.trim();
  const msgbox = document.querySelector("#msgbox");

  if(newPassword !== cnfPassword){
    alert("both passwords should be same");
    return;
  }

  try {
    // UPDATED: Using relative path for Netlify Proxy
    let res = await fetch("/api/v1/user/reset-password",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        newPassword
      }),
      credentials : "include" // Vital for Safari to send the session/OTP cookie
    });

    let data = await res.json();

    if (res.ok) {
      msgbox.textContent = "OTP verified successfully!";
      msgbox.style.backgroundColor = "green";
      
      //redirecting to login
      setTimeout(() => {
        window.location.replace("/pages/login.html");
      },1500);
    } else {
      msgbox.textContent = data.message || "Failed to verify OTP";
      msgbox.style.backgroundColor = "red";
      alert(data.message || "Failed to verify OTP");
    }
  } catch (error) {
    msgbox.textContent = `Error: ${error.message}`;
    msgbox.style.backgroundColor = "red";
    alert(`Error connecting to server: ${error.message}`);
    console.error("Fetch error:", error);
  }
})