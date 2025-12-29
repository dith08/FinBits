import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/Dashboard';
import FinancePage from './pages/Finance';
import ProductivityPage from './pages/Productivity';
import GoalsPage from './pages/Goals';
import ProfilePage from './pages/Profile';
import NotificationPage from './pages/Notification';



function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/productivity" element={<ProductivityPage />}></Route>
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/goals" element={<GoalsPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/notifications" element={<NotificationPage />}></Route>
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;