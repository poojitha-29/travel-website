import React from 'react';
import founderImg from '../assets/founder.png';

const About = () => (
  <div>
    <section className="about-hero">
      <div className="container">
        <div className="section-label" style={{ color: 'var(--gold-light)', justifyContent: 'center', marginBottom: '0.75rem' }}>Our Story</div>
        <h1>We design journeys, not just trips.</h1>
        <p>
          At Sangeetha Holidays, we believe travel should feel personal, seamless and unforgettable.
          Every itinerary is thoughtfully crafted around you.
        </p>
      </div>
    </section>

    <section className="about-section">
      <div className="about-text">
        <div className="section-label">Our Journey</div>
        <h2>Our story</h2>
        <p>What started as a passion for discovering hidden gems evolved into a mission to create meaningful travel experiences. We saw how travellers were overwhelmed by options and wanted something better — curated journeys with clarity, care and creativity.</p>
        <p>Founded in 2017, Sangeetha Holidays has been helping travelers create unforgettable memories around the globe. Our mission is to make travel accessible, enjoyable and enriching for everyone.</p>
        <p>We handpick each destination and experience to ensure the highest quality and authentic travel adventures for our clients. Today, we help couples, families, friends and solo explorers travel smarter and deeper.</p>
      </div>
    </section>

    <section className="founder-hero">
      <div className="founder-container">
        <div className="founder-left">
          <img src={founderImg} alt="Founder - Venkata Srikanth Pinnamaraju" className="founder-cutout" />
        </div>
        <div className="founder-right">
          <span className="quote-mark">"</span>
          <p className="founder-quote">
            Sangeetha Holidays was born from our belief that travel should feel effortless, personal and magical. We combine creativity with clarity to design journeys that feel like they were made just for you.
          </p>
          <div className="founder-name">
            <strong>Venkata Srikanth Pinnamaraju</strong>
            MD, Sangeetha Holidays
          </div>
          <div className="founder-socials">
            <a href="https://www.instagram.com/sangeethaholidays/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/@sangeethaholidays302" target="_blank" rel="noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.facebook.com/share/14U8zPavzED/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://wa.me/918106868686" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section className="about-keywords">
      <div className="keywords-container">
        <h3>Explore top travel experiences</h3>
        <div className="keyword-grid">
          {['Bali honeymoon packages','Thailand couple trips','Maldives luxury holidays','Europe family tours','Dubai group travel','International holiday packages','Luxury curated vacations','Custom travel planning','Budget travel deals','Best travel agency in India','Solo travel packages','Friends trip packages','International Honeymoon Packages','International Family Packages','International Beach Packages','Summer Holiday Packages','International Luxury Packages','Northern Lights Holiday Packages','Australia Holiday Packages','Dubai Holiday Packages','Singapore Holiday Packages','Thailand Holiday Packages','Bali Holiday Packages','Maldives Holiday Packages','Vietnam Holiday Packages','Japan Holiday Packages','Malaysia Holiday Packages','Sri Lanka Holiday Packages','Switzerland Holiday Packages','Italy Holiday Packages','Greece Holiday Packages','Mauritius Holiday Packages'].map(k => (
            <span key={k}>{k}</span>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
