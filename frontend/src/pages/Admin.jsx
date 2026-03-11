import React, { useEffect, useState } from 'react';
import AdminLogin from '../AdminLogin';
import { adminList, adminInsert, adminUpdate, adminDelete } from '../services/supabaseAdmin.js';

const TABS = [
  { id: 'packages',  label: 'Packages',  icon: '🏖️',  table: 'packages' },
  { id: 'gallery',   label: 'Gallery',   icon: '🖼️',  table: 'gallery_images' },
  { id: 'faqs',      label: 'FAQs',      icon: '❓',  table: 'faqs' },
  { id: 'videos',    label: 'Videos',    icon: '🎬',  table: 'videos' },
];

const emptyForms = {
  packages: { name:'', slug:'', destination:'', description:'', duration_days:7, price:1500, currency:'INR', is_featured:false, thumbnail_url:'', poster_url:'', category:'' },
  gallery:  { title:'', image_url:'', destination:'', package_id:'' },
  faqs:     { question:'', answer:'', category:'' },
  videos:   { title:'', video_url:'', thumbnail_url:'', duration_seconds:'' },
};

const CATEGORIES = ['couple','family','friends','domestic','international'];

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('admin_logged_in') === 'true');
  const [activeTab, setActiveTab]   = useState('packages');
  const [rows, setRows]             = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm]             = useState(emptyForms.packages);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  const currentConfig = TABS.find(t => t.id === activeTab);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    async function load() {
      if (!currentConfig) return;
      setLoading(true); setError(''); setSelectedId(null);
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
    return () => { cancelled = true; };
  }, [activeTab, isLoggedIn]);

  const onEdit = row => {
    setSelectedId(row.id);
    setError(''); setSuccess('');
    if (activeTab === 'packages') {
      setForm({ name:row.name??'', slug:row.slug??'', destination:row.destination??'', description:row.description??'', duration_days:row.duration_days??7, price:row.price??1500, currency:row.currency??'INR', is_featured:!!row.is_featured, thumbnail_url:row.thumbnail_url??'', poster_url:row.poster_url??'', category:row.category??'' });
    } else if (activeTab === 'gallery') {
      setForm({ title:row.title??'', image_url:row.image_url??'', destination:row.destination??'', package_id:row.package_id??'' });
    } else if (activeTab === 'faqs') {
      setForm({ question:row.question??'', answer:row.answer??'', category:row.category??'' });
    } else if (activeTab === 'videos') {
      setForm({ title:row.title??'', video_url:row.video_url??'', thumbnail_url:row.thumbnail_url??'', duration_seconds:row.duration_seconds??'' });
    }
    // scroll form into view on mobile
    setTimeout(() => document.getElementById('admin-form-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const resetForm = () => { setSelectedId(null); setForm(emptyForms[activeTab]); setError(''); setSuccess(''); };

  const handleLogout = () => { localStorage.removeItem('admin_logged_in'); setIsLoggedIn(false); };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleCategory = cat => {
    const current = form.category ? form.category.split(',').map(c => c.trim()).filter(Boolean) : [];
    const updated = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    handleChange('category', updated.join(','));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!currentConfig) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      let payload = { ...form };
      if (activeTab === 'packages') { payload.duration_days = Number(payload.duration_days); payload.price = Number(payload.price); }
      else if (activeTab === 'gallery') { payload.package_id = payload.package_id ? Number(payload.package_id) : null; }
      else if (activeTab === 'videos') { payload.duration_seconds = payload.duration_seconds ? Number(payload.duration_seconds) : null; }

      let saved;
      if (selectedId) {
        saved = await adminUpdate(currentConfig.table, selectedId, payload);
        setRows(prev => prev.map(r => r.id === selectedId ? saved : r));
        setSuccess('Entry updated successfully!');
      } else {
        saved = await adminInsert(currentConfig.table, payload);
        setRows(prev => [saved, ...prev]);
        setSuccess('Entry created successfully!');
      }
      resetForm();
    } catch (e) {
      setError(e.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    setLoading(true); setError('');
    try {
      await adminDelete(currentConfig.table, id);
      setRows(prev => prev.filter(r => r.id !== id));
      if (selectedId === id) resetForm();
      setSuccess('Entry deleted.');
    } catch (e) {
      setError(e.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const isConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;

  // TABLE ROWS
  const renderRows = () => {
    if (loading) return <tr><td colSpan={5} className="adm-cell-empty"><span className="adm-spinner">⟳</span> Loading…</td></tr>;
    if (rows.length === 0) return <tr><td colSpan={5} className="adm-cell-empty">No entries yet. Use the form to add your first one.</td></tr>;

    if (activeTab === 'packages') return rows.map(p => (
      <tr key={p.id} className={selectedId === p.id ? 'adm-row-selected' : ''}>
        <td>
          {p.thumbnail_url && <img src={p.thumbnail_url} alt="" className="adm-thumb" />}
        </td>
        <td>
          <div className="adm-row-title">{p.name}</div>
          <div className="adm-row-sub">📍 {p.destination} · {p.duration_days} days</div>
          {p.category && <div className="adm-row-tags">{p.category.split(',').map(c => <span key={c} className="adm-tag">{c.trim()}</span>)}</div>}
        </td>
        <td><span className="adm-price">{p.currency} {p.price?.toLocaleString?.()}</span></td>
        <td>{p.is_featured ? <span className="adm-badge-featured">✦ Featured</span> : <span className="adm-badge-normal">Standard</span>}</td>
        <td className="adm-cell-actions">
          <button className="adm-btn-edit" onClick={() => onEdit(p)}>✏️ Edit</button>
          <button className="adm-btn-delete" onClick={() => handleDelete(p.id)}>🗑</button>
        </td>
      </tr>
    ));

    if (activeTab === 'gallery') return rows.map(g => (
      <tr key={g.id} className={selectedId === g.id ? 'adm-row-selected' : ''}>
        <td><img src={g.image_url} alt="" className="adm-thumb" onError={e => e.target.style.display='none'} /></td>
        <td>
          <div className="adm-row-title">{g.title}</div>
          {g.destination && <div className="adm-row-sub">📍 {g.destination}</div>}
        </td>
        <td className="adm-cell-url" title={g.image_url}>{g.image_url?.slice(0,48)}{g.image_url?.length > 48 ? '…' : ''}</td>
        <td>{g.package_id ?? '—'}</td>
        <td className="adm-cell-actions">
          <button className="adm-btn-edit" onClick={() => onEdit(g)}>✏️ Edit</button>
          <button className="adm-btn-delete" onClick={() => handleDelete(g.id)}>🗑</button>
        </td>
      </tr>
    ));

    if (activeTab === 'faqs') return rows.map(f => (
      <tr key={f.id} className={selectedId === f.id ? 'adm-row-selected' : ''}>
        <td colSpan={2}>
          <div className="adm-row-title">{f.question}</div>
          {f.category && <div className="adm-row-sub">Category: {f.category}</div>}
        </td>
        <td className="adm-cell-muted" colSpan={2}>{(f.answer||'').slice(0,90)}{f.answer?.length > 90 ? '…' : ''}</td>
        <td className="adm-cell-actions">
          <button className="adm-btn-edit" onClick={() => onEdit(f)}>✏️ Edit</button>
          <button className="adm-btn-delete" onClick={() => handleDelete(f.id)}>🗑</button>
        </td>
      </tr>
    ));

    if (activeTab === 'videos') return rows.map(v => (
      <tr key={v.id} className={selectedId === v.id ? 'adm-row-selected' : ''}>
        <td>{v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="adm-thumb" onError={e => e.target.style.display='none'} />}</td>
        <td>
          <div className="adm-row-title">{v.title}</div>
          {v.duration_seconds && <div className="adm-row-sub">⏱ {v.duration_seconds}s</div>}
        </td>
        <td className="adm-cell-url" colSpan={2} title={v.video_url}>{v.video_url?.slice(0,50)}{v.video_url?.length > 50 ? '…' : ''}</td>
        <td className="adm-cell-actions">
          <button className="adm-btn-edit" onClick={() => onEdit(v)}>✏️ Edit</button>
          <button className="adm-btn-delete" onClick={() => handleDelete(v.id)}>🗑</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="adm-shell">
      {/* SIDEBAR */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <div className="adm-sidebar-logo">SH</div>
          <div>
            <div className="adm-sidebar-name">Sangeetha</div>
            <div className="adm-sidebar-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="adm-nav">
          <div className="adm-nav-label">Content</div>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`adm-nav-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="adm-nav-icon">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && <span className="adm-nav-count">{rows.length}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <a href="/" target="_blank" className="adm-view-site">↗ View Site</a>
          <button className="adm-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="adm-main">
        {/* TOP BAR */}
        <header className="adm-topbar">
          <div>
            <h1 className="adm-topbar-title">{TABS.find(t => t.id === activeTab)?.label}</h1>
            <p className="adm-topbar-sub">{rows.length} {rows.length === 1 ? 'entry' : 'entries'} · Manage your {activeTab} content</p>
          </div>
          <button
            className="adm-add-btn"
            onClick={resetForm}
          >
            + Add New
          </button>
        </header>

        {!isConfigured && (
          <div className="adm-warning">
            <strong>⚠️ Supabase not configured.</strong> Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file and restart.
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="adm-content">
          {/* TABLE PANEL */}
          <div className="adm-table-panel">
            {(error || success) && (
              <div className={error ? 'adm-alert adm-alert-error' : 'adm-alert adm-alert-success'}>
                {error || success}
              </div>
            )}
            <div className="adm-table-wrap">
              <table className="adm-table">
                <tbody>{renderRows()}</tbody>
              </table>
            </div>
          </div>

          {/* FORM PANEL */}
          <aside className="adm-form-panel" id="admin-form-panel">
            <div className="adm-form-header">
              <h2>{selectedId ? '✏️ Edit Entry' : '✦ New Entry'}</h2>
              {selectedId && <button className="adm-form-cancel" onClick={resetForm}>✕ Cancel</button>}
            </div>

            <form onSubmit={handleSubmit} className="adm-form">
              {/* PACKAGES FORM */}
              {activeTab === 'packages' && (
                <>
                  <div className="adm-field">
                    <label>Package Name *</label>
                    <input className="adm-input" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Bali Honeymoon 7 Nights" required />
                  </div>
                  <div className="adm-field">
                    <label>Slug *</label>
                    <input className="adm-input" value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="e.g. bali-honeymoon-7-nights" required />
                  </div>
                  <div className="adm-field">
                    <label>Destination *</label>
                    <input className="adm-input" value={form.destination} onChange={e => handleChange('destination', e.target.value)} placeholder="e.g. Bali, Indonesia" required />
                  </div>
                  <div className="adm-field">
                    <label>Description</label>
                    <textarea className="adm-textarea" rows={4} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Describe the itinerary, highlights, inclusions…" />
                  </div>
                  <div className="adm-grid-2">
                    <div className="adm-field">
                      <label>Duration (days)</label>
                      <input className="adm-input" type="number" min="1" value={form.duration_days} onChange={e => handleChange('duration_days', e.target.value)} />
                    </div>
                    <div className="adm-field">
                      <label>Price</label>
                      <input className="adm-input" type="number" min="0" value={form.price} onChange={e => handleChange('price', e.target.value)} />
                    </div>
                  </div>
                  <div className="adm-field">
                    <label>Currency</label>
                    <select className="adm-input" value={form.currency} onChange={e => handleChange('currency', e.target.value)}>
                      {['INR','USD','EUR','GBP','AED'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="adm-field">
                    <label>Categories</label>
                    <div className="adm-checkboxes">
                      {CATEGORIES.map(cat => (
                        <label key={cat} className="adm-checkbox-label">
                          <input
                            type="checkbox"
                            checked={form.category?.split(',').map(c=>c.trim()).includes(cat) || false}
                            onChange={() => toggleCategory(cat)}
                          />
                          <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="adm-field">
                    <label>Thumbnail URL</label>
                    <input className="adm-input" value={form.thumbnail_url} onChange={e => handleChange('thumbnail_url', e.target.value)} placeholder="https://…" />
                    {form.thumbnail_url && <img src={form.thumbnail_url} alt="preview" className="adm-url-preview" onError={e => e.target.style.display='none'} />}
                  </div>
                  <div className="adm-field">
                    <label>Poster URL (Cloudinary)</label>
                    <input className="adm-input" value={form.poster_url} onChange={e => handleChange('poster_url', e.target.value)} placeholder="https://res.cloudinary.com/…" />
                    {form.poster_url && <img src={form.poster_url} alt="preview" className="adm-url-preview" onError={e => e.target.style.display='none'} />}
                  </div>
                  <div className="adm-field">
                    <label className="adm-checkbox-label adm-featured-check">
                      <input type="checkbox" checked={form.is_featured} onChange={e => handleChange('is_featured', e.target.checked)} />
                      <span>✦ Mark as Featured</span>
                    </label>
                  </div>
                </>
              )}

              {/* GALLERY FORM */}
              {activeTab === 'gallery' && (
                <>
                  <div className="adm-field">
                    <label>Title *</label>
                    <input className="adm-input" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Sunset at Seminyak" required />
                  </div>
                  <div className="adm-field">
                    <label>Image URL *</label>
                    <input className="adm-input" value={form.image_url} onChange={e => handleChange('image_url', e.target.value)} placeholder="https://…" required />
                    {form.image_url && <img src={form.image_url} alt="preview" className="adm-url-preview" onError={e => e.target.style.display='none'} />}
                  </div>
                  <div className="adm-field">
                    <label>Destination</label>
                    <input className="adm-input" value={form.destination} onChange={e => handleChange('destination', e.target.value)} placeholder="e.g. Bali" />
                  </div>
                  <div className="adm-field">
                    <label>Package ID (optional)</label>
                    <input className="adm-input" value={form.package_id} onChange={e => handleChange('package_id', e.target.value)} placeholder="Link to a package" />
                  </div>
                </>
              )}

              {/* FAQs FORM */}
              {activeTab === 'faqs' && (
                <>
                  <div className="adm-field">
                    <label>Question *</label>
                    <input className="adm-input" value={form.question} onChange={e => handleChange('question', e.target.value)} placeholder="e.g. Do you offer visa assistance?" required />
                  </div>
                  <div className="adm-field">
                    <label>Answer *</label>
                    <textarea className="adm-textarea" rows={5} value={form.answer} onChange={e => handleChange('answer', e.target.value)} placeholder="Write the answer…" required />
                  </div>
                  <div className="adm-field">
                    <label>Category</label>
                    <input className="adm-input" value={form.category} onChange={e => handleChange('category', e.target.value)} placeholder="e.g. Visa, Booking, General" />
                  </div>
                </>
              )}

              {/* VIDEOS FORM */}
              {activeTab === 'videos' && (
                <>
                  <div className="adm-field">
                    <label>Title *</label>
                    <input className="adm-input" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Bali Travel Guide 2024" required />
                  </div>
                  <div className="adm-field">
                    <label>Video URL *</label>
                    <input className="adm-input" value={form.video_url} onChange={e => handleChange('video_url', e.target.value)} placeholder="https://youtube.com/…" required />
                  </div>
                  <div className="adm-field">
                    <label>Thumbnail URL</label>
                    <input className="adm-input" value={form.thumbnail_url} onChange={e => handleChange('thumbnail_url', e.target.value)} placeholder="https://…" />
                    {form.thumbnail_url && <img src={form.thumbnail_url} alt="preview" className="adm-url-preview" onError={e => e.target.style.display='none'} />}
                  </div>
                  <div className="adm-field">
                    <label>Duration (seconds)</label>
                    <input className="adm-input" type="number" min="0" value={form.duration_seconds} onChange={e => handleChange('duration_seconds', e.target.value)} placeholder="e.g. 180" />
                  </div>
                </>
              )}

              <div className="adm-form-footer">
                <button type="submit" className="adm-save-btn" disabled={saving || !isConfigured}>
                  {saving ? '⟳ Saving…' : selectedId ? '✓ Save Changes' : '+ Create Entry'}
                </button>
                {selectedId && (
                  <button type="button" className="adm-cancel-btn" onClick={resetForm} disabled={saving}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Admin;