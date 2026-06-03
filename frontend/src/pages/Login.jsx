import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirects = { admin: '/admin', user: '/stores', store_owner: '/my-store' };
      navigate(redirects[user.role] || '/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your RateHub account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label>Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
