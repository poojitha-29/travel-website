import React, { useEffect, useState } from 'react';
import { getPackages } from '../services/api.js';
import PackageCard from '../components/PackageCard.jsx';

const CATEGORIES = [
  { key: 'couple', label: 'Couple', image: 'https://plus.unsplash.com/premium_photo-1686910560454-d52917b211fc', emoji: '💑' },
  { key: 'family', label: 'Family', image: 'https://plus.unsplash.com/premium_photo-1663051150520-2379b12ee367', emoji: '👨‍👩‍👧‍👦' },
  { key: 'friends', label: 'Friends', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac', emoji: '🎉' },
  { key: 'solo', label: 'Solo', image: 'https://images.unsplash.com/photo-1655148614056-a276c2a26842', emoji: '🧭' },
];

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    getPackages()
      .then(res => { const d = res.data || []; setPackages(d); setFiltered(d); setState('loaded'); })
      .catch(() => setState('error'));
  }, []);

  const handleCategoryClick = key => {
    if (activeCategory === key) { setActiveCategory(null); setFiltered(packages); return; }
    setActiveCategory(key);
    setFiltered(packages.filter(p =>
      p.category?.toLowerCase().split(',').map(c => c.trim()).includes(key)
    ));
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
        {/* CATEGORY FILTER */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">Filter by Travel Style</div>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Pick who's joining</h2>
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`category-card${activeCategory === cat.key ? ' active' : ''}`}
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

        {/* PACKAGES GRID */}
        <div className="section-header">
          <div>
            <div className="section-label">
              {activeCategory ? `Filtered: ${activeCategory}` : 'All packages'}
            </div>
            <h2 className="section-title">
              {activeCategory
                ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Trips`
                : 'All Packages'}
            </h2>
          </div>
          {activeCategory && (
            <button
              className="btn outline"
              onClick={() => { setActiveCategory(null); setFiltered(packages); }}
              style={{ flexShrink: 0 }}
            >
              Clear filter
            </button>
          )}
        </div>

        {state === 'loading' && <p className="loading-text">Loading packages…</p>}
        {state === 'error' && <p className="loading-text" style={{ color: '#b91c1c' }}>Loading, please wait…</p>}
        {state === 'loaded' && filtered.length === 0 && (
          <p className="loading-text">No packages found for this category.</p>
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
