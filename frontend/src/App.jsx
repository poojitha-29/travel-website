import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ChatBot from './components/ChatBot.jsx';
import Home from './pages/Home.jsx';
import Packages from './pages/Packages.jsx';
import PackageDetail from './pages/PackageDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import Reviews from './pages/Reviews.jsx';
import About from './pages/About.jsx';
import FAQ from './pages/FAQ.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';
import RefundPolicy from './pages/RefundPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import PayNow from "./pages/PayNow";
import PaymentResponse from "./pages/PaymentResponse";
import Records from "./pages/Records";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/videos" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
<Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/pay-now" element={<PayNow />} />
          <Route
  path="/payment-response"
  element={<PaymentResponse />}
/>
          <Route path="/records" element={<Records />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default App;
