import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';
import useStore from '../../store/useStore';
import logo from '../../assets/logo.png';

export default function Header() {
  const alerts = useStore((state) => state.alerts);
  const unreadCount = alerts?.filter(a => !a.read).length || 0;
  
  const location = useLocation();
  const isLanding = location.pathname === '/' || location.pathname === '/landing';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLanding) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLanding]);

  useEffect(() => {
    if (isLanding) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, location.hash, isLanding]);

  if (isLanding) {
    return (
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-surface/80 backdrop-blur-xl border-b border-border shadow-sm py-3' 
            : 'bg-surface/20 backdrop-blur-md border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="EcoGuard Logo" className="h-8 md:h-10 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              <li>
                <a href="#features" className="text-text-main font-medium hover:text-primary-600 transition-colors duration-200">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-text-main font-medium hover:text-primary-600 transition-colors duration-200">How It Works</a>
              </li>
              <li>
                <Link to="/education" className="text-text-main font-medium hover:text-primary-600 transition-colors duration-200">Education</Link>
              </li>
            </ul>
            
            <div className="flex items-center gap-6 border-l border-border pl-8">
              <Link to="/login" className="text-text-main font-medium hover:text-primary-600 transition-colors duration-200">Login</Link>
              <Link to="/register" className="px-6 py-2.5 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200">Get Started</Link>
            </div>
          </nav>

          <button 
            className="md:hidden p-2 -mr-2 text-text-main hover:text-primary-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-border shadow-lg animate-fade-in">
            <nav className="flex flex-col px-6 py-6 gap-4">
              <a href="#features" className="text-lg font-medium text-text-main hover:text-primary-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-lg font-medium text-text-main hover:text-primary-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
              <Link to="/education" className="text-lg font-medium text-text-main hover:text-primary-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Education</Link>
              <div className="h-px bg-border w-full my-2"></div>
              <Link to="/login" className="text-lg font-medium text-text-main hover:text-primary-600 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mt-2 w-full text-center py-3 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </nav>
          </div>
        )}
      </header>
    );
  }

  // Original Dashboard Header
  return (
    <header className="h-16 border-b border-border glass flex items-center justify-between px-4 md:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded-lg hover:bg-muted">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search locations..."
            className="pl-10 pr-4 py-2 rounded-full border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSelector />
        
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card"></span>
          )}
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-border shadow-sm flex items-center justify-center text-primary-foreground font-bold text-sm">
          U
        </div>
      </div>
    </header>
  );
}
