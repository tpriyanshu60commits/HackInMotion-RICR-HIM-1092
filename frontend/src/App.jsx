import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MainLayout } from './layouts/MainLayout';
import { WaterDropLoader } from './components/common/WaterDropLoader';
import useStore from './store/useStore';
import api from './services/api';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Locations } from './pages/Locations';
import { Alerts } from './pages/Alerts';
import { Profile } from './pages/Profile';
import { Compare } from './pages/Compare';
import { RouteRisk } from './pages/RouteRisk';
import { HistoricalTrends } from './pages/HistoricalTrends';
import { CommunityReports } from './pages/CommunityReports';
import { Education } from './pages/Education';
import AiAssistant from './pages/AiAssistant';

// Public Route Wrapper (Redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useStore();
  
  if (isInitializing) return <div className="flex min-h-screen items-center justify-center"><WaterDropLoader message="Initializing Environment..." /></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  
  return children;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useStore();
  
  if (isInitializing) return <div className="flex min-h-screen items-center justify-center"><WaterDropLoader message="Verifying access..." /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  const { setUser, setInitializing } = useStore();

  useEffect(() => {
    const verifyAuth = async () => {
      // If there's no token in localStorage, backend route won't work anyway
      // since the interceptor looks for localStorage 'auth_token'. 
      // (Even if using httpOnly cookies, this explicit check verifies the user profile).
      try {
        const res = await api.get('/auth/me');
        if (res.data?.success && res.data?.data) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    verifyAuth();
  }, [setUser, setInitializing]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/history" element={<HistoricalTrends />} />
            <Route path="/community" element={<CommunityReports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/route" element={<RouteRisk />} />
            <Route path="/education" element={<Education />} />
            <Route path="/ai" element={<AiAssistant />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
