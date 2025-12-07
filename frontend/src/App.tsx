import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import CrowdMonitor from './pages/CrowdMonitor';
import QueueStatus from './pages/QueueStatus';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="crowd" element={<CrowdMonitor />} />
        <Route path="queues" element={<QueueStatus />} />
        
        {/* Protected Routes */}
        <Route
          path="dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="booking"
          element={isAuthenticated ? <Booking /> : <Navigate to="/login" />}
        />
        
        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
