import React, { useEffect, useState } from 'react';
import { getFaqs } from '../services/api.js';


const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    getFaqs()
      .then((res) => setFaqs(res.data || []))
      .catch(() => setFaqs([]));
  }, []);

  const categories = ['All', ...new Set(faqs.map((f) => f.category).filter(Boolean))];

  const filteredFaqs =
    activeTab === 'All' ? faqs : faqs.filter((f) => f.category === activeTab);

  return (
    <section className="faq-page">
      {/* Yellow full-width header */}
      <div className="faq-hero">
        <h1>Frequently asked questions</h1>
      </div>

      {/* Center white card */}
      <div className="faq-card">
        {/* Tabs */}
        <div className="faq-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeTab === cat ? 'active' : ''}
              onClick={() => {
                setActiveTab(cat);
                setOpenId(null);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="faq-list">
          {filteredFaqs.length === 0 ? (
            <p className="faq-empty">No FAQs available.</p>
          ) : (
            filteredFaqs.map((f) => (
              <div key={f.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenId(openId === f.id ? null : f.id)}
                >
                  <span className="arrow">{openId === f.id ? '▼' : '▶'}</span>
                  {f.question}
                </button>

                {openId === f.id && <p className="faq-answer">{f.answer}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
