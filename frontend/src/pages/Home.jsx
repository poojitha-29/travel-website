import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedPackages, getHealth, getReviews } from '../services/api.js';
import PackageCard from '../components/PackageCard.jsx';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80',
];

const HERO_SERVICES = [
  '✦ Customised Itineraries',
  '✦ Flight Bookings',
  '✦ Hotel & Villa Stays',
  '✦ Visa Assistance',
  '✦ Honeymoon Specials',
  '✦ Family Holidays',
  '✦ Group Departures',
  '✦ Weekend Getaways',
];

const WHY_POINTS = [
  { label: '100% Customisation', icon: '🧳', number: '100%' },
  { label: '24×7 Availability', icon: '💬', number: '24/7' },
  { label: 'TrustWorthy', icon: '✅', number: '100%' },
  { label: 'Happy Travellers', icon: '❤️', number: '500+' },
];

const FOUNDER_REELS = [
  { id: 1,  url: 'https://www.instagram.com/p/DVFmfnGkrLD/', headline: 'Bali – Island of Gods', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { id: 2,  url: 'https://www.instagram.com/p/DUknggZkvcV/', headline: 'Kashmir – Paradise on Earth', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80' },
  { id: 3,  url: 'https://www.instagram.com/p/DU2ITdsknID/', headline: 'Vietnam – Hidden Gem of Asia', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80' },
  { id: 4,  url: 'https://www.instagram.com/p/DU8N9ssEilU/', headline: 'Himachal – Where Mountains Call', img: 'https://images.unsplash.com/photo-1657894736581-ccc35d62d9e2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 5,  url: 'https://www.instagram.com/reel/DUpHwITEgS8/', headline: 'Phuket – Sun, Sand & Soul', img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400&q=80' },
  { id: 6,  url: 'https://www.instagram.com/p/DUxjDVJkkeO/', headline: 'Kedarnath – A Divine Journey', img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80' },
  { id: 7,  url: 'https://www.instagram.com/p/DUulX9oEjY6/', headline: 'Gujarat – Culture & Colours', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400&q=80' },
  { id: 8,  url: 'https://www.instagram.com/p/DUhhqNbknNP/', headline: 'Singapore – City of Wonders', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80' },
  { id: 9,  url: 'https://www.instagram.com/p/DUS7ML7kpun/', headline: 'Andaman – Jewels of the Sea', img: 'https://images.unsplash.com/photo-1582812403989-69ef5dde0dfc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState('Your Trusted Travel Partner');
  const [activeSlide, setActiveSlide] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    getReviews().then(res => setReviews(res.data || [])).catch(() => setReviews([]));
    getHealth().then(() => setStatus('Your Trusted Travel Partner')).catch(() => {});
    getFeaturedPackages().then(res => setFeatured(res.data || [])).catch(() => setFeatured([]));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveSlide(p => (p + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!reviews.length) return;
    const id = setInterval(() => setActiveReview(p => (p + 1) % reviews.length), 4500);
    return () => clearInterval(id);
  }, [reviews]);

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-slider">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`hero-slide${i === activeSlide ? ' hero-slide-active' : ''}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>

        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-inner">
              <p className="hero-kicker">Your Next Holiday Awaits</p>
              <h1 className="hero-title">
                Design trips that feel
                <span className="hero-highlight"> like you.</span>
              </h1>
              <p className="hero-subtitle">
                Short city breaks, island getaways or long trails through Europe — plan everything in one place with people who actually travel.
              </p>
              <div className="hero-actions">
                <Link to="/packages" className="btn">Explore Packages</Link>
                <Link to="/contact" className="btn secondary">Plan with an Expert</Link>
              </div>
              <div className="hero-status-pill">{status}</div>
              <div className="hero-services">
                <div className="hero-services-track">
                  {HERO_SERVICES.concat(HERO_SERVICES).map((label, i) => (
                    <span key={i} className="hero-service-pill">{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-dots">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === activeSlide ? ' active' : ''}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURED PACKAGES */}
      {featured.length > 0 && (
        <section className="section" style={{ background: 'var(--cream)' }}>
          <div className="section-inner">
            <div className="section-header">
              <div>
                <div className="section-label">Handpicked for You</div>
                <h2 className="section-title">Featured Packages</h2>
                <p className="section-subtitle">Our most loved and reviewed holiday experiences.</p>
              </div>
              <Link to="/packages" className="btn outline" style={{ flexShrink: 0 }}>
                View all →
              </Link>
            </div>
            <div className="grid-3">
              {featured.slice(0, 3).map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          </div>
        </section>
      )}

      {/* WHY SECTION */}
      <section className="why-section">
        <div className="why-section-inner">
          <div className="section-label">Why Us</div>
          <h2 className="section-title">Why choose Sangeetha Holidays?</h2>
          <p className="section-subtitle">We've been turning dream trips into cherished memories since 2017.</p>
          <div className="why-grid">
            {WHY_POINTS.map((p, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{p.icon}</div>
                <div className="why-number">{p.number}</div>
                <div className="why-label">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REELS SECTION */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-label">Watch & Explore</div>
              <h2 className="section-title">How We Plan Real Journeys</h2>
              <p className="section-subtitle">Quick clips explaining how we think about your travels.</p>
            </div>
            <a
              href="https://www.instagram.com/sangeethaholidays/"
              target="_blank"
              rel="noreferrer"
              className="btn outline"
              style={{ flexShrink: 0 }}
            >
              Follow us →
            </a>
          </div>
          <div className="reels-row">
            {FOUNDER_REELS.map(reel => (
              <a
                key={reel.id}
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reel-card"
              >
                <div className="reel-thumb">
                  <img
                    src={reel.img}
                    alt={reel.headline}
                    loading="lazy"
                  />
                  <div className="reel-play">▶</div>
                </div>
                <div className="reel-overlay">
                  <div className="reel-caption">{reel.headline}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="reviews-section">
          <div className="reviews-section-inner" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Testimonials</div>
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>What Our Travellers Say</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>Real stories from real journeys.</p>

            <div className="review-badge">
              ⭐ 4.6 / 5 &nbsp;·&nbsp; {reviews.length}+ Reviews
            </div>

            <div className="review-card">
              <div className="review-stars">★ ★ ★ ★ ★</div>
              <span className="review-quote-mark">"</span>
              <p className="review-text">{reviews[activeReview]?.comment}</p>
              <p className="review-author">— {reviews[activeReview]?.name}</p>
            </div>

            <div className="review-dots" style={{ marginTop: '1.5rem' }}>
              {reviews.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  className={`review-dot${i === activeReview ? ' active' : ''}`}
                  onClick={() => setActiveReview(i)}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA STRIP */}
      <section style={{ background: 'var(--gold-pale)', padding: '4rem 0', textAlign: 'center' }}>
        <div className="section-inner">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--forest)', marginBottom: '0.75rem' }}>
            Ready to plan your next adventure?
          </h2>
          <p style={{ color: 'var(--warm-grey)', fontSize: '1rem', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Talk to our travel experts and get a personalised itinerary crafted just for you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn forest">Get in Touch</Link>
            <a href="https://wa.me/918106868686" target="_blank" rel="noreferrer" className="btn outline">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp Float */}
      <a href="https://wa.me/918106868686" target="_blank" rel="noreferrer" className="whatsapp-float">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default Home;