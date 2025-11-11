document.querySelector("form").addEventListener("submit",async(event) => {
  event.preventDefault();

  let email = document.querySelector("#email").value.trim();
  let msgbox = document.querySelector("#msgbox");

  if(!email){
    alert("email is required");
    return;
  }

  try {
    let res = await fetch("http://localhost:8000/api/v1/user/forget-pass-req",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        email
      }),
      credentials : "include"
    });

    let data = await res.json();

    if(res.ok){
      msgbox.innerHTML = "Otp sent Successfully!";
      msgbox.style.backgroundColor = "green";
      document.querySelector("form").reset();

      setTimeout(() => {
        window.location.replace("http://localhost:5500/pages/forgotpassword-verify.html");
      },1500);
    }else{
      msgbox.innerHTML = data.message || "Failed to sent otp";
      msgbox.style.backgroundColor = "red";
      console.log(data.message);
      alert(data.message || "Failed to sent otp");
    }
  } catch (error) {
    alert(`Error connecting to server. Error = ${error.message}`);
    console.log(
      `Error occurred while connecting to backend servers. Error: ${error}`
    );
    msgbox.innerHTML = `Error = ${error.message}`;
  }
});