import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';

const INITIAL_FORM = { name: '', email: '', address: '', owner_id: '' };

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchStores = useCallback(async () => {
    const params = { ...filters, sortBy: sort.field, order: sort.order };
    const { data } = await api.get('/admin/stores', { params });
    setStores(data.stores);
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'store_owner' } })
      .then(({ data }) => setStoreOwners(data.users));
  }, []);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const sortIndicator = (field) => {
    if (sort.field !== field) return ' ↕';
    return sort.order === 'ASC' ? ' ↑' : ' ↓';
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 20 || form.name.length > 60)
      e.name = 'Name must be 20–60 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.address || form.address.length > 400) e.address = 'Address required (max 400 chars)';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/admin/stores', form);
      toast.success('Store created');
      setShowModal(false);
      setForm(INITIAL_FORM);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Stores</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Store</button>
      </div>

      <div className="filters">
        {['name', 'email', 'address'].map((f) => (
          <input
            key={f}
            className="input-field"
            style={{ width: 180 }}
            placeholder={`Filter by ${f}`}
            value={filters[f]}
            onChange={(e) => setFilters({ ...filters, [f]: e.target.value })}
          />
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {[['name', 'Name'], ['email', 'Email'], ['address', 'Address']].map(([f, l]) => (
                <th key={f} onClick={() => handleSort(f)}>{l}{sortIndicator(f)}</th>
              ))}
              <th>Rating</th>
              <th>Total Ratings</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No stores found</td></tr>
            ) : stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                <td>
                  {s.averageRating
                    ? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{s.averageRating} <StarRating value={Math.round(s.averageRating)} readOnly size="0.9rem" /></span>
                    : <span style={{ color: 'var(--muted)' }}>No ratings</span>
                  }
                </td>
                <td>{s.totalRatings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add New Store</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="modal-form" onSubmit={handleCreate}>
              <div className="input-group">
                <label>Store Name <span style={{ color: 'var(--muted)' }}>(20–60 chars)</span></label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {formErrors.name && <span className="error-msg">{formErrors.name}</span>}
              </div>
              <div className="input-group">
                <label>Email</label>
                <input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {formErrors.email && <span className="error-msg">{formErrors.email}</span>}
              </div>
              <div className="input-group">
                <label>Address</label>
                <textarea className="input-field" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                {formErrors.address && <span className="error-msg">{formErrors.address}</span>}
              </div>
              <div className="input-group">
                <label>Store Owner <span style={{ color: 'var(--muted)' }}>(optional)</span></label>
                <select className="input-field" value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })}>
                  <option value="">No owner assigned</option>
                  {storeOwners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Store'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminStores;
