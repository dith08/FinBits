import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/Dashboard';
import FinancePage from './pages/Finance';
import ProductivityPage from './pages/Productivity';
import GoalsPage from './pages/Goals';
import ProfilePage from './pages/Profile';
import NotificationPage from './pages/Notification';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes (Gak pake Layout) --- */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected/Private Routes (Pake MainLayout) --- */}
        {/* Kita bungkus semua route yang butuh sidebar ke dalam satu Route parent */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>

        {/* Fallback kalau path gak ketemu, lempar ke login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;