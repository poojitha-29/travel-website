import React from "react";
import founderImg from "../assets/founder.png";
const About = () => {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}
      <section className="about-hero">
        <div className="container">
          <h1>We design journeys, not just trips.</h1>
          <p>
            At Sangeetha Holidays, we believe travel should feel personal,
            seamless and unforgettable. Every itinerary is thoughtfully crafted
            around you.
          </p>
        </div>
      </section>


      {/* ================= STORY ================= */}
      <section className="about-section">
        <div className="container about-text">
          <h2>Our story</h2>

          <p>
            What started as a passion for discovering hidden gems evolved into a
            mission to create meaningful travel experiences. We saw how travellers
            were overwhelmed by options and wanted something better — curated
            journeys with clarity, care and creativity.
          </p>

          <p>
            Founded in 2017, Sangeetha Holidays has been helping travelers create
            unforgettable memories around the globe. Our mission is to make travel
            accessible, enjoyable and enriching for everyone.
          </p>

          <p>
            We handpick each destination and experience to ensure the highest
            quality and authentic travel adventures for our clients. Today, we
            help couples, families, friends and solo explorers travel smarter
            and deeper.
          </p>
        </div>
      </section>


      {/* ================= FOUNDER ================= */}
      <section className="founder-hero full-width-section">
        <div className="founder-container">

          <div className="founder-left">
          <img
  src={founderImg}
  alt="Founder - Sangeetha Holidays"
  className="founder-cutout"
/>
          </div>

          <div className="founder-right">
            <div className="quote-mark">“</div>

            <p className="founder-quote">
              Sangeetha Holidays was born from our belief that travel
              should feel effortless, personal and magical. We combine
              creativity with clarity to design journeys that feel like
              they were made just for you.
            </p>

            <div className="founder-name">
              <strong>Venkata Srikanth Pinnamaraju</strong><br />
              MD, Sangeetha Holidays
            </div>
            <div className="founder-socials">
  <a href="https://www.instagram.com/sangeethaholidays/" target="_blank" rel="noreferrer">
    <i className="fab fa-instagram"></i>
  </a>

  <a href="https://www.youtube.com/@sangeethaholidays302" target="_blank" rel="noreferrer">
    <i className="fab fa-youtube"></i>
  </a>

  <a href="https://www.facebook.com/share/14U8zPavzED/" target="_blank" rel="noreferrer">
    <i className="fab fa-facebook-f"></i>
  </a>

  <a href="https://wa.me/918106868686" target="_blank" rel="noreferrer">
    <i className="fab fa-whatsapp"></i>
  </a>
</div>
          </div>

        </div>
      </section>


      {/* ================= BLACK SEO FOOTER ================= */}
     {/* KEYWORD SECTION (WHITE) */}
<section className="about-keywords">
  <div className="keywords-container">
    <h3>Explore top travel experiences</h3>

    <div className="keyword-grid">
      <span>Bali honeymoon packages</span>
      <span>Thailand couple trips</span>
      <span>Maldives luxury holidays</span>
      <span>Europe family tours</span>
      <span>Dubai group travel</span>
      <span>International holiday packages</span>
      <span>Luxury curated vacations</span>
      <span>Custom travel planning</span>
      <span>Budget travel deals</span>
      <span>Best travel agency in India</span>
      <span>Solo travel packages</span>
      <span>Friends trip packages</span>
     

      <span>International Holiday Destinations</span>
  <span>Australia Holiday Packages</span>
  <span>Dubai Holiday Packages</span>
  <span>Singapore Holiday Packages</span>
  <span>Thailand Holiday Packages</span>
  <span>Bali Holiday Packages</span>
  <span>Maldives Holiday Packages</span>
  <span>Seychelles Holiday Packages</span>
  <span>Vietnam Holiday Packages</span>
  <span>New Zealand Holiday Packages</span>
  <span>Japan Holiday Packages</span>
  <span>Malaysia Holiday Packages</span>
  <span>Iceland Holiday Packages</span>
  <span>Sri Lanka Holiday Packages</span>
  <span>France Holiday Packages</span>
  <span>Switzerland Holiday Packages</span>
  <span>United States Holiday Packages</span>
  <span>Saudi Arabia Holiday Packages</span>
  <span>Italy Holiday Packages</span>
  <span>Germany Holiday Packages</span>
  <span>Mauritius Holiday Packages</span>
  <span>UK Holiday Packages</span>
  <span>Greece Holiday Packages</span>

  <span>Themed Destinations</span>
  <span>International Holiday Packages</span>
  <span>International Honeymoon Packages</span>
  <span>International Family Packages</span>
  <span>International Beach Packages</span>
  <span>International Adventure Packages</span>
  <span>Summer Holiday Packages</span>
  <span>International Luxury Packages</span>
  <span>Northern Lights Holiday Packages</span>
  <span>International Solo Travel Packages</span>



    </div>
  </div>
</section>

    </div>
  );
};

export default About;