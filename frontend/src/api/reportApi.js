import api from '../services/api';

export async function createReport(formData) {
  const res = await api.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export async function getAllReports() {
  const res = await api.get('/reports');
  return res.data;
}

export async function getMyReports(userId) {
  const res = await api.get(`/reports/mine/${userId}`);
  return res.data;
}

export async function updateStatus(id, status) {
  const res = await api.patch(`/reports/${id}/status`, { status });
  return res.data;
}

export async function upvoteReport(id) {
  const res = await api.post(`/reports/${id}/upvote`);
  return res.data;
}

export async function escalateToCMHelp(id) {
  const res = await api.post(`/reports/${id}/escalate`);
  return res.data;
}
