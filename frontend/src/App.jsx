import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MainLayout } from './layouts/MainLayout';

// Mock Pages for now
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Locations } from './pages/Locations';
import { Alerts } from './pages/Alerts';
import { Profile } from './pages/Profile';
import { Compare } from './pages/Compare';
import { RouteRisk } from './pages/RouteRisk';
import { HistoricalTrends } from './pages/HistoricalTrends';
import { CommunityReports } from './pages/CommunityReports';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/history" element={<HistoricalTrends />} />
            <Route path="/community" element={<CommunityReports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/route" element={<RouteRisk />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
