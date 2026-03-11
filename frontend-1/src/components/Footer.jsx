import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-main">
      <div>
        <div className="footer-logo-mark">SH</div>
        <span className="footer-brand-name">Sangeetha Holidays</span>
        <p className="footer-brand-desc">
          Crafting personalised travel experiences since 2017. From Bali honeymoons to Europe adventures — we make every journey unforgettable.
        </p>
        <div className="footer-social">
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

      <div className="footer-col">
        <h4>Explore</h4>
        <ul>
          <li><Link to="/packages">All Packages</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/reviews">Reviews</Link></li>
          <li><Link to="/videos">About Us</Link></li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Support</h4>
        <ul>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><a href="https://wa.me/918106868686" target="_blank" rel="noreferrer">WhatsApp Us</a></li>
          <li><a href="tel:+918106868686">Call Us</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:+918106868686">+91 81068 68686</a></li>
          <li><a href="tel:+918978903318">+91 89789 03318</a></li>
          <li style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.82rem', lineHeight: 1.6 }}>
            KPHB Phase-3,<br />Hyderabad, TS 500072
          </li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom">
      <span className="footer-copy">© {new Date().getFullYear()} Sangeetha Holidays. All rights reserved.</span>
      <span className="footer-tagline">Live · Travel · Enjoy</span>
    </div>
  </footer>
);

export default Footer;
