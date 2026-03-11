import React, { useEffect, useState } from 'react';
import { getReviews, createReview } from '../services/api.js';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });

  const loadReviews = () => {
    getReviews().then(res => setReviews(res.data || [])).catch(() => setReviews([]));
  };

  useEffect(() => { loadReviews(); }, []);

  const submitReview = e => {
    e.preventDefault();
    createReview(form)
      .then(() => { setForm({ name: '', rating: 5, comment: '' }); loadReviews(); })
      .catch(() => alert('Failed to add review'));
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Testimonials</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: '0.75rem' }}>
            Traveller Reviews
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
            Honest impressions from people who've already taken the trip.
          </p>
        </div>
      </div>

      <div className="page-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>
          {/* REVIEWS LIST */}
          <div>
            {reviews.length === 0 ? (
              <p className="loading-text">No reviews yet. Be the first to add one.</p>
            ) : (
              <div className="reviews-grid">
                {reviews.map(r => (
                  <div key={r.id} className="review-item">
                    <div className="review-item-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <p className="review-item-comment">"{r.comment}"</p>
                    <p className="review-item-author">— {r.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADD REVIEW FORM */}
          <div className="card" style={{ padding: '2rem', position: 'sticky', top: '88px' }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
              Share Your Experience
            </h2>
            <p style={{ color: 'var(--warm-grey)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Travelled with us? Leave a review.
            </p>
            <form onSubmit={submitReview}>
              <div className="form-row">
                <label>Your Name</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" required />
              </div>
              <div className="form-row">
                <label>Rating</label>
                <select className="input" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} / 5 {'★'.repeat(r)}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Your Review</label>
                <textarea className="textarea" rows={4} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="Tell us about your trip…" required />
              </div>
              <button className="btn forest" type="submit" style={{ width: '100%', padding: '0.85rem' }}>Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
