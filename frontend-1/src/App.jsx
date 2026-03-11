import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const App = () => (
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </main>
    <Footer />
    <ChatBot />
  </div>
);

export default App;
