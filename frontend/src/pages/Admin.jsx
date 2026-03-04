import React, { useEffect, useState } from 'react';
import AdminLogin from "../AdminLogin";
import {
  adminList,
  adminInsert,
  adminUpdate,
  adminDelete
} from '../services/supabaseAdmin.js';

const TABS = [
  { id: 'packages', label: 'Packages', table: 'packages' },
  { id: 'gallery', label: 'Gallery', table: 'gallery_images' },
  { id: 'faqs', label: 'FAQs', table: 'faqs' },
  { id: 'videos', label: 'Videos', table: 'videos' }
];

const emptyForms = {
  packages: {
    name: '',
    slug: '',
    destination: '',
    description: '',
    duration_days: 7,
    price: 1500,
    currency: 'INR',
    is_featured: false,
    thumbnail_url: '',
    poster_url: '',
    category: ''
  },
  gallery: {
    title: '',
    image_url: '',
    destination: '',
    package_id: ''
  },
  faqs: {
    question: '',
    answer: '',
    category: ''
  },
  videos: {
    title: '',
    video_url: '',
    thumbnail_url: '',
    duration_seconds: ''
  }
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('admin_logged_in') === 'true'
  );

 
  const [activeTab, setActiveTab] = useState('packages');
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForms.packages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentConfig = TABS.find((t) => t.id === activeTab);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!currentConfig) return;
      setLoading(true);
      setError('');
      setSelectedId(null);
      setForm(emptyForms[activeTab]);
      try {
        const data = await adminList(currentConfig.table);
        if (!cancelled) setRows(data || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeTab, currentConfig]);

  const onEdit = (row) => {
    setSelectedId(row.id);
    if (activeTab === 'packages') {
      setForm({
        name: row.name ?? '',
        slug: row.slug ?? '',
        destination: row.destination ?? '',
        description: row.description ?? '',
        duration_days: row.duration_days ?? 7,
        price: row.price ?? 1500,
        currency: row.currency ?? 'USD',
        is_featured: !!row.is_featured,
        thumbnail_url: row.thumbnail_url ?? '',
        poster_url: row.poster_url ?? '',
        category: row.category ?? ''

      });
    } else if (activeTab === 'gallery') {
      setForm({
        title: row.title ?? '',
        image_url: row.image_url ?? '',
        destination: row.destination ?? '',
        package_id: row.package_id ?? ''
      });
    } else if (activeTab === 'faqs') {
      setForm({
        question: row.question ?? '',
        answer: row.answer ?? '',
        category: row.category ?? ''
      });
    } else if (activeTab === 'videos') {
      setForm({
        title: row.title ?? '',
        video_url: row.video_url ?? '',
        thumbnail_url: row.thumbnail_url ?? '',
        duration_seconds: row.duration_seconds ?? ''
      });
    }
  };

  const resetForm = () => {
    setSelectedId(null);
    setForm(emptyForms[activeTab]);
    setError('');
  };
  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    setIsLoggedIn(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentConfig) return;
    setLoading(true);
    setError('');

    try {
      let payload = { ...form };
      if (activeTab === 'packages') {
        payload.duration_days = Number(payload.duration_days);
        payload.price = Number(payload.price);
      } else if (activeTab === 'gallery') {
        payload.package_id = payload.package_id ? Number(payload.package_id) : null;
      } else if (activeTab === 'videos') {
        payload.duration_seconds = payload.duration_seconds
          ? Number(payload.duration_seconds)
          : null;
      }

      let saved;
      if (selectedId) {
        saved = await adminUpdate(currentConfig.table, selectedId, payload);
        setRows((prev) => prev.map((r) => (r.id === selectedId ? saved : r)));
      } else {
        saved = await adminInsert(currentConfig.table, payload);
        setRows((prev) => [saved, ...prev]);
      }
      resetForm();
    } catch (e) {
      setError(e.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!currentConfig) return;
    const confirmed = window.confirm('Delete this row? This cannot be undone.');
    if (!confirmed) return;
    setLoading(true);
    setError('');
    try {
      await adminDelete(currentConfig.table, id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (selectedId === id) resetForm();
    } catch (e) {
      setError(e.message || 'Failed to delete row');
    } finally {
      setLoading(false);
    }
  };

  const renderRows = () => {
    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="admin-cell-empty">
            No rows yet — use the form on the right to add your first one.
          </td>
        </tr>
      );
    }

    if (activeTab === 'packages') {
      return rows.map((p) => (
        <tr key={p.id}>
          <td className="admin-cell-main">
            <div className="admin-title">{p.name}</div>
            <div className="admin-sub">
              {p.destination} · {p.duration_days} days
            </div>
          </td>
          <td>{p.price?.toLocaleString?.() ?? p.price}</td>
          <td>{p.is_featured ? 'Featured' : ''}</td>
          <td className="admin-cell-actions">
            <button type="button" className="btn secondary admin-btn" onClick={() => onEdit(p)}>
              Edit
            </button>
            <button
              type="button"
              className="btn admin-btn-danger"
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ));
    }

    if (activeTab === 'gallery') {
      return rows.map((g) => (
        <tr key={g.id}>
          <td className="admin-cell-main">
            <div className="admin-title">{g.title}</div>
            <div className="admin-sub">{g.destination || '—'}</div>
          </td>
          <td className="admin-cell-url">{g.image_url}</td>
          <td>{g.package_id ?? '—'}</td>
          <td className="admin-cell-actions">
            <button type="button" className="btn secondary admin-btn" onClick={() => onEdit(g)}>
              Edit
            </button>
            <button
              type="button"
              className="btn admin-btn-danger"
              onClick={() => handleDelete(g.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ));
    }

    if (activeTab === 'faqs') {
      return rows.map((f) => (
        <tr key={f.id}>
          <td className="admin-cell-main">
            <div className="admin-title">{f.question}</div>
            <div className="admin-sub">{f.category || '—'}</div>
          </td>
          <td className="admin-cell-muted">{(f.answer || '').slice(0, 80)}…</td>
          <td className="admin-cell-actions">
            <button type="button" className="btn secondary admin-btn" onClick={() => onEdit(f)}>
              Edit
            </button>
            <button
              type="button"
              className="btn admin-btn-danger"
              onClick={() => handleDelete(f.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ));
    }

    if (activeTab === 'videos') {
      return rows.map((v) => (
        <tr key={v.id}>
          <td className="admin-cell-main">
            <div className="admin-title">{v.title}</div>
            <div className="admin-sub">{v.duration_seconds ? `${v.duration_seconds}s` : '—'}</div>
          </td>
          <td className="admin-cell-url">{v.video_url}</td>
          <td className="admin-cell-actions">
            <button type="button" className="btn secondary admin-btn" onClick={() => onEdit(v)}>
              Edit
            </button>
            <button
              type="button"
              className="btn admin-btn-danger"
              onClick={() => handleDelete(v.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ));
    }

    return null;
  };

  const isConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }
  return (
    <section className="section">
      <div className="section-header admin-header">
      <button
  onClick={handleLogout}
  className="btn secondary"
>
  Logout
</button>
        <div>
          <h1 className="section-title">Admin content studio</h1>
          <p className="section-subtitle">
            Create, edit and remove the pieces that appear across the public site.
          </p>
        </div>
        <div className="chip-row">
          <span className="chip">Supabase-backed</span>
          <span className="chip">No auth (demo)</span>
        </div>
      </div>

      {!isConfigured && (
        <div className="card admin-warning">
          <strong>Supabase env vars missing.</strong> Create a <code>.env</code> file in the
          <code>frontend</code> folder with:
          <pre className="admin-pre">
VITE_SUPABASE_URL=&lt;your-supabase-url&gt;
VITE_SUPABASE_ANON_KEY=&lt;your-anon-key&gt;
          </pre>
          Then restart <code>npm run dev</code>.
        </div>
      )}

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab ${activeTab === tab.id ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-layout">
        <div className="card admin-table-card">
          <div className="admin-table-header">
            <h2>{TABS.find((t) => t.id === activeTab)?.label}</h2>
            {loading && <span className="admin-pill">Saving…</span>}
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <tbody>{renderRows()}</tbody>
            </table>
          </div>
        </div>

        <aside className="card admin-form-card">
          <h2>{selectedId ? 'Edit entry' : 'Add new entry'}</h2>
          {error && <p className="admin-error">{error}</p>}
          <form onSubmit={handleSubmit} className="admin-form">
            {activeTab === 'packages' && (
              <>
                <div className="form-row">
                  <label>Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Slug</label>
                  <input
                    className="input"
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Destination</label>
                  <input
                    className="input"
                    value={form.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Description</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
                <div className="admin-form-grid">
                  <div className="form-row">
                    <label>Duration (days)</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={form.duration_days}
                      onChange={(e) => handleChange('duration_days', e.target.value)}
                    />
                  </div>
                  {/* CATEGORY MULTI SELECT */}
<div className="form-row">
  <label>Category</label>
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
    {['couple', 'family', 'friends', 'solo'].map((cat) => (
      <label key={cat} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={
            form.category
              ? form.category.split(',').map((c) => c.trim()).includes(cat)
              : false
          }
          onChange={() => {
            const current = form.category
              ? form.category.split(',').map((c) => c.trim())
              : [];

            const updated = current.includes(cat)
              ? current.filter((c) => c !== cat)
              : [...current, cat];

            handleChange('category', updated.join(','));
          }}
        />
        {cat}
      </label>
    ))}
  </div>
</div>

                  <div className="form-row">
                    <label>Price</label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <label>Currency</label>
                    <input
                      className="input"
                      value={form.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <label>Thumbnail URL</label>
                  <input
                    className="input"
                    value={form.thumbnail_url}
                    onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                  />
                </div>
                <div className="form-row">
  <label>Trip Poster URL (Cloudinary)</label>
  <input
    className="input"
    value={form.poster_url}
    onChange={(e) => handleChange('poster_url', e.target.value)}
    placeholder="https://res.cloudinary.com/your-poster.jpg"
  />
</div>
                <div className="form-row">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => handleChange('is_featured', e.target.checked)}
                    />
                    Mark as featured
                  </label>
                </div>
              </>
            )}

            {activeTab === 'gallery' && (
              <>
                <div className="form-row">
                  <label>Title</label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Image URL</label>
                  <input
                    className="input"
                    value={form.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Destination (optional)</label>
                  <input
                    className="input"
                    value={form.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <label>Package ID (optional)</label>
                  <input
                    className="input"
                    value={form.package_id}
                    onChange={(e) => handleChange('package_id', e.target.value)}
                  />
                </div>
              </>
            )}

            {activeTab === 'faqs' && (
              <>
                <div className="form-row">
                  <label>Question</label>
                  <input
                    className="input"
                    value={form.question}
                    onChange={(e) => handleChange('question', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Answer</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={form.answer}
                    onChange={(e) => handleChange('answer', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Category (optional)</label>
                  <input
                    className="input"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  />
                </div>
              </>
            )}

            {activeTab === 'videos' && (
              <>
                <div className="form-row">
                  <label>Title</label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Video URL</label>
                  <input
                    className="input"
                    value={form.video_url}
                    onChange={(e) => handleChange('video_url', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Thumbnail URL (optional)</label>
                  <input
                    className="input"
                    value={form.thumbnail_url}
                    onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <label>Duration (seconds, optional)</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={form.duration_seconds}
                    onChange={(e) => handleChange('duration_seconds', e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="admin-form-actions">
              <button type="submit" className="btn" disabled={loading || !isConfigured}>
                {selectedId ? 'Save changes' : 'Create'}
              </button>
              {selectedId && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <p className="admin-hint">
            This panel is intentionally simple. For production, protect it behind authentication and
            tighter Supabase policies.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default Admin;
