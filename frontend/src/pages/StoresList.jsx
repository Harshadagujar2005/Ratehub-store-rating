import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });
  const [ratingModal, setRatingModal] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(async () => {
    const params = { ...filters, sortBy: sort.field, order: sort.order };
    const { data } = await api.get('/stores', { params });
    setStores(data.stores);
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const openRatingModal = (store) => {
    setRatingModal(store);
    setSelectedRating(store.userRating || 0);
  };

  const handleSubmitRating = async () => {
    if (!selectedRating) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await api.post('/stores/rate', { store_id: ratingModal.id, rating: selectedRating });
      toast.success(ratingModal.userRating ? 'Rating updated' : 'Rating submitted');
      setRatingModal(null);
      fetchStores();
    } catch (err) {
      toast.error('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const sortIndicator = (field) => sort.field === field ? (sort.order === 'ASC' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Stores</h1>
      </div>

      <div className="filters">
        <input
          className="input-field"
          style={{ width: 200 }}
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          className="input-field"
          style={{ width: 200 }}
          placeholder="Search by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Store Name{sortIndicator('name')}</th>
              <th onClick={() => handleSort('address')}>Address{sortIndicator('address')}</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No stores found</td></tr>
            ) : stores.map((store) => (
              <tr key={store.id}>
                <td style={{ fontWeight: 500 }}>{store.name}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{store.address}</td>
                <td>
                  {store.averageRating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StarRating value={Math.round(store.averageRating)} readOnly size="1rem" />
                      <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem' }}>
                        {store.averageRating}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No ratings yet</span>
                  )}
                </td>
                <td>
                  {store.userRating ? (
                    <StarRating value={store.userRating} readOnly size="1rem" />
                  ) : (
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>—</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => openRatingModal(store)}>
                    {store.userRating ? 'Modify Rating' : 'Rate Store'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ratingModal && (
        <div className="modal-overlay" onClick={() => setRatingModal(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{ratingModal.userRating ? 'Update Rating' : 'Rate Store'}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setRatingModal(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 20 }}>{ratingModal.name}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <StarRating value={selectedRating} onChange={setSelectedRating} size="2rem" />
            </div>
            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 20 }}>
              {selectedRating ? `You selected ${selectedRating} star${selectedRating > 1 ? 's' : ''}` : 'Click a star to rate'}
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setRatingModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmitRating} disabled={submitting || !selectedRating}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StoresList;
