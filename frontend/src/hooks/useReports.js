import { useState, useCallback } from 'react';
import * as api from '../api/reportApi';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAllReports();
      if (res.success) {
        setReports(res.data);
      } else {
        setError(res.error);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error occurred';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyReports = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.getMyReports(userId);
      if (res.success) {
        setMyReports(res.data);
      } else {
        setError(res.error);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error occurred';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = async (formData, userId) => {
    setLoading(true);
    try {
      const res = await api.createReport(formData);
      if (res.success) {
        await fetchAllReports();
        await fetchMyReports(userId);
        return { success: true, data: res.data };
      } else {
        setError(res.error);
        return { success: false, error: res.error };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error occurred';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, userId) => {
    setLoading(true);
    try {
      const res = await api.updateStatus(id, status);
      if (res.success) {
        await fetchAllReports();
        await fetchMyReports(userId);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error occurred';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const upvoteReport = async (id, userId) => {
    setLoading(true);
    try {
      const res = await api.upvoteReport(id);
      if (res.success) {
        await fetchAllReports();
        await fetchMyReports(userId);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error occurred';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const escalateToCMHelp = async (id, userId) => {
    setLoading(true);
    try {
      const res = await api.escalateToCMHelp(id);
      if (res.success) {
        await fetchAllReports();
        await fetchMyReports(userId);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error occurred';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    myReports,
    loading,
    error,
    fetchAllReports,
    fetchMyReports,
    createReport,
    updateStatus,
    upvoteReport,
    escalateToCMHelp
  };
}
