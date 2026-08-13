const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // AirSense standard is VITE_API_URL

export async function createReport(formData) {
  const res = await fetch(`${BASE_URL}/reports`, { 
    method: "POST", 
    body: formData 
  });
  return res.json();
}

export async function getAllReports() {
  const res = await fetch(`${BASE_URL}/reports`);
  return res.json();
}

export async function getMyReports(userId) {
  const res = await fetch(`${BASE_URL}/reports/mine/${userId}`);
  return res.json();
}

export async function getReportById(id) {
  const res = await fetch(`${BASE_URL}/reports/${id}`);
  return res.json();
}

export async function updateStatus(id, status) {
  const res = await fetch(`${BASE_URL}/reports/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function upvoteReport(id) {
  const res = await fetch(`${BASE_URL}/reports/${id}/upvote`, { method: "POST" });
  return res.json();
}

export async function escalateToCMHelp(id) {
  const res = await fetch(`${BASE_URL}/reports/${id}/escalate`, { method: "POST" });
  return res.json();
}
