import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import { ProtectedRoute } from './components/layout';
import DashboardPage from './pages/Dashboard';
import FinancePage from './pages/Finance';
import ProductivityPage from './pages/Productivity';
import GoalsPage from './pages/Goals';
import ProfilePage from './pages/Profile';
import NotificationPage from './pages/Notification';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import GoogleCallback from './pages/GoogleCallback';
import { setTokenExpiredCallback } from './services/apiInstance';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    setTokenExpiredCallback(() => {
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;