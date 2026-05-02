import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Overview } from './pages/dashboard/overview';
import { Projects } from './pages/dashboard/projects';
import { Controls } from './pages/dashboard/controls';
import { Rules } from './pages/dashboard/rules';
import { Banners } from './pages/dashboard/banners';
import { Activity } from './pages/dashboard/activity';
import { Install } from './pages/dashboard/install';
import { Settings } from './pages/dashboard/settings';
import { Login } from './pages/auth/login';
import { Signup } from './pages/auth/signup';
import { VerifyOtp } from './pages/auth/verify-otp';
import { Reset } from './pages/auth/reset';
import { ForgotPassword } from './pages/auth/forgot-password';
import { ToastProvider } from './components/ui';
import { AUTH_TOKEN_KEY } from './lib/api';

const ProtectedRoute = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY) ? <AppLayout /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute />}>
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
    </ToastProvider>
  );
}
