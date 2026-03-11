import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', phone: '', place: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const text = `New Travel Enquiry\n\nName: ${form.name}\nWhatsApp: ${form.phone}\nCity: ${form.place}`;
    window.open(`https://wa.me/918106868686?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div>
      {/* PAGE HERO */}
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>We're Here</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3rem)', color: 'white', marginBottom: '0.75rem' }}>
            Get in Touch
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
            Message us on WhatsApp or call directly to plan your dream trip.
          </p>
        </div>
      </div>

      <div className="page-section">
        <div className="contact-layout">
          {/* FORM */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
              Send an Enquiry
            </h2>
            <p style={{ color: 'var(--warm-grey)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Fill in your details and we'll reach out on WhatsApp.
            </p>

            <div className="form-row">
              <label>Your Name</label>
              <input name="name" className="input" value={form.name} onChange={handleChange} placeholder="e.g. Priya Sharma" required />
            </div>
            <div className="form-row">
              <label>WhatsApp Number</label>
              <input type="tel" name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
            </div>
            <div className="form-row">
              <label>Your City</label>
              <input name="place" className="input" value={form.place} onChange={handleChange} placeholder="e.g. Hyderabad" required />
            </div>

            <button type="submit" className="btn forest" style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem' }}>
              <i className="fab fa-whatsapp"></i>&nbsp; Send WhatsApp Enquiry
            </button>
            <a
              href="tel:+918106868686"
              className="btn outline"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.9rem', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
            >
              📞 Call Now
            </a>
          </form>

          {/* INFO */}
          <div className="contact-info">
            <iframe
              title="Location"
              src="https://www.google.com/maps?q=Manjeera+Trinity+Corporate+KPHB+Hyderabad&output=embed"
              width="100%"
              height="220"
              style={{ border: 0, borderRadius: '12px', display: 'block' }}
              loading="lazy"
            />
            <div className="contact-details">
              <h3>Address</h3>
              <p>
                Unit No 1012, 10th Floor,<br />
                Manjeera Trinity Corporate,<br />
                Beside Lulu Hypermarket, KPHB Phase-3,<br />
                Hyderabad, Telangana 500072
              </p>
              <a
                href="https://www.google.com/maps/place/Manjeera+Trinity+Corporate+KPHB"
                target="_blank"
                rel="noreferrer"
                className="map-link"
              >
                View on Google Maps →
              </a>

              <h3>Phone</h3>
              <p>
                <a href="tel:+918106868686">+91 81068 68686</a><br />
                <a href="tel:+918978903318">+91 89789 03318</a>
              </p>

              <h3>Business Hours</h3>
              <p>
                Monday – Friday: 9:00 AM – 7:00 PM<br />
                Saturday: 10:00 AM – 5:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
