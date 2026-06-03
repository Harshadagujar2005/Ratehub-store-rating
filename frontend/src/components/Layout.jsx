import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: '▦',
  users: '👤',
  stores: '🏪',
  ratings: '★',
  password: '🔑',
  logout: '→',
};

const navByRole = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: icons.dashboard },
    { label: 'Users', path: '/admin/users', icon: icons.users },
    { label: 'Stores', path: '/admin/stores', icon: icons.stores },
  ],
  user: [
    { label: 'Stores', path: '/stores', icon: icons.stores },
    { label: 'Change Password', path: '/change-password', icon: icons.password },
  ],
  store_owner: [
    { label: 'My Store', path: '/my-store', icon: icons.ratings },
    { label: 'Change Password', path: '/change-password', icon: icons.password },
  ],
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = navByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Rate<span>Hub</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', padding: '0 12px 10px' }}>
            {user?.name?.split(' ')[0]}
            <span className={`badge badge-${user?.role}`} style={{ marginLeft: 8 }}>
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
          <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <span>{icons.logout}</span>
            Logout
          </div>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
