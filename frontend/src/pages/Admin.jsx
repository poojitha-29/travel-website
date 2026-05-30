import React, { useEffect, useState } from 'react';
import AdminLogin from '../AdminLogin';
import { adminList, adminInsert, adminUpdate, adminDelete } from '../services/supabaseAdmin.js';
import ImageUpload from '../components/ImageUpload';

const TABS = [
  { id: 'packages', label: 'Packages', table: 'packages',      desc: 'Travel packages & tours',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 12 19.79 19.79 0 0 1 1.77 3.35 2 2 0 0 1 3.74 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 15.42" />
      </svg>
    )
  },
  { id: 'gallery',  label: 'Gallery',  table: 'gallery_images', desc: 'Photo gallery',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    )
  },
  { id: 'faqs',     label: 'FAQs',     table: 'faqs',           desc: 'Frequently asked questions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  },
  { id: 'videos',   label: 'Videos',   table: 'videos',         desc: 'Video content',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    )
  },
];

const EMPTY = {
  packages: { name:'', slug:'', destination:'', description:'', duration_days:7, price:1500, currency:'INR', is_featured:false, thumbnail_url:'', poster_url:'', category:'' },
  gallery:  { title:'', image_url:'', destination:'', package_id:'' },
  faqs:     { question:'', answer:'', category:'' },
  videos:   { title:'', video_url:'', thumbnail_url:'', duration_seconds:'' },
};

const CATEGORIES = ['couple','family','friends','domestic','international'];
const CURRENCIES  = ['INR','USD','EUR','GBP','AED'];

/** Defined at module scope so React sees a stable component type — avoids remounting inputs on every parent render (focus loss + scroll jump). */
function AdminFormFields({ activeTab, form, set, activeCats, toggleCat }) {
  return (
    <>
      {activeTab === 'packages' && (<>
        <div className="adm-field">
          <label>Package Name <span className="adm-req">*</span></label>
          <input className="adm-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Bali Honeymoon 7 Nights" required />
        </div>
        <div className="adm-field">
          <label>URL Slug <span className="adm-req">*</span></label>
          <input className="adm-input" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. bali-honeymoon-7-nights" required />
        </div>
        <div className="adm-field">
          <label>Destination <span className="adm-req">*</span></label>
          <input className="adm-input" value={form.destination} onChange={e => set('destination', e.target.value)} placeholder="e.g. Bali, Indonesia" required />
        </div>
        <div className="adm-field">
          <label>Description</label>
          <textarea className="adm-textarea" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe highlights, itinerary, inclusions…" />
        </div>
        <div className="adm-row2">
          <div className="adm-field">
            <label>Duration (days)</label>
            <input className="adm-input" type="number" min="1" value={form.duration_days} onChange={e => set('duration_days', e.target.value)} />
          </div>
          <div className="adm-field">
            <label>Price</label>
            <input className="adm-input" type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
        </div>
        <div className="adm-field">
          <label>Currency</label>
          <select className="adm-input" value={form.currency} onChange={e => set('currency', e.target.value)}>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="adm-field">
          <label>Categories</label>
          <div className="adm-chip-row">
            {CATEGORIES.map(cat => (
              <button key={cat} type="button"
                className={`adm-chip${activeCats.includes(cat) ? ' adm-chip-on' : ''}`}
                onClick={() => toggleCat(cat)}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="adm-divider" />
        <ImageUpload label="Thumbnail" value={form.thumbnail_url} onChange={url => set('thumbnail_url', url)} allowUrl />
        <ImageUpload label="Hero Poster" value={form.poster_url} onChange={url => set('poster_url', url)} allowUrl={false} />
        <label className="adm-toggle-row">
          <div className={`adm-toggle${form.is_featured ? ' adm-toggle-on' : ''}`}
            onClick={() => set('is_featured', !form.is_featured)} role="switch" aria-checked={form.is_featured}>
            <div className="adm-toggle-thumb" />
          </div>
          <span>Mark as Featured Package</span>
        </label>
      </>)}

      {activeTab === 'gallery' && (<>
        <div className="adm-field">
          <label>Title <span className="adm-req">*</span></label>
          <input className="adm-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Sunset at Seminyak" required />
        </div>
        <ImageUpload label="Gallery Image" value={form.image_url} onChange={url => set('image_url', url)} allowUrl />
        <div className="adm-field">
          <label>Destination</label>
          <input className="adm-input" value={form.destination} onChange={e => set('destination', e.target.value)} placeholder="e.g. Bali" />
        </div>
        <div className="adm-field">
          <label>Package ID <span className="adm-opt">(optional)</span></label>
          <input className="adm-input" value={form.package_id} onChange={e => set('package_id', e.target.value)} placeholder="Link to a package" />
        </div>
      </>)}

      {activeTab === 'faqs' && (<>
        <div className="adm-field">
          <label>Question <span className="adm-req">*</span></label>
          <input className="adm-input" value={form.question} onChange={e => set('question', e.target.value)} placeholder="e.g. Do you offer visa assistance?" required />
        </div>
        <div className="adm-field">
          <label>Answer <span className="adm-req">*</span></label>
          <textarea className="adm-textarea" rows={6} value={form.answer} onChange={e => set('answer', e.target.value)} placeholder="Write a clear, helpful answer…" required />
        </div>
        <div className="adm-field">
          <label>Category <span className="adm-opt">(optional)</span></label>
          <input className="adm-input" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Visa, Booking, General" />
        </div>
      </>)}

      {activeTab === 'videos' && (<>
        <div className="adm-field">
          <label>Title <span className="adm-req">*</span></label>
          <input className="adm-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Bali Travel Guide 2024" required />
        </div>
        <div className="adm-field">
          <label>Video URL <span className="adm-req">*</span></label>
          <input className="adm-input" value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://youtube.com/…" required />
        </div>
        <ImageUpload label="Thumbnail" value={form.thumbnail_url} onChange={url => set('thumbnail_url', url)} allowUrl />
        <div className="adm-field">
          <label>Duration <span className="adm-opt">(seconds)</span></label>
          <input className="adm-input" type="number" min="0" value={form.duration_seconds} onChange={e => set('duration_seconds', e.target.value)} placeholder="e.g. 180" />
        </div>
      </>)}
    </>
  );
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('admin_logged_in') === 'true');
  const [activeTab,  setActiveTab]  = useState('packages');
  const [rows,       setRows]       = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form,       setForm]       = useState(EMPTY.packages);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [sideOpen,   setSideOpen]   = useState(false);

  const tab = TABS.find(t => t.id === activeTab);

  useEffect(() => {
    if (!isLoggedIn || !tab) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError(''); setSelectedId(null); setForm(EMPTY[activeTab]);
      try {
        const data = await adminList(tab.table);
        if (!cancelled) setRows(data || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 3500);
    return () => clearTimeout(t);
  }, [success]);

  const onEdit = (row) => {
    setSelectedId(row.id); setError(''); setSuccess('');
    if (activeTab === 'packages') {
      setForm({ name:row.name??'', slug:row.slug??'', destination:row.destination??'', description:row.description??'', duration_days:row.duration_days??7, price:row.price??1500, currency:row.currency??'INR', is_featured:!!row.is_featured, thumbnail_url:row.thumbnail_url??'', poster_url:row.poster_url??'', category:row.category??'' });
    } else if (activeTab === 'gallery') {
      setForm({ title:row.title??'', image_url:row.image_url??'', destination:row.destination??'', package_id:row.package_id??'' });
    } else if (activeTab === 'faqs') {
      setForm({ question:row.question??'', answer:row.answer??'', category:row.category??'' });
    } else if (activeTab === 'videos') {
      setForm({ title:row.title??'', video_url:row.video_url??'', thumbnail_url:row.thumbnail_url??'', duration_seconds:row.duration_seconds??'' });
    }
    setSideOpen(true);
    setTimeout(() => document.getElementById('adm-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const resetForm = () => {
    setSelectedId(null); setForm(EMPTY[activeTab]); setError(''); setSuccess(''); setSideOpen(false);
  };

  const openNew = () => {
    setSelectedId(null); setForm(EMPTY[activeTab]); setError(''); setSuccess(''); setSideOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in'); setIsLoggedIn(false);
  };

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleCat = (cat) => {
    const cats = form.category ? form.category.split(',').map(c => c.trim()).filter(Boolean) : [];
    const next = cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat];
    set('category', next.join(','));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tab) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      const payload = { ...form };
      if (activeTab === 'packages') {
        payload.duration_days = Number(payload.duration_days);
        payload.price         = Number(payload.price);
      } else if (activeTab === 'gallery') {
        payload.package_id = payload.package_id ? Number(payload.package_id) : null;
      } else if (activeTab === 'videos') {
        payload.duration_seconds = payload.duration_seconds ? Number(payload.duration_seconds) : null;
      }
      let saved;
      if (selectedId) {
        saved = await adminUpdate(tab.table, selectedId, payload);
        setRows(prev => prev.map(r => r.id === selectedId ? saved : r));
        setSuccess('Updated successfully!');
      } else {
        saved = await adminInsert(tab.table, payload);
        setRows(prev => [saved, ...prev]);
        setSuccess('Created successfully!');
      }
      resetForm();
    } catch (e) {
      setError(e.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    setLoading(true); setError('');
    try {
      await adminDelete(tab.table, id);
      setRows(prev => prev.filter(r => r.id !== id));
      if (selectedId === id) resetForm();
      setSuccess('Deleted successfully.');
    } catch (e) {
      setError(e.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const isConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  const activeCats   = form.category ? form.category.split(',').map(c => c.trim()).filter(Boolean) : [];

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;

  // ── SKELETONS ──────────────────────────────────────────────────────────────
  const Skeletons = () => Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="adm-sk-row">
      <td><div className="adm-sk adm-sk-img" /></td>
      <td>
        <div className="adm-sk adm-sk-line" style={{ width: `${55 + i * 7}%`, marginBottom: 6 }} />
        <div className="adm-sk adm-sk-line" style={{ width: '40%', height: 10 }} />
      </td>
      <td><div className="adm-sk adm-sk-line" style={{ width: '60%' }} /></td>
      <td><div className="adm-sk adm-sk-pill" /></td>
      <td><div className="adm-sk adm-sk-btns" /></td>
    </tr>
  ));

  // ── MAIN RENDER ────────────────────────────────────────────────────────────
  return (
    <div className="adm-root">

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar">
        <div className="adm-sb-logo">
          <div className="adm-sb-logomark">SH</div>
          <div className="adm-sb-logotype">
            <span className="adm-sb-logotype-name">Sangeetha</span>
            <span className="adm-sb-logotype-sub">Admin</span>
          </div>
        </div>

        <div className="adm-sb-section-label">Navigation</div>

        <nav className="adm-sb-nav">
          {TABS.map(t => (
            <button key={t.id}
              className={`adm-sb-link${activeTab === t.id ? ' adm-sb-link-active' : ''}`}
              onClick={() => { setActiveTab(t.id); setSideOpen(false); }}>
              <span className="adm-sb-link-icon">{t.icon}</span>
              <span className="adm-sb-link-label">{t.label}</span>
              {activeTab === t.id && (
                <span className="adm-sb-badge">{rows.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="adm-sb-divider" />

        <div className="adm-sb-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-sb-ext">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Site
          </a>
          <button className="adm-sb-logout" onClick={handleLogout}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <div className="adm-content">

        {/* Top bar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <h1 className="adm-topbar-title">{tab?.label}</h1>
            <span className="adm-topbar-count">{rows.length} {rows.length === 1 ? 'record' : 'records'}</span>
          </div>
          <button className="adm-btn-primary" onClick={openNew}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New {tab?.label.replace(/s$/, '')}
          </button>
        </header>

        {/* Alerts */}
        {!isConfigured && (
          <div className="adm-alert adm-alert-warn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Supabase not configured — add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code>
          </div>
        )}

        {(error || success) && (
          <div className={`adm-alert ${error ? 'adm-alert-err' : 'adm-alert-ok'}`}>
            {error ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {error || success}
          </div>
        )}

        {/* Main grid */}
        <div className="adm-grid">

          {/* Table panel */}
          <div className="adm-table-panel">
            <div className="adm-table-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    {activeTab === 'packages' && (<><th>Image</th><th>Package</th><th>Price</th><th>Status</th><th>Actions</th></>)}
                    {activeTab === 'gallery'  && (<><th>Image</th><th>Title</th><th>Destination</th><th>Pkg ID</th><th>Actions</th></>)}
                    {activeTab === 'faqs'     && (<><th colSpan={2}>Question</th><th colSpan={2}>Preview</th><th>Actions</th></>)}
                    {activeTab === 'videos'   && (<><th>Thumb</th><th>Title</th><th colSpan={2}>URL</th><th>Actions</th></>)}
                  </tr>
                </thead>
                <tbody>
                  {loading ? <Skeletons /> : !rows.length ? (
                    <tr><td colSpan={5}>
                      <div className="adm-empty">
                        <div className="adm-empty-ring">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                          </svg>
                        </div>
                        <p className="adm-empty-title">No {tab?.label.toLowerCase()} yet</p>
                        <p className="adm-empty-sub">Click <strong>New {tab?.label.replace(/s$/, '')}</strong> to add your first entry</p>
                      </div>
                    </td></tr>
                  ) : activeTab === 'packages' ? rows.map(p => (
                    <tr key={p.id} className={`adm-tr${selectedId === p.id ? ' adm-tr-sel' : ''}`} onClick={() => onEdit(p)}>
                      <td>
                        {p.thumbnail_url
                          ? <img src={p.thumbnail_url} alt="" className="adm-thumb" onError={e => { e.target.style.display='none'; }} />
                          : <div className="adm-thumb-ph">✈</div>}
                      </td>
                      <td>
                        <div className="adm-td-name">{p.name}</div>
                        <div className="adm-td-sub">📍 {p.destination} · {p.duration_days} days</div>
                        {p.category && (
                          <div className="adm-td-chips">
                            {p.category.split(',').filter(Boolean).map(c => <span key={c} className="adm-td-chip">{c.trim()}</span>)}
                          </div>
                        )}
                      </td>
                      <td><span className="adm-td-price">{p.currency} {p.price?.toLocaleString?.()}</span></td>
                      <td>
                        {p.is_featured
                          ? <span className="adm-pill adm-pill-gold">✦ Featured</span>
                          : <span className="adm-pill adm-pill-grey">Standard</span>}
                      </td>
                      <td className="adm-td-actions" onClick={e => e.stopPropagation()}>
                        <button className="adm-action-edit" onClick={() => onEdit(p)}>Edit</button>
                        <button className="adm-action-del" onClick={() => handleDelete(p.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )) : activeTab === 'gallery' ? rows.map(g => (
                    <tr key={g.id} className={`adm-tr${selectedId === g.id ? ' adm-tr-sel' : ''}`} onClick={() => onEdit(g)}>
                      <td><img src={g.image_url} alt="" className="adm-thumb" onError={e => { e.target.style.display='none'; }} /></td>
                      <td><div className="adm-td-name">{g.title}</div></td>
                      <td><div className="adm-td-sub">{g.destination || '—'}</div></td>
                      <td><span className="adm-pill adm-pill-grey">{g.package_id ?? '—'}</span></td>
                      <td className="adm-td-actions" onClick={e => e.stopPropagation()}>
                        <button className="adm-action-edit" onClick={() => onEdit(g)}>Edit</button>
                        <button className="adm-action-del" onClick={() => handleDelete(g.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )) : activeTab === 'faqs' ? rows.map(f => (
                    <tr key={f.id} className={`adm-tr${selectedId === f.id ? ' adm-tr-sel' : ''}`} onClick={() => onEdit(f)}>
                      <td colSpan={2}>
                        <div className="adm-td-name">{f.question}</div>
                        {f.category && <div className="adm-td-sub">{f.category}</div>}
                      </td>
                      <td colSpan={2}><div className="adm-td-preview">{(f.answer||'').slice(0,80)}{f.answer?.length > 80 ? '…' : ''}</div></td>
                      <td className="adm-td-actions" onClick={e => e.stopPropagation()}>
                        <button className="adm-action-edit" onClick={() => onEdit(f)}>Edit</button>
                        <button className="adm-action-del" onClick={() => handleDelete(f.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )) : rows.map(v => (
                    <tr key={v.id} className={`adm-tr${selectedId === v.id ? ' adm-tr-sel' : ''}`} onClick={() => onEdit(v)}>
                      <td>{v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="adm-thumb" onError={e => { e.target.style.display='none'; }} />}</td>
                      <td>
                        <div className="adm-td-name">{v.title}</div>
                        {v.duration_seconds && <div className="adm-td-sub">{Math.floor(v.duration_seconds/60)}m {v.duration_seconds%60}s</div>}
                      </td>
                      <td colSpan={2}><div className="adm-td-url" title={v.video_url}>{v.video_url?.slice(0,48)}{v.video_url?.length>48?'…':''}</div></td>
                      <td className="adm-td-actions" onClick={e => e.stopPropagation()}>
                        <button className="adm-action-edit" onClick={() => onEdit(v)}>Edit</button>
                        <button className="adm-action-del" onClick={() => handleDelete(v.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side panel */}
          {sideOpen && (
            <aside className="adm-panel" id="adm-panel">
              <div className="adm-panel-head">
                <div className="adm-panel-head-left">
                  <h2 className="adm-panel-title">
                    {selectedId ? 'Edit Entry' : `New ${tab?.label.replace(/s$/, '')}`}
                  </h2>
                  <span className={`adm-pill ${selectedId ? 'adm-pill-amber' : 'adm-pill-green'}`}>
                    {selectedId ? 'Editing' : 'Creating'}
                  </span>
                </div>
                <button className="adm-panel-close" onClick={resetForm}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="adm-panel-form">
                <div className="adm-panel-body">
                  <AdminFormFields
                    activeTab={activeTab}
                    form={form}
                    set={set}
                    activeCats={activeCats}
                    toggleCat={toggleCat}
                  />
                </div>
                <div className="adm-panel-foot">
                  {selectedId && (
                    <button type="button" className="adm-btn-ghost" onClick={resetForm} disabled={saving}>
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="adm-btn-primary adm-btn-save" disabled={saving || !isConfigured}>
                    {saving ? (
                      <><span className="adm-spin" /> Saving…</>
                    ) : selectedId ? (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Save Changes</>
                    ) : (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> Create Entry</>
                    )}
                  </button>
                </div>
              </form>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
