import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';
import { WaterDropLoader } from './components/common/WaterDropLoader';
import useStore from './store/useStore';
import api from './services/api';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Locations = lazy(() => import('./pages/Locations').then(module => ({ default: module.Locations })));
const Alerts = lazy(() => import('./pages/Alerts').then(module => ({ default: module.Alerts })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Compare = lazy(() => import('./pages/Compare').then(module => ({ default: module.Compare })));
const RouteRisk = lazy(() => import('./pages/RouteRisk').then(module => ({ default: module.RouteRisk })));
const HistoricalTrends = lazy(() => import('./pages/HistoricalTrends').then(module => ({ default: module.HistoricalTrends })));
const Education = lazy(() => import('./pages/Education').then(module => ({ default: module.Education })));
const ReportPage = lazy(() => import('./pages/ReportPage').then(module => ({ default: module.ReportPage })));
const NotFound = lazy(() => import('./pages/NotFound'));

// Public Route Wrapper (Redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitializing, user } = useStore();

  if (isInitializing)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <WaterDropLoader message="Initializing Environment..." />
      </div>
    );

  if (isAuthenticated) {
    const dashboardRoute =
      user?.role === 'admin' || user?.userType === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useStore();

  if (isInitializing)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <WaterDropLoader message="Verifying access..." />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  const { setUser, setInitializing } = useStore();

  useEffect(() => {
    // ... inside App ...

    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setUser(null);
          setInitializing(false);
          return;
        }

        const res = await api.get('/auth/me');
        if (res.data?.success && res.data?.data) {
          setUser(res.data.data);
        } else {
          setUser(null);
          localStorage.removeItem('auth_token');
        }
      } catch {
        setUser(null);
        localStorage.removeItem('auth_token');
      } finally {
        setInitializing(false);
      }
    };

    verifyAuth();
  }, [setUser, setInitializing]);

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <WaterDropLoader message="Loading App..." />
        </div>
      }>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/history" element={<HistoricalTrends />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/route" element={<RouteRisk />} />
            <Route path="/education" element={<Education />} />
            <Route path="/report" element={<ReportPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
