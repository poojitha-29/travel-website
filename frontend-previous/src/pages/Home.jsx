import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedPackages, getHealth } from '../services/api.js';
import { getReviews } from '../services/api.js';
import PackageCard from '../components/PackageCard.jsx';




const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
];

const HERO_SERVICES = [
  'Customised itineraries',
  'Flight bookings',
  'Hotel & villa stays',
  'Visa assistance',
  'Honeymoon specials',
  'Family holidays',
  'Group departures',
  'Weekend getaways'
];


const INSTAGRAM_URL = 'https://www.instagram.com/reel/DVFmfnGkrLD/';


const INSTAGRAM_URL1 = 'https://www.instagram.com/reel/DUknggZkvcV/';
const INSTAGRAM_URL2 = 'https://www.instagram.com/reel/DVFmfnGkrLD/';
const INSTAGRAM_URL3 = 'https://www.instagram.com/reel/DU2ITdsknID/';
const INSTAGRAM_URL4 = 'https://www.instagram.com/reel/DU8N9ssEilU/';
const INSTAGRAM_URL5 = 'https://www.instagram.com/reel/DUpHwITEgS8/';
const INSTAGRAM_URL6 = 'https://www.instagram.com/reel/DUxjDVJkkeO/';
const INSTAGRAM_URL7 = 'https://www.instagram.com/reel/DUulX9oEjY6/';
const INSTAGRAM_URL8 = 'https://www.instagram.com/reel/DUhhqNbknNP/';
const INSTAGRAM_URL9 = 'https://www.instagram.com/reel/DUa2c6Kkt8o/';
const INSTAGRAM_URL10 = 'https://www.instagram.com/reel/DUS7ML7kpun/';
const INSTAGRAM_URL11 = 'https://www.instagram.com/reel/DULlx6jknDL/';
const INSTAGRAM_URL12 = 'https://www.instagram.com/reel/DUGAUAEkhh6/';






const WHY_POINTS = [
  { label: '100% Friendly', icon: '🧳' },
  { label: '24×7 Availability', icon: '💜' },
  { label: '95% Visa Success', icon: '👍' },
  { label: 'Happy Travellers', icon: '👨‍👩‍👧‍👦' }
];

const FOUNDER_REELS = [
  {
    id: 1,
    url: INSTAGRAM_URL1,
    headline: '5 Days in Kashmir , Perfect Summer plan',
    thumbnail: 'https://images.unsplash.com/photo-1552098933-a5ceb0e5dd91?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  },
  {
    id: 2,
    url: INSTAGRAM_URL2,
    headline: 'Explore Bali+Gili Island 6N/7D',
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    url: INSTAGRAM_URL3,
    headline: 'Vietnam-Timeless CHarm ',
    thumbnail: 'https://images.unsplash.com/photo-1545172538-171a802bd867?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 4,
    url: INSTAGRAM_URL4,
    headline: 'Unforgettable Himachal 6N/7D',
    thumbnail: 'https://images.unsplash.com/photo-1597754865557-96ea6b53c9db?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 5,
    url: INSTAGRAM_URL5,
     headline: 'Phuket and Krabi-Once is never enough',
    thumbnail: 'https://images.unsplash.com/photo-1494949360228-4e9bde560065?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 6,
    url: INSTAGRAM_URL6,
    headline: 'Kedarnath - where nature meets devotion',
    thumbnail: 'https://images.unsplash.com/photo-1712733900711-d0b929d0d7cc?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 7,
    url: INSTAGRAM_URL7,
    headline: 'Vibrant-Gujarat',
    thumbnail: 'https://images.unsplash.com/photo-1642841819300-20ed449c02a1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 8,
    url: INSTAGRAM_URL8,
    headline: 'Singapore -Live the glam life',
    thumbnail:'https://images.unsplash.com/photo-1580541631950-7282082b53ce?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  },
  {
    id: 10,
    url: INSTAGRAM_URL10,
    headline: 'Andaman - Blue and You',
    thumbnail:'https://images.unsplash.com/photo-1582812403989-69ef5dde0dfc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  }
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState('Checking…');
  const [activeSlide, setActiveSlide] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(0);

 

  useEffect(() => {
    getReviews()
  .then((res) => setReviews(res.data || []))
  .catch(() => setReviews([]));

    getHealth()
      .then(() => setStatus('Your Trusted Travel Partner'))
      .catch(() => setStatus('Loading...'));

    getFeaturedPackages()
      .then((res) => setFeatured(res.data || []))
      .catch(() => setFeatured([]));
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length),
      6000
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!reviews.length) return;
  
    const id = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
  
    return () => clearInterval(id);
  }, [reviews]);
  
  return (
    <div>
      <section className="hero hero-slider-section">
        <div className="hero-slider">
          {HERO_IMAGES.map((src, index) => (
            <div
              key={src + index}
              className={`hero-slide ${index === activeSlide ? 'hero-slide-active' : ''}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
        <div className="hero-overlay">
          <div className="hero-overlay-inner">
            <p className="hero-kicker">YOUR NEXT HOLIDAY</p>
            <h1 className="hero-title">
              Design trips that feel
              <span className="hero-highlight"> like you.</span>
            </h1>
            <p className="hero-subtitle">
              Short city breaks, island getaways or long trails through Europe—plan everything in
              one place with people who actually travel.
            </p>
            <div className="hero-meta">
              <span className="hero-status-pill">{status}</span>
            </div>
            <div className="hero-actions">
              <Link to="/packages" className="btn">
                Explore packages
              </Link>
              <Link to="/contact" className="btn secondary">
                Plan with an expert
              </Link>
            </div>
            <div className="hero-services">
              <div className="hero-services-track">
                {HERO_SERVICES.concat(HERO_SERVICES).map((label, index) => (
                  <span key={index} className="hero-service-pill">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reels-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">How We Plan Real Journeys</h2>
            <p className="section-subtitle">
              Quick clips that explain how we think about real journeys.
            </p>
          </div>
        </div>
        <div className="reels-row">
  {FOUNDER_REELS.map((reel) => (
    <a
      key={reel.id}
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="reel-card"
    >
      <div className="reel-thumb">
        <img
          src={reel.thumbnail}
          alt="Travel Reel"
        />
        <div className="reel-play">▶</div>
      </div>

      {reel.headline && (
        <div className="reel-caption">{reel.headline}</div>
      )}
    </a>
  ))}
</div>
      </section>

 {/* WHY CHOOSE SECTION (NEW) */}
 <section className="why-section">
        <h2 className="why-title">Why choose Sangeetha Holidays?</h2>

        <div className="why-grid">
          {WHY_POINTS.map((p, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{p.icon}</div>
              <div className="why-label">{p.label}</div>
            </div>
          ))}
        </div>

        
      </section>
      {reviews.length > 0 && (
  <section className="section" style={{ textAlign: 'center' }}>
    
    {/* rating badge */}
    <div style={{ marginBottom: 20, fontWeight: 600 }}>
      ⭐ 4.6 / 5 • {reviews.length}+ reviews
    </div>

    {/* sliding testimonial */}
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
        “{reviews[activeReview]?.comment}”
      </p>

      <p style={{ marginTop: 12, fontWeight: 600, color: '#16a34a' }}>
        {reviews[activeReview]?.name}
      </p>
    </div>
  </section>
)}

    {/* Floating WhatsApp Button */}
<a
  href="https://wa.me/918106868686"
  target="_blank"
  rel="noreferrer"
  className="whatsapp-float"
>
  <i className="fab fa-whatsapp"></i>
</a> 
     
    </div>
  );
};

export default Home;
