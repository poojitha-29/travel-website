import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  isActive ? 'navbar-link-active' : 'navbar-link-muted';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-logo-mark">SH</div>
          <div>
            <div className="navbar-brand-name">Sangeetha Holidays Private Limited</div>
            <div className="navbar-brand-tagline">Curated journeys, made simple</div>
          </div>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/packages" className={navLinkClass}>Packages</NavLink>
          <NavLink to="/gallery" className={navLinkClass}>Gallery</NavLink>
          <NavLink to="/reviews" className={navLinkClass}>Reviews</NavLink>
          <NavLink to="/videos" className={navLinkClass}>About Us</NavLink>
          <NavLink to="/faq" className={navLinkClass}>FAQ</NavLink>
          <NavLink
  to="/pay-now"
  className={({ isActive }) =>
    `${isActive ? 'navbar-link-active' : ''} navbar-paynow`
  }
>
 🔒 Pay Now
</NavLink>

<NavLink
  to="/contact"
  className={({ isActive }) =>
    `${isActive ? 'navbar-link-active' : 'navbar-link-muted'} navbar-cta-link`
  }
>
  Contact
</NavLink>
         
                    <NavLink to="/refund-policy" className={navLinkClass}>Refund Policy</NavLink>
                              <NavLink to="/terms-and-conditions" className={navLinkClass}>Terms & Conditions </NavLink>


          

        </div>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      <div className={`navbar-mobile ${open ? 'navbar-mobile-open' : ''}`}>
        <div className="navbar-mobile-inner">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/packages', label: 'Packages' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/reviews', label: 'Reviews' },
            { to: '/videos', label: 'About Us' },
            { to: '/faq', label: 'FAQ' },
       { to: '/pay-now', label: 'Pay Now' },
            { to: '/contact', label: 'Contact' },
      
                  { to: '/refund-policy', label: 'Refund Policy' },
            { to: '/terms-and-conditions', label: 'Terms&Conditions' },

          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
