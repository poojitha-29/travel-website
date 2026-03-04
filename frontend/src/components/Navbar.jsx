import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `${isActive ? 'navbar-link-active' : 'navbar-link-muted'}`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-mark">SH</span>
          <div>
            <div className="navbar-text-title">Sangeetha Holidays</div>
            <div className="navbar-text-subtitle">Curated journeys, made simple</div>
          </div>
        </div>

        <div className="navbar-links">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/packages" className={navLinkClass}>
            Packages
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass}>
            Gallery
          </NavLink>
          <NavLink to="/reviews" className={navLinkClass}>
            Reviews
          </NavLink>
          <NavLink to="/videos" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/faq" className={navLinkClass}>
            FAQ
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </nav>

      <div className={`navbar-mobile ${open ? 'navbar-mobile-open' : ''}`}>
        <div className="navbar-mobile-inner">
          <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/packages" className={navLinkClass} onClick={() => setOpen(false)}>
            Packages
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass} onClick={() => setOpen(false)}>
            Gallery
          </NavLink>
          <NavLink to="/reviews" className={navLinkClass} onClick={() => setOpen(false)}>
            Reviews
          </NavLink>
          <NavLink to="/videos" className={navLinkClass} onClick={() => setOpen(false)}>
            Videos
          </NavLink>
          <NavLink to="/faq" className={navLinkClass} onClick={() => setOpen(false)}>
            FAQ
          </NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
            Admin
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
