import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!passwordRegex.test(form.newPassword))
      e.newPassword = '8–16 chars, one uppercase, one special character';
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.patch('/auth/update-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Change Password</h1>
      </div>

      <div className="card" style={{ maxWidth: 460 }}>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Current Password</label>
            <input
              className="input-field"
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
            {errors.currentPassword && <span className="error-msg">{errors.currentPassword}</span>}
          </div>

          <div className="input-group">
            <label>New Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="8–16 chars, 1 uppercase, 1 special"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
            {errors.newPassword && <span className="error-msg">{errors.newPassword}</span>}
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <input
              className="input-field"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ChangePassword;
