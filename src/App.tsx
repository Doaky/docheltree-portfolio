import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const HomePage          = lazy(() => import('./pages/HomePage/home'));
const ProjectsPage      = lazy(() => import('./pages/ProjectsPage/projects'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage/projectDetail'));
const KellyPoolPage     = lazy(() => import('./pages/KellyPoolPage/KellyPoolPage'));
const KellyPoolLegacyPage = lazy(() => import('./pages/KellyPoolLegacyPage/KellyPoolLegacyPage'));
const TipTrainerPage    = lazy(() => import('./pages/TipTrainerPage/TipTrainerPage'));
const WigglegramPage    = lazy(() => import('./pages/WigglegramPage/WigglegramPage'));
const DevPage           = lazy(() => import('./pages/DevPage/DevPage'));

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
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:category/:slug" element={<ProjectDetailPage />} />
          <Route path="/projects/kellypool" element={<KellyPoolPage />} />
          <Route path="/projects/kellypool-legacy" element={<KellyPoolLegacyPage />} />
          {/* <Route path="/projects/cat-calendar" element={<CatCalendarPage />} /> */}{/* WIP */}
          <Route path="/projects/tip-trainer" element={<TipTrainerPage />} />
          <Route path="/projects/wigglegram" element={<WigglegramPage />} />
          {/* Dev — design comparison, not in sitemap */}
          <Route path="/dev" element={<DevPage />} />
          {/* Redirects */}
          <Route path="/projects/kellypool-claude" element={<Navigate to="/projects/kellypool" replace />} />
          <Route path="/kellypool" element={<Navigate to="/projects/kellypool" replace />} />
          <Route path="/kellyPoolGenerator.html" element={<Navigate to="/projects/kellypool" replace />} />
          {/* Fallback: unknown /projects/* → /projects, everything else → / */}
          <Route path="/projects/*" element={<Navigate to="/projects" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
