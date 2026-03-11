import React, { useEffect, useState } from 'react';
import { getGallery } from '../services/api.js';

const Gallery = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getGallery()
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="section">
      <div className="section-header">
        <h1 className="section-title">Gallery</h1>
        <p className="section-subtitle">
          A quiet scroll through places our travelers have loved.
        </p>
      </div>

      {items.length === 0 ? (
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          Loading, they will show up here in a while.
        </p>
      ) : (
        <div  className="grid-3">

          {items.map((img) => (
            <article key={img.id} className="card">
              <div
                style={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  marginBottom: '0.6rem',
                  backgroundColor: '#0f172a',
                  height: '180px'
                }}
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>{img.title}</h3>
              {img.destination && (
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{img.destination}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Gallery;
