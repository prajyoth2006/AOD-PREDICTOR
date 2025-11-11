document.querySelector("form").addEventListener("submit",async (event) => {
  event.preventDefault();

  let oldPassword = document.querySelector("#oldpassword").value.trim();
  let newPassword = document.querySelector("#newpassword").value.trim();
  let cnfnewPassword = document.querySelector("#cnfnewpassword").value.trim();
  const msgbox = document.querySelector("#msgbox");

  if(newPassword !== cnfnewPassword){
    alert("both passwords should be same");
    return;
  }

  try {
    let res = await fetch("http://localhost:8000/api/v1/user/update-password",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        oldPassword,
        newPassword
      }),
      credentials : "include"
    });

    let data = await res.json();

    if(res.ok){
      msgbox.innerHTML = "Password updated successfully!";
      msgbox.style.backgroundColor = "green";
      document.querySelector("form").reset();

      setTimeout(() => {
        window.location.replace("http://localhost:5500/pages/profile.html")
      },1500);
    }else{
      msgbox.innerHTML = data.message || "Password update failed";
      msgbox.style.backgroundColor = "red";
      console.log(data.message);
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    alert(`Error connecting to server. Error = ${error.message}`);
    console.log(`Connection error. Error: ${error}`);
  }
});