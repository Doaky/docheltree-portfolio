import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage/home';
import ProjectsPage from './pages/ProjectsPage/projects';
import ProjectDetailPage from './pages/ProjectDetailPage/projectDetail';
import KellyPoolPage from './pages/KellyPoolPage/KellyPoolPage';
import KellyPoolLegacyPage from './pages/KellyPoolLegacyPage/KellyPoolLegacyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:category/:slug" element={<ProjectDetailPage />} />
        <Route path="/projects/kellypool" element={<KellyPoolPage />} />
        <Route path="/projects/kellypool-legacy" element={<KellyPoolLegacyPage />} />
        {/* Redirects */}
        <Route path="/projects/kellypool-claude" element={<Navigate to="/projects/kellypool" replace />} />
        <Route path="/kellypool" element={<Navigate to="/projects/kellypool" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
