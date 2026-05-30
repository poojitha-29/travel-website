import React from "react";
/*this page is not used anymore*/
const About = () => {
  return (
    <section className="about-page">

      {/* HERO SECTION */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>We design journeys, not just trips.</h1>
          <p>
            At Sangeetha Holidays, we believe travel should feel personal,
            seamless and unforgettable. Every itinerary is thoughtfully crafted
            around you.
          </p>
        </div>
      </div>

      {/* STORY SECTION */}
      <div className="about-section container">
        <div className="about-text">
          <h2>Our story</h2>
          <p>
            What started as a passion for discovering hidden gems evolved into
            a mission to create meaningful travel experiences. We saw how
            travellers were overwhelmed by options and wanted something better —
            curated journeys with clarity, care and creativity.
          </p>
          <p>
            Today, we help couples, families, friends and solo explorers travel
            smarter and deeper.Founded in 2017, Sangeetha Holidays has been helping travelers create unforgettable memories around the globe. Our mission is to make travel accessible, enjoyable, and enriching for everyone.

We handpick each destination and experience to ensure the highest quality and authentic travel adventures for our clients.

          </p>
        </div>
      </div>

      {/* FOUNDER SECTION */}
      <div className="about-section founder-section container">
        <div className="founder-image">
          {/* Add your founder cutout image here */}
          <img
            src="/founder.png"
            alt="Founder"
          />
        </div>

        <div className="founder-text">
          <h2>Meet our founder</h2>
          <p>
            Built with heart and driven by experience, Sangeetha Holidays was
            created to make travel planning effortless. Our founder believes
            every journey should feel like it was designed just for you.
          </p>
          <p>
            “Travel is not about ticking destinations. It’s about collecting
            moments that stay with you forever.”
          </p>
        </div>
      </div>

      {/* WHY US SECTION */}
      <div className="about-section why-section">
        <div className="container">
          <h2>Why travellers choose us</h2>

          <div className="why-grid">
            <div className="why-card">
              <h3>Curated Itineraries</h3>
              <p>Personalized plans built around your style and pace.</p>
            </div>

            <div className="why-card">
              <h3>Transparent Pricing</h3>
              <p>No hidden surprises. Clear breakdowns from start to finish.</p>
            </div>

            <div className="why-card">
              <h3>End-to-End Support</h3>
              <p>From planning to landing back home, we’re with you.</p>
            </div>

            <div className="why-card">
              <h3>Handpicked Experiences</h3>
              <p>We choose stays and activities we’d book ourselves.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO KEYWORDS FOOTER */}
      <div className="about-seo container">
        <h3>Popular travel experiences</h3>
        <p>
          Bali honeymoon packages · Thailand couple trips · Maldives luxury
          holidays · Europe family tours · Dubai group travel · Custom travel
          planning · International holiday packages · Budget travel deals ·
          Luxury curated vacations · Best travel agency in India
        </p>
      </div>

    </section>
  );
};

export default About;