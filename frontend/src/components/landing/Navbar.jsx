import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Community', href: '#community' },
    { name: 'Blog', href: '#blog' },
    { name: 'About', href: '#about' },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'pt-2' : 'pt-6'} px-4 md:px-8`}>
      <nav className="max-w-7xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/15 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.25)] px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-emerald-500/20 p-1.5 rounded-full">
            <Leaf className="text-emerald-500" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg leading-tight">VerdantX</span>
            <span className="text-[10px] text-gray-300 leading-tight">Environmental Intelligence</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-white hover:text-emerald-400 font-medium transition-colors text-sm"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login" className="px-5 py-2 rounded-full border border-white text-white hover:bg-white/10 transition-colors font-medium text-sm">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-medium text-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-black/80 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 animate-fade-in-up">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-white font-medium hover:text-emerald-400 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-white/15 w-full my-2"></div>
          <Link to="/login" className="text-white font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          <Link to="/register" className="w-full text-center py-3 rounded-full bg-emerald-500 text-white font-medium mt-2" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
        </div>
      )}
    </div>
  );
};
