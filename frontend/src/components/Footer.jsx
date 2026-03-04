import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-brand">Sangeetha Holidays</span>
          <span className="footer-copy">© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="footer-right">
          <span className="footer-tech">Live · Travel · Enjoy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
