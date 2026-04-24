import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/home';
import ProjectsPage from './pages/ProjectsPage/projects';
import ProjectDetailPage from './pages/ProjectDetailPage/projectDetail';
import KellyPoolPage from './pages/KellyPoolPage/KellyPoolPage';
import KellyPoolLegacyPage from './pages/KellyPoolLegacyPage/KellyPoolLegacyPage';
// import CatCalendarPage from './pages/CatCalendarPage/CatCalendarPage'; // WIP
import TipTrainerPage from './pages/TipTrainerPage/TipTrainerPage';
import DevPage from './pages/DevPage/DevPage';
import ResumePage from './pages/ResumePage/ResumePage';

function App() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).grained?.('#grain-overlay', {
      animate: true,
      patternWidth: 100,
      patternHeight: 100,
      grainOpacity: 0.01,
      grainDensity: 1,
      grainWidth: 1,
      grainHeight: 1,
    });
    const overlay = document.getElementById('grain-overlay');
    if (overlay) overlay.style.position = 'fixed';
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/projects/:category/:slug" element={<ProjectDetailPage />} />
        <Route path="/projects/kellypool" element={<KellyPoolPage />} />
        <Route path="/projects/kellypool-legacy" element={<KellyPoolLegacyPage />} />
        {/* <Route path="/projects/cat-calendar" element={<CatCalendarPage />} /> */}{/* WIP */}
        <Route path="/projects/tip-trainer" element={<TipTrainerPage />} />
        {/* Dev — design comparison, not in sitemap */}
        <Route path="/dev" element={<DevPage />} />
        {/* Redirects */}
        <Route path="/projects/kellypool-claude" element={<Navigate to="/projects/kellypool" replace />} />
        <Route path="/kellypool" element={<Navigate to="/projects/kellypool" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
