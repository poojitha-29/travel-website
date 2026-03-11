import React, { useEffect, useState, useMemo } from 'react';
import { getPackages } from '../services/api.js';
import PackageCard from '../components/PackageCard.jsx';

// These 3 categories stay as visual image cards
const GROUP_CATEGORIES = [
  { key: 'couple',  label: 'Couple',  image: 'https://plus.unsplash.com/premium_photo-1686910560454-d52917b211fc', emoji: '💑' },
  { key: 'family',  label: 'Family',  image: 'https://plus.unsplash.com/premium_photo-1663051150520-2379b12ee367', emoji: '👨‍👩‍👧‍👦' },
  { key: 'friends', label: 'Friends', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac', emoji: '🎉' },
];

const PRICE_RANGES = [
  { key: 'under50k',   label: 'Under ₹50,000',      min: 0,      max: 50000 },
  { key: '50k-1L',     label: '₹50,000 – ₹1,00,000', min: 50000,  max: 100000 },
  { key: '1L-2L',      label: '₹1L – ₹2L',           min: 100000, max: 200000 },
  { key: 'above2L',    label: 'Above ₹2L',            min: 200000, max: Infinity },
];

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [state, setState] = useState('loading');

  // Filters
  const [activeGroup, setActiveGroup]   = useState(null); // couple/family/friends
  const [activeTripType, setActiveTripType] = useState(null); // domestic/international
  const [activePriceKey, setActivePriceKey] = useState(null);

  useEffect(() => {
    getPackages()
      .then(res => { setPackages(res.data || []); setState('loaded'); })
      .catch(() => setState('error'));
  }, []);

  const filtered = useMemo(() => {
    let result = packages;

    if (activeGroup) {
      result = result.filter(p =>
        p.category?.toLowerCase().split(',').map(c => c.trim()).includes(activeGroup)
      );
    }

    if (activeTripType) {
      result = result.filter(p =>
        p.category?.toLowerCase().split(',').map(c => c.trim()).includes(activeTripType)
      );
    }

    if (activePriceKey) {
      const range = PRICE_RANGES.find(r => r.key === activePriceKey);
      if (range) {
        result = result.filter(p => {
          const price = Number(p.price) || 0;
          return price >= range.min && price < range.max;
        });
      }
    }

    return result;
  }, [packages, activeGroup, activeTripType, activePriceKey]);

  const toggleGroup     = key => setActiveGroup(v => v === key ? null : key);
  const toggleTripType  = key => setActiveTripType(v => v === key ? null : key);
  const togglePrice     = key => setActivePriceKey(v => v === key ? null : key);

  const hasFilters = activeGroup || activeTripType || activePriceKey;

  const clearAll = () => {
    setActiveGroup(null);
    setActiveTripType(null);
    setActivePriceKey(null);
  };

  const activeFilterLabel = () => {
    const parts = [];
    if (activeGroup) parts.push(activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1));
    if (activeTripType) parts.push(activeTripType.charAt(0).toUpperCase() + activeTripType.slice(1));
    if (activePriceKey) parts.push(PRICE_RANGES.find(r => r.key === activePriceKey)?.label);
    return parts.length ? parts.join(' · ') : 'All Packages';
  };

  return (
    <div>
      {/* PAGE HERO */}
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Explore</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: '0.75rem' }}>
            All Travel Packages
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            From weekend city breaks to long-haul journeys — everything in one place.
          </p>
        </div>
      </div>

      <div className="page-section">

        {/* ── WHO'S JOINING — image cards ── */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Travel Style</div>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Pick who's joining</h2>
          <div className="category-grid">
            {GROUP_CATEGORIES.map(cat => (
              <div
                key={cat.key}
                onClick={() => toggleGroup(cat.key)}
                className={`category-card${activeGroup === cat.key ? ' active' : ''}`}
              >
                <div className="category-image" style={{ backgroundImage: `url(${cat.image})` }} />
                <div className="category-label">
                  <span>{cat.emoji} {cat.label}</span>
                  <span className="arrow">›</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FILTER BAR — trip type + price ── */}
        <div className="pkg-filter-bar">
          <div className="pkg-filter-group">
            <span className="pkg-filter-heading">Trip Type</span>
            <div className="pkg-filter-pills">
              {[
                { key: 'domestic',      label: '🇮🇳 Domestic' },
                { key: 'international', label: '✈️ International' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`pkg-filter-pill${activeTripType === key ? ' active' : ''}`}
                  onClick={() => toggleTripType(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="pkg-filter-divider" />

          <div className="pkg-filter-group">
            <span className="pkg-filter-heading">Budget</span>
            <div className="pkg-filter-pills">
              {PRICE_RANGES.map(r => (
                <button
                  key={r.key}
                  className={`pkg-filter-pill${activePriceKey === r.key ? ' active' : ''}`}
                  onClick={() => togglePrice(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <>
              <div className="pkg-filter-divider" />
              <button className="pkg-filter-clear" onClick={clearAll}>
                ✕ Clear all
              </button>
            </>
          )}
        </div>

        {/* ── RESULTS HEADER ── */}
        <div className="section-header" style={{ marginTop: '2.5rem' }}>
          <div>
            <div className="section-label">{hasFilters ? 'Filtered results' : 'All packages'}</div>
            <h2 className="section-title">{activeFilterLabel()}</h2>
          </div>
          <span style={{ color: 'var(--warm-grey)', fontSize: '0.9rem', flexShrink: 0 }}>
            {filtered.length} package{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {state === 'loading' && <p className="loading-text">Loading packages…</p>}
        {state === 'error'   && <p className="loading-text" style={{ color: '#b91c1c' }}>Loading, please wait…</p>}
        {state === 'loaded' && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</p>
            <p style={{ color: 'var(--warm-grey)', fontSize: '1rem', marginBottom: '1rem' }}>No packages match these filters.</p>
            <button className="btn outline" onClick={clearAll}>Clear all filters</button>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="grid-3">
            {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;