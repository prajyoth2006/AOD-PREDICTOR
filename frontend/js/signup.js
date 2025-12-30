document.querySelector("form").addEventListener("submit",async (event) => {
  event.preventDefault();

  const fullName = document.querySelector("#fullName").value.trim();
  const email = document.querySelector("#email").value.trim();
  const phone = document.querySelector("#phoneNumber").value.trim();
  const password = document.querySelector("#password").value.trim();
  const cnfPassword = document.querySelector("#cnfPassword").value.trim();

  if (password !== cnfPassword) {
    alert("Passwords do not match!");
    return;
  }

  if(phone.length != 10){
    alert("Enter valid phone number!");
    return;
  }

  try {
    // UPDATED: Using relative path for Netlify Proxy
    let responce = await fetch("/api/v1/user/register",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        fullName,
        email,
        phone,
        password
      }),
      credentials: "include" // Added to ensure session cookies are handled if sent on register
    })
  
    let msgbox = document.querySelector("#msg");
    const data = await responce.json();
    if(responce.ok){
      msgbox.innerHTML = `Successfully Registered!`;
      msgbox.style.backgroundColor = "green";
      document.querySelector("form").reset();
      setTimeout(()=>{
        window.location.href = "../index.html"
      },1500)
    }else{
      msgbox.innerHTML = `REGISTRATION FAILED`;
      msgbox.style.backgroundColor = "red";
      console.log(data.message);
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    alert("Error connecting to server.");
    console.log(`error occured while connecting to backend servers through register . Error : ${error}`);
  }
});