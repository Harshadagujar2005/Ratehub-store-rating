import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 20 || form.name.length > 60)
      e.name = 'Name must be 20–60 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.address || form.address.length > 400)
      e.address = 'Address is required (max 400 characters)';
    if (!passwordRegex.test(form.password))
      e.password = 'Password: 8–16 chars, one uppercase, one special character';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      navigate('/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join RateHub and start rating stores</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name <span style={{ color: 'var(--muted)' }}>(20–60 chars)</span></label>
            <input
              className="input-field"
              placeholder="e.g. Alexandra Jane Thompson"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="input-group">
            <label>Email address</label>
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Address</label>
            <textarea
              className="input-field"
              placeholder="Your full address"
              rows={3}
              style={{ resize: 'vertical' }}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            {errors.address && <span className="error-msg">{errors.address}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 special"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
