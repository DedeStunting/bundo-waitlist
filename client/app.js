const form = document.getElementById("waitlistForm");
const success = document.getElementById("success");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

// Change this later to your live backend URL (e.g. https://api.bundo.ng)
const API_BASE = "http://localhost:4000";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());

  try {
    const res = await fetch(`${API_BASE}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.message || "Something went wrong");
      return;
    }

    form.reset();
    form.hidden = true;
    success.hidden = false;
  } catch (err) {
    alert("Could not connect to server. Is the backend running?");
  }
});
