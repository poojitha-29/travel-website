import React, { useState } from 'react';
import { adminLogin } from './services/supabaseAdmin';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("LOGIN CLICKED");
    setError('');

    try {
      await adminLogin(username, password);
      localStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <section className="section" style={{ maxWidth: 400, margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ marginBottom: 20 }}>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%' }}>
            Login
          </button>

          {error && (
            <p style={{ color: 'red', marginTop: 10 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;