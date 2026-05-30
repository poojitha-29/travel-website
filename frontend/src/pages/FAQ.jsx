import React, { useEffect, useState } from 'react';
import { getFaqs } from '../services/api.js';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    getFaqs().then(res => setFaqs(res.data || [])).catch(() => setFaqs([]));
  }, []);

  const categories = ['All', ...new Set(faqs.map(f => f.category).filter(Boolean))];
  const filteredFaqs = activeTab === 'All' ? faqs : faqs.filter(f => f.category === activeTab);

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Help Center</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: '0.75rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
            Everything you need to know about booking your dream trip.
          </p>
        </div>
      </div>

      <div className="page-section">
        {/* TABS */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveTab(cat); setOpenId(null); }}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid',
                  borderColor: activeTab === cat ? 'var(--forest)' : 'var(--light-grey)',
                  background: activeTab === cat ? 'var(--forest)' : 'transparent',
                  color: activeTab === cat ? 'white' : 'var(--warm-grey)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="faq-list">
          {filteredFaqs.length === 0 ? (
            <p className="loading-text">No FAQs available.</p>
          ) : (
            filteredFaqs.map(f => (
              <div key={f.id} className={`faq-item${openId === f.id ? ' open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenId(openId === f.id ? null : f.id)}>
                  {f.question}
                  <span className="faq-chevron">▼</span>
                </button>
                <div className="faq-answer">
                  <p className="faq-answer-inner">{f.answer}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
