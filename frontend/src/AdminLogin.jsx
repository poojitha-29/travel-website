import React, { useState } from 'react';
import { adminLogin } from './services/supabaseAdmin';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(username, password);
      localStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-root">
      {/* ── LEFT PANEL ── */}
      <div className="al-left">
        <div className="al-left-orb al-orb-1" />
        <div className="al-left-orb al-orb-2" />
        <div className="al-left-orb al-orb-3" />

        <div className="al-left-inner">
          <div className="al-brand">
            <div className="al-brand-mark">SH</div>
            <div>
              <div className="al-brand-name">Sangeetha Holidays</div>
              <div className="al-brand-sub">Content Management</div>
            </div>
          </div>

          <div className="al-hero-text">
            <div className="al-hero-kicker">Admin Dashboard</div>
            <h1 className="al-hero-title">
              Manage your<br />
              <span className="al-hero-accent">travel empire</span><br />
              from one place.
            </h1>
            <p className="al-hero-desc">
              Packages, gallery, FAQs and videos — all in one beautifully crafted panel.
            </p>
          </div>

          <div className="al-stats">
            <div className="al-stat">
              <div className="al-stat-num">∞</div>
              <div className="al-stat-label">Destinations</div>
            </div>
            <div className="al-stat-div" />
            <div className="al-stat">
              <div className="al-stat-num">24/7</div>
              <div className="al-stat-label">Access</div>
            </div>
            <div className="al-stat-div" />
            <div className="al-stat">
              <div className="al-stat-num">Live</div>
              <div className="al-stat-label">Updates</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="al-right">
        <div className="al-form-card">
          <div className="al-form-top">
            <div className="al-form-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="al-form-title">Welcome back</h2>
            <p className="al-form-sub">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="al-form">
            <div className="al-field">
              <label className="al-label">Username</label>
              <div className="al-input-wrap">
                <span className="al-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  className="al-input"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <div className="al-input-wrap">
                <span className="al-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="al-input al-input-pass"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="al-pass-toggle"
                  onClick={() => setShowPass(s => !s)}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="al-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="al-submit" disabled={loading}>
              {loading ? (
                <span className="al-submit-loading">
                  <span className="al-spinner" />
                  Signing in…
                </span>
              ) : (
                <span className="al-submit-text">
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="al-form-footer">
            <div className="al-form-footer-dot" />
            Sangeetha Holidays · Secure Admin Area
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
