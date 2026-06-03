import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="label">Total Users</span>
          <span className="value">{stats?.totalUsers ?? '—'}</span>
        </div>
        <div className="stat-card">
          <span className="label">Total Stores</span>
          <span className="value">{stats?.totalStores ?? '—'}</span>
        </div>
        <div className="stat-card">
          <span className="label">Ratings Submitted</span>
          <span className="value">{stats?.totalRatings ?? '—'}</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 8 }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          Use the sidebar to manage users and stores. You can add new records, apply filters, and view detailed profiles from the respective sections.
        </p>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
