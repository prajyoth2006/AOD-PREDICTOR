let msgbox = document.querySelector("#msgbox");
document.querySelector("form").addEventListener("submit",async (event) => {
  event.preventDefault();

  let newFullName = document.querySelector("#fullname").value.trim();
  let newPhone = document.querySelector("#phone").value.trim();

  if(!newFullName && !newPhone){
    alert("Required any of the following");
    return;
  }

  try {
    let res = await fetch("https://aod-predictor.onrender.com/api/v1/user/update-details",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        newFullName,
        newPhone
      }),
      credentials : "include",
    });

    let data = await res.json();

    if(res.ok){
      msgbox.innerHTML = "Update Successfully!";
      msgbox.style.backgroundColor = "green";
      document.querySelector("form").reset();

      setTimeout(() => {
        window.location.replace("/pages/profile.html")
      },1500);
    }else{
      msgbox.innerHTML = "UPDATE FAILED";
      msgbox.style.backgroundColor = "red";
      console.log(data.message);
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    alert(`Error connecting to server. Error = ${error.message}`);
    console.log(
      `Error occurred while connecting to backend servers. Error: ${error}`
    );
  }
});