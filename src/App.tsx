import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/public/home';
import { Docs } from './pages/public/docs';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/dashboard/projects" element={<Projects />} />
            <Route path="/dashboard/controls" element={<Controls />} />
            <Route path="/dashboard/rules" element={<Rules />} />
            <Route path="/dashboard/banners" element={<Banners />} />
            <Route path="/dashboard/activity" element={<Activity />} />
            <Route path="/dashboard/install" element={<Install />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
