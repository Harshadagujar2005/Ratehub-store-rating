import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import StarRating from '../components/StarRating';

const MyStore = () => {
  const [data, setData] = useState(null);
  const [sort, setSort] = useState({ field: 'submittedAt', order: 'DESC' });

  useEffect(() => {
    api.get('/stores/my-store').then(({ data }) => setData(data));
  }, []);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const sortedRatings = data?.ratings ? [...data.ratings].sort((a, b) => {
    let valA = a[sort.field] ?? '';
    let valB = b[sort.field] ?? '';
    if (sort.field === 'submittedAt') {
      valA = new Date(valA);
      valB = new Date(valB);
    } else if (sort.field === 'name') {
      valA = a.user?.name ?? '';
      valB = b.user?.name ?? '';
    }
    if (valA < valB) return sort.order === 'ASC' ? -1 : 1;
    if (valA > valB) return sort.order === 'ASC' ? 1 : -1;
    return 0;
  }) : [];

  const sortIndicator = (field) => sort.field === field ? (sort.order === 'ASC' ? ' ↑' : ' ↓') : ' ↕';

  if (!data) {
    return (
      <Layout>
        <div className="empty-state">Loading store data...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">{data.store.name}</h1>
      </div>

      <div className="stat-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <span className="label">Average Rating</span>
          <span className="value">{data.averageRating ?? '—'}</span>
          {data.averageRating && (
            <StarRating value={Math.round(data.averageRating)} readOnly size="1.1rem" />
          )}
        </div>
        <div className="stat-card">
          <span className="label">Total Ratings</span>
          <span className="value">{data.totalRatings}</span>
        </div>
      </div>

      <div className="section-title">Ratings from Users</div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>User Name{sortIndicator('name')}</th>
              <th>Email</th>
              <th onClick={() => handleSort('rating')}>Rating{sortIndicator('rating')}</th>
              <th onClick={() => handleSort('submittedAt')}>Submitted At{sortIndicator('submittedAt')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedRatings.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No ratings submitted yet</td></tr>
            ) : sortedRatings.map((r) => (
              <tr key={r.id}>
                <td>{r.user?.name}</td>
                <td style={{ color: 'var(--muted)' }}>{r.user?.email}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating value={r.rating} readOnly size="1rem" />
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{r.rating}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  {new Date(r.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default MyStore;
