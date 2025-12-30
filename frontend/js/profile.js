document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.getElementById("profile-container");

  try {
    const res = await fetch("https://aod-predictor.onrender.com/api/v1/user/user-details", {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    if (res.ok) {
      const user = result.data.user;

      profileContainer.innerHTML = `
        <p><strong>Full Name:</strong> ${user.fullName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone || "Not Provided"}</p>
      `;
    } else {
      profileContainer.innerHTML = `<p>Error: ${result.message}</p>`;
    }
  } catch (error) {
    profileContainer.innerHTML = `<p>Error loading profile: ${error.message}</p>`;
  }
});

