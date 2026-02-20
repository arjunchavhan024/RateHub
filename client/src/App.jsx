import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<ProtectedRoute allowedRoles={['System Administrator']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>


            <Route element={<ProtectedRoute allowedRoles={['Normal User']} />}>
              <Route path="/user" element={<UserDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Store Owner']} />}>
              <Route path="/owner" element={<OwnerDashboard />} />
            </Route>


            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
