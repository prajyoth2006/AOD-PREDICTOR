document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.getElementById("profile-container");

  try {
    // UPDATED: Using relative path to go through the Netlify Proxy
    const res = await fetch("/api/v1/user/user-details", {
      method: "GET",
      credentials: "include", // This sends the cookie back to the server
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