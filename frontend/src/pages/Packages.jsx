import React, { useEffect, useState } from 'react';
import { getPackages } from '../services/api.js';
import PackageCard from '../components/PackageCard.jsx';

// Category cards with images (PickYourTrails style)
const CATEGORIES = [
  {
    key: 'couple',
    label: 'Couple',
    image: 'https://plus.unsplash.com/premium_photo-1686910560454-d52917b211fc'
  },
  {
    key: 'family',
    label: 'Family',
    image: 'https://plus.unsplash.com/premium_photo-1663051150520-2379b12ee367'
  },
{   key: 'friends',
    label: 'Friends',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac'
  },
  {
    key: 'solo',
    label: 'Solo',
    image: 'https://images.unsplash.com/photo-1655148614056-a276c2a26842'
  }
];

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    getPackages()
      .then((res) => {
        const data = res.data || [];
        setPackages(data);
        setFiltered(data);
        setState('loaded');
      })
      .catch(() => setState('error'));
  }, []);

  const handleCategoryClick = (categoryKey) => {
    if (activeCategory === categoryKey) {
      setActiveCategory(null);
      setFiltered(packages);
      return;
    }

    setActiveCategory(categoryKey);

    const result = packages.filter((pkg) => {
      if (!pkg.category) return false;

      return pkg.category
        .toLowerCase()
        .split(',')
        .map((c) => c.trim())
        .includes(categoryKey.toLowerCase());
    });

    setFiltered(result);
  };

  return (
    <section className="section">
      {/* HERO CATEGORY SECTION */}
      <div className="category-hero">
        <h2 className="category-title">Or pick who’s joining</h2>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className={`category-card ${
                activeCategory === cat.key ? 'active' : ''
              }`}
            >
              <div
                className="category-image"
                style={{ backgroundImage: `url(${cat.image})` }}
              />

              <div className="category-label">
                {cat.label}
                <span className="arrow">›</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PACKAGES SECTION */}
      <div className="section-header">
        <h1 className="section-title">All travel packages</h1>
        <p className="section-subtitle">
          Browse everything from weekend city breaks to long-haul journeys.
        </p>
      </div>

      {state === 'loading' && <p>Loading packages…</p>}

      {state === 'error' && (
        <p style={{ color: '#b91c1c' }}>
          Loading...
        </p>
      )}

      {state === 'loaded' && filtered.length === 0 && (
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          No packages found for this category.
        </p>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-3">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}

     
    </section>
  );
};

export default Packages;