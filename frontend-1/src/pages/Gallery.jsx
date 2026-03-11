import React, { useEffect, useState } from 'react';
import { getGallery } from '../services/api.js';

const Gallery = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getGallery().then(res => setItems(res.data || [])).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Memories</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: '0.75rem' }}>
            Gallery
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
            A quiet scroll through places our travellers have loved.
          </p>
        </div>
      </div>

      <div className="page-section">
        {items.length === 0 ? (
          <p className="loading-text">Loading gallery…</p>
        ) : (
          <div className="gallery-grid">
            {items.map(img => (
              <div key={img.id} className="gallery-item">
                <img src={img.image_url} alt={img.title} loading="lazy" />
                <div className="gallery-overlay">
                  <span className="gallery-overlay-icon">⊕</span>
                </div>
                {(img.title || img.destination) && (
                  <div style={{ padding: '0.75rem 0.75rem 0', background: 'white' }}>
                    {img.title && <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--charcoal)' }}>{img.title}</p>}
                    {img.destination && <p style={{ fontSize: '0.78rem', color: 'var(--warm-grey)', marginTop: '0.15rem' }}>{img.destination}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
