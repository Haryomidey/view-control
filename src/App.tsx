import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Overview } from './pages/Overview';
import { Projects } from './pages/Projects';
import { Controls } from './pages/Controls';
import { Rules } from './pages/Rules';
import { Banners } from './pages/Banners';
import { Activity } from './pages/Activity';
import { Install } from './pages/Install';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/controls" element={<Controls />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/install" element={<Install />} />
          <Route path="/settings" element={<Settings />} />
          {/* Catch all to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
