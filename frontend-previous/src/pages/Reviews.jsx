import React, { useEffect, useState } from 'react';
import { getReviews, createReview } from '../services/api.js';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  // load reviews
  const loadReviews = () => {
    getReviews()
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // submit review
  const submitReview = (e) => {
    e.preventDefault();

    createReview(form)
      .then(() => {
        setForm({ name: '', rating: 5, comment: '' });
        loadReviews();
      })
      .catch(() => alert("Failed to add review"));
  };

  return (
    <section className="section">
      {/* HEADER */}
      <div className="section-header">
        <h1 className="section-title">Traveler reviews</h1>
        <p className="section-subtitle">
          Honest impressions from people who’ve already taken the trip.
        </p>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="reviews-layout">

        {/* LEFT → REVIEWS LIST */}
        <div>
          {reviews.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              No reviews yet. Be the first to add one.
            </p>
          ) : (
            <div className="grid">
              {reviews.map((r) => (
                <article key={r.id} className="card">
                  <div className="chip-row">
                    <span className="chip">{'★'.repeat(r.rating)}</span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {r.name}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                    {r.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT → ADD REVIEW FORM */}
        <div className="card review-form-card">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Add a review</h2>

          <form onSubmit={submitReview}>
            <div className="form-row">
              <label>Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label>Rating</label>
              <select
                className="input"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} / 5</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Comment</label>
              <textarea
                className="textarea"
                rows={3}
                value={form.comment}
                onChange={(e) =>
                  setForm({ ...form, comment: e.target.value })
                }
                required
              />
            </div>

            <button className="btn" type="submit" style={{ width: "100%" }}>
              Submit review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
