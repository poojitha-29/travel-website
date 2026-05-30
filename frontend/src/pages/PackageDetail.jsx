import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackageById } from '../services/api.js';

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [form, setForm] = useState({
    arrivalDate: '', name: '', phone: '', email: '', city: '', adults: '', children: '', message: ''
  });

  useEffect(() => {
    if (!id) return;
    getPackageById(id).then(res => setPkg(res.data)).catch(() => setPkg(null));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleWhatsApp = () => {
    const text = `*New Package Enquiry*\n\nPackage: ${pkg.name}\nArrival Date: ${form.arrivalDate}\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nCity: ${form.city}\nAdults: ${form.adults}\nChildren: ${form.children}\n\nMessage:\n${form.message}`;
    window.open(`https://wa.me/918106868686?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!pkg) return <p className="loading-text">Loading package…</p>;

  return (
    <div>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', padding: '3.5rem 0 2.5rem' }}>
        <div className="container">
          <Link to="/packages" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
            ← Back to Packages
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: 'white', marginBottom: '0.6rem' }}>
            {pkg.name}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.9rem' }}>
              📍 {pkg.destination} &nbsp;·&nbsp; 🗓 {pkg.duration_days} days
            </span>
            <span className="badge">
              From {pkg.currency} {pkg.price?.toLocaleString?.()}
            </span>
          </div>
        </div>
      </div>

      <div className="page-section">
        {pkg.poster_url && (
          <div className="poster-wrapper">
            <img src={pkg.poster_url} alt={pkg.name} className="poster-image" />
          </div>
        )}

        <div className="package-detail-layout">
          {/* ITINERARY */}
          <div className="card" style={{ padding: '2rem', gap: 0 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', color: 'var(--charcoal)', marginBottom: '1.25rem' }}>
              Itinerary Snapshot
            </h2>
            <p className="package-description">{pkg.description}</p>
          </div>

          {/* ENQUIRY FORM */}
          <div className="enquiry-card">
            <h3>Book This Package</h3>
            <p style={{ color: 'var(--warm-grey)', fontSize: '0.85rem', marginTop: '-0.5rem' }}>
              Fill in your details and we'll send you a custom quote via WhatsApp.
            </p>

            <input type="date" name="arrivalDate" onChange={handleChange} />
            <input type="text" name="name" onChange={handleChange} placeholder="Your Name" />
            <input type="tel" name="phone" onChange={handleChange} placeholder="Phone / WhatsApp" />
            <input type="email" name="email" onChange={handleChange} placeholder="Email Address" />
            <input type="text" name="city" onChange={handleChange} placeholder="Your City" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input type="number" name="adults" onChange={handleChange} placeholder="Adults" min="1" />
              <input type="number" name="children" onChange={handleChange} placeholder="Children" min="0" />
            </div>
            <textarea name="message" onChange={handleChange} placeholder="Message / Special Requirements" rows={3} style={{ resize: 'vertical' }} />

            <button onClick={handleWhatsApp} className="btn forest" style={{ width: '100%', padding: '0.9rem' }}>
              <i className="fab fa-whatsapp"></i>&nbsp; Send Enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
