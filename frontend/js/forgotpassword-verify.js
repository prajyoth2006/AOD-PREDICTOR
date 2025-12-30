const otpInputs = document.querySelectorAll(".otp-input");
const form = document.querySelector("form");
const msgbox = document.querySelector("#msgbox");

otpInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    const value = e.target.value;

    //move to next box when number is entered
    if (value.length === 1 && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }

    // Auto-submit when last box is filled
    if (index === otpInputs.length - 1 && value.length === 1) {
      form.querySelector("button[type='submit']").click();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      // If input is empty, move to previous box
      if (input.value === "" && index > 0) {
        otpInputs[index - 1].focus();
        otpInputs[index - 1].value = "";
      }
    }
  });
});

// Form submission 
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const otpEntered = Array.from(otpInputs).map(input => input.value).join("");

  if (otpEntered.length !== 6) {
    alert("Please enter 6-digit OTP");
    msgbox.textContent = "Please enter the 6-digit OTP";
    msgbox.style.backgroundColor = "red";
    return;
  }

  try {
    let res = await fetch("https://aod-predictor.onrender.com/api/v1/user/forget-pass-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ otpEntered }),
      credentials: "include"
    });

    let data = await res.json();
    if (res.ok) {
      msgbox.textContent = "OTP verified successfully!";
      msgbox.style.backgroundColor = "green";
      otpInputs.forEach(input => input.value = "");
      
      //redirecting to reset password
      setTimeout(() => {
        window.location.replace("http://localhost:5500/pages/resetpassword.html");
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
});

