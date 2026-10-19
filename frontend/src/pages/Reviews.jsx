
import React, { useEffect, useState } from 'react';
import { getReviews, createReview } from '../services/api.js';
import './Reviews.css';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  rating: 5,
  comment: '',
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadReviews = async () => {
    try {
      const res = await getReviews();
      setReviews(res.data || []);
    } catch {
      setError('Unable to load reviews right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const phone = form.phone.replace(/\D/g, '');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    setSubmitting(true);

    try {
      await createReview({
        ...form,
        phone,
        email: form.email.trim() || null,
        name: form.name.trim(),
        comment: form.comment.trim(),
        rating: Number(form.rating),
      });

      setForm(initialForm);
      setMessage('Thank you! Your review has been submitted.');
      await loadReviews();
    } catch (e) {
      setError(
        e?.response?.data?.detail ||
        'Could not submit your review. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0)
        / reviews.length
    : 0;

  return (
    <main className="reviews-page">
      <section className="reviews-hero">
        <div className="reviews-hero-inner">
          <span className="reviews-eyebrow">YOUR JOURNEY, YOUR STORY</span>
          <h1>Memories Worth Sharing</h1>
          <p>
            Every journey has a story. Read experiences from our travellers
            and share yours with us.
          </p>

          <a href="#share-review" className="reviews-hero-button">
            Share Your Experience <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="reviews-content">
        <div className="reviews-heading">
          <div>
            <span className="reviews-eyebrow">TRAVELLER STORIES</span>
            <h2>Experiences that stay with you</h2>
            <p>Real feedback from people who travelled with us.</p>
          </div>

          {reviews.length > 0 && (
            <div className="reviews-rating-summary">
              <span className="reviews-rating-number">
                {averageRating.toFixed(1)}
              </span>
              <span className="reviews-gold-stars" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
                ★★★★★
              </span>
              <span className="reviews-rating-count">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>

        {error && <p className="reviews-feedback reviews-error" role="alert">{error}</p>}
        {message && <p className="reviews-feedback reviews-success" role="status">{message}</p>}

        {loading ? (
          <p className="reviews-empty">Loading traveller stories…</p>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">
            <span aria-hidden="true">✦</span>
            <h3>Your story could be the first</h3>
            <p>Be the first to share your experience with Sangeetha Holidays.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-top">
                  <span className="reviews-gold-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {'★'.repeat(Number(review.rating))}
                    {'☆'.repeat(5 - Number(review.rating))}
                  </span>
                  <span className="review-quote-mark" aria-hidden="true">“</span>
                </div>

                <p className="review-card-comment">{review.comment}</p>

                <div className="review-card-author">
                  <span className="review-avatar" aria-hidden="true">
                    {(review.name || 'T').trim().charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <strong>{review.name}</strong>
                    <span>Traveller</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="reviews-form-section" id="share-review">
          <div className="reviews-form-intro">
            <span className="reviews-eyebrow">WE'D LOVE TO HEAR FROM YOU</span>
            <h2>Your experience matters.</h2>
            <p>
              Tell us about your journey. Your feedback helps us create
              even more memorable holidays.
            </p>
            <div className="reviews-privacy-note">
              <span aria-hidden="true">🔒</span>
              Your phone number and email are for contact purposes only
              and are not displayed publicly with your review.
            </div>
          </div>

          <div className="reviews-form-card">
            <h3>Share your experience</h3>
            <p className="reviews-form-subtitle">
              Fields marked * are required.
            </p>

            <form onSubmit={submitReview}>
              <div className="reviews-form-grid">
                <div className="reviews-field">
                  <label htmlFor="review-name">Your name *</label>
                  <input
                    id="review-name"
                    value={form.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="reviews-field">
                  <label htmlFor="review-phone">Phone number *</label>
                  <input
                    id="review-phone"
                    type="tel"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    title="Enter a valid 10-digit Indian mobile number"
                    required
                  />
                </div>

                <div className="reviews-field reviews-field-full">
                  <label htmlFor="review-email">Email address <span>(optional)</span></label>
                  <input
                    id="review-email"
                    type="email"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={254}
                  />
                </div>

                <div className="reviews-field reviews-field-full">
                  <label htmlFor="review-rating">Your rating *</label>
                  <select
                    id="review-rating"
                    value={form.rating}
                    onChange={e => updateField('rating', Number(e.target.value))}
                    required
                  >
                    <option value={5}>★★★★★ — Excellent</option>
                    <option value={4}>★★★★☆ — Very good</option>
                    <option value={3}>★★★☆☆ — Good</option>
                    <option value={2}>★★☆☆☆ — Fair</option>
                    <option value={1}>★☆☆☆☆ — Needs improvement</option>
                  </select>
                </div>

                <div className="reviews-field reviews-field-full">
                  <label htmlFor="review-comment">Your review *</label>
                  <textarea
                    id="review-comment"
                    value={form.comment}
                    onChange={e => updateField('comment', e.target.value)}
                    placeholder="Tell us about your trip, the service and your favourite memories…"
                    rows={5}
                    minLength={5}
                    maxLength={3000}
                    required
                  />
                </div>
              </div>

              <button
                className="reviews-submit-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Your Review'}
                {!submitting && <span aria-hidden="true"> ↗</span>}
              </button>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Reviews;
