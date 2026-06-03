import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const INITIAL_FORM = { name: '', email: '', password: '', address: '', role: 'user' };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });
  const [showModal, setShowModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    const params = { ...filters, sortBy: sort.field, order: sort.order };
    const { data } = await api.get('/admin/users', { params });
    setUsers(data.users);
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

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
    if (!passwordRegex.test(form.password)) e.password = '8–16 chars, 1 uppercase, 1 special';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created');
      setShowModal(false);
      setForm(INITIAL_FORM);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const openDetail = async (id) => {
    const { data } = await api.get(`/admin/users/${id}`);
    setDetailUser(data);
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      {/* Filters */}
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
        <select
          className="input-field"
          style={{ width: 140 }}
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {[['name', 'Name'], ['email', 'Email'], ['address', 'Address'], ['role', 'Role']].map(([f, l]) => (
                <th key={f} onClick={() => handleSort(f)}>{l}{sortIndicator(f)}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                <td><span className={`badge badge-${u.role}`}>{u.role.replace('_', ' ')}</span></td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => openDetail(u.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add New User</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="modal-form" onSubmit={handleCreate}>
              <div className="input-group">
                <label>Full Name <span style={{ color: 'var(--muted)' }}>(20–60 chars)</span></label>
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
                <label>Password</label>
                <input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                {formErrors.password && <span className="error-msg">{formErrors.password}</span>}
              </div>
              <div className="input-group">
                <label>Role</label>
                <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {detailUser && (
        <div className="modal-overlay" onClick={() => setDetailUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">User Details</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetailUser(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Name', detailUser.user.name], ['Email', detailUser.user.email], ['Address', detailUser.user.address]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>{l}</div>
                  <div>{v}</div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>Role</div>
                <span className={`badge badge-${detailUser.user.role}`}>{detailUser.user.role.replace('_', ' ')}</span>
              </div>
              {detailUser.user.role === 'store_owner' && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>Average Store Rating</div>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    {detailUser.averageRating ? `${detailUser.averageRating} / 5` : 'No ratings yet'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminUsers;
