import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPackageById } from '../services/api.js';

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);

  const [form, setForm] = useState({
    arrivalDate: '',
    name: '',
    phone: '',
    email: '',
    city: '',
    adults: '',
    children: '',
    message: ''
  });

  useEffect(() => {
    if (!id) return;

    getPackageById(id)
      .then((res) => setPkg(res.data))
      .catch(() => setPkg(null));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = () => {
    const phoneNumber = "918106868686"; // 🔥 Replace with your number

    const text = `
*New Package Enquiry*

Package: ${pkg.name}

Arrival Date: ${form.arrivalDate}
Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
City: ${form.city}
Adults: ${form.adults}
Children: ${form.children}

Message:
${form.message}
    `;

    const encodedText = encodeURIComponent(text);

    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
  };

  if (!pkg) {
    return (
      <section className="section">
        <p>Loading package…</p>
      </section>
    );
  }

  return (
    <section className="section">

      {/* HEADER */}
      <div className="section-header">
        <div>
          <h1 className="section-title">{pkg.name}</h1>
          <p className="section-subtitle">
            {pkg.destination} · {pkg.duration_days} days
          </p>
        </div>

        <div className="badge">
          From {pkg.currency} {pkg.price.toLocaleString()}
        </div>
      </div>

      {/* POSTER */}
      {pkg.poster_url && (
        <div className="poster-wrapper">
          <img
            src={pkg.poster_url}
            alt={pkg.name}
            className="poster-image"
          />
        </div>
      )}

      {/* CONTENT + FORM */}
      <div className="package-detail-layout">

        {/* LEFT SIDE */}
        <div className="card">
          <h2>Itinerary Snapshot</h2>
          <p className="package-description">
            {pkg.description}
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="enquiry-card">
          <h3>Book This Package</h3>

          <input type="date" name="arrivalDate" onChange={handleChange} placeholder="Arrival Date" />

          <input type="text" name="name" onChange={handleChange} placeholder="Enter Name" />

          <input type="tel" name="phone" onChange={handleChange} placeholder="Phone No" />

          <input type="email" name="email" onChange={handleChange} placeholder="Email ID" />

          <input type="text" name="city" onChange={handleChange} placeholder="Your City" />

          <input type="number" name="adults" onChange={handleChange} placeholder="No. of Adults" />

          <input type="number" name="children" onChange={handleChange} placeholder="No. of Children" />

          <textarea name="message" onChange={handleChange} placeholder="Message / Requirements" />

          <button onClick={handleWhatsApp} className="btn">
            Send Enquiry
          </button>
        </div>

      </div>
    </section>
  );
};

export default PackageDetail;