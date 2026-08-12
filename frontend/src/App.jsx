import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import useStore from './store/useStore';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AiAssistant from './pages/AiAssistant';
import CityComparison from './pages/CityComparison';
import RoutePlanner from './pages/RoutePlanner';
import CommunityReports from './pages/CommunityReports';

function App() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    // Apply theme class to document body
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ai" element={<AiAssistant />} />
          <Route path="/compare" element={<CityComparison />} />
          <Route path="/route" element={<RoutePlanner />} />
          <Route path="/reports" element={<CommunityReports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;