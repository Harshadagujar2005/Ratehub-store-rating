import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import StoresList from './pages/StoresList';
import MyStore from './pages/MyStore';
import ChangePassword from './pages/ChangePassword';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const redirects = { admin: '/admin', user: '/stores', store_owner: '/my-store' };
  return <Navigate to={redirects[user.role] || '/login'} replace />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f1f1f', color: '#f0f0f0', border: '1px solid #2a2a2a', fontFamily: 'DM Sans, sans-serif' },
          success: { iconTheme: { primary: '#e8ff4f', secondary: '#0d0d0d' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<RoleRedirect />} />

        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute roles={['admin']}><AdminStores /></ProtectedRoute>
        } />

        <Route path="/stores" element={
          <ProtectedRoute roles={['user', 'admin']}><StoresList /></ProtectedRoute>
        } />

        <Route path="/my-store" element={
          <ProtectedRoute roles={['store_owner']}><MyStore /></ProtectedRoute>
        } />

        <Route path="/change-password" element={
          <ProtectedRoute><ChangePassword /></ProtectedRoute>
        } />

        <Route path="/unauthorized" element={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, color: 'var(--muted)' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>Access Denied</h2>
            <p>You don't have permission to view this page.</p>
          </div>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
