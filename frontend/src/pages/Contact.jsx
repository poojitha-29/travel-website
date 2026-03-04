import React, { useState } from "react";

const Contact = () => {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    place: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = `
New Travel Enquiry

Name: ${form.name}
WhatsApp: ${form.phone}
City: ${form.place}
    `;

    const encoded = encodeURIComponent(text);

    window.open(
      `https://wa.me/918106868686?text=${encoded}`,
      "_blank"
    );
  };

  return (
    <section className="section">
      <div className="section-header">
        <h1 className="section-title">Get in Touch</h1>
        <p className="section-subtitle">
          Message us on WhatsApp or call us directly to plan your trip.
        </p>
      </div>

      <div className="contact-layout">

        {/* LEFT FORM */}
        <form className="card contact-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <label>Name</label>
            <input
              name="name"
              className="input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>WhatsApp Number</label>
            <input
              type="tel"
              name="phone"
              className="input"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Your City / Place</label>
            <input
              name="place"
              className="input"
              value={form.place}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn">
            Send WhatsApp Enquiry
          </button>

          {/* CALL BUTTON */}
          <a
            href="tel:+918106868686"
            className="btn secondary"
            style={{ marginTop: "10px", display: "block", textAlign: "center" }}
          >
            Call Now
          </a>

        </form>

        {/* RIGHT SIDE INFO */}
        <div className="card contact-info">

          <iframe
            title="Location"
            src="https://www.google.com/maps?q=Manjeera%20Trinity%20Corporate%20KPHB%20Hyderabad&output=embed"
            width="100%"
            height="220"
            style={{ border: 0, borderRadius: "12px" }}
            loading="lazy"
          ></iframe>

          <div className="contact-details">

            <h3>Address</h3>
            <p>
              M/S Trinity Work Hub at Unit No 1012,<br />
              10th Floor Manjeera Trinity Corporate,<br />
              Beside Lulu Hypermarket KPHB Phase-3,<br />
              Hyderabad, Telangana 500072, India
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
              <a href="tel:+918106868686">+91 8106868686</a><br />
              <a href="tel:+918978903318">+91 8978903318</a>
            </p>

            <h3>Business Hours</h3>
            <p>
              Monday - Friday: 9:00 AM - 7:00 PM<br />
              Saturday: 10:00 AM - 5:00 PM<br />
              Sunday: Closed
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;