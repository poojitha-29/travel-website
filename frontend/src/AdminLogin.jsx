import React, { useState } from 'react';
import { adminLogin } from './services/supabaseAdmin';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(username, password);
      localStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-left">
        <div className="admin-login-brand">
          <div className="admin-login-logo">SH</div>
          <div>
            <div className="admin-login-brand-name">Sangeetha Holidays</div>
            <div className="admin-login-brand-sub">Admin Dashboard</div>
          </div>
        </div>
        <div className="admin-login-quote">
          <p>"The world is a book, and those who do not travel read only one page."</p>
          <span>— Saint Augustine</span>
        </div>
      </div>

      <div className="admin-login-right">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">🔐</div>
            <h2>Welcome back</h2>
            <p>Sign in to manage your travel content</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-field">
              <label>Username</label>
              <input
                className="admin-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
            <div className="admin-field">
              <label>Password</label>
              <input
                type="password"
                className="admin-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="admin-login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="admin-login-footer">
            Sangeetha Holidays · Secure Admin Area
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
