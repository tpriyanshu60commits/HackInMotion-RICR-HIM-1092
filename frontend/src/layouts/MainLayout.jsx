import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Leaf,
  MapPin,
  BarChart3,
  Bell,
  User,
  Menu,
  X,
  Wind,
  Navigation as NavIcon,
  Activity,
  Users,
  BookOpen,
} from 'lucide-react';

import useStore from '../store/useStore';
import { cn } from '../components/common/GlassCard';
import { WeatherBackground } from '../components/common/WeatherBackground';
import { ChatbotButton } from '../components/chat/ChatbotButton';
import api from '../services/api';

const NAV_ITEMS = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/history', icon: Activity, label: 'History' },
  { to: '/compare', icon: Wind, label: 'Compare' },
  { to: '/route', icon: NavIcon, label: 'Route Risk' },
  { to: '/education', icon: BookOpen, label: 'Education' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
];

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Logout should continue even if API fails
    }
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'admin'
    ? [...NAV_ITEMS, { to: '/admin', icon: User, label: 'Admin Panel' }]
    : NAV_ITEMS;

  return (
    <WeatherBackground>
      <div className="min-h-screen w-full  flex flex-col text-text-main overflow-x-hidden bg-background">
        
        {/* =====================================================
            TOP NAVBAR
        ====================================================== */}
        <header className="glass border-b border-border fixed  top-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-8">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 text-white font-heading font-bold text-xl">
            <Leaf className="text-green-500 shrink-0" size={28} />
            <Link to="/">VerdantX</Link>
          </div>

          {/* Desktop Navigation */}
         <div className='flex gap-2'>
           <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 group border border-transparent',
                    isActive
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                  )
                }
              >
                <item.icon size={18} className="transition-transform group-hover:scale-110 shrink-0" />
                <span className="text-xs">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile / Logout (Desktop) */}
          <div className="hidden xl:flex items-center gap-4">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200',
                  isActive ? 'text-green-400' : 'text-gray-400 hover:text-white'
                )
              }
            >
              <User size={18} />
              <span className="text-sm">Profile</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-200 font-medium text-sm border border-red-500/20"
            >
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
         </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="xl:hidden p-2 text-text-main hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* =====================================================
            MOBILE/TABLET FULL-SCREEN MENU
        ====================================================== */}
        {mobileMenuOpen && (
          <div className="fixed  inset-0 z-50 xl:hidden">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 glass shadow-2xl flex flex-col h-full animate-fade-in">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <span className="font-bold text-lg text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-text-muted hover:text-text-main rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                        isActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'text-text-muted hover:bg-surface-hover hover:text-text-main'
                      )
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 mt-4',
                      isActive
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'text-text-muted hover:bg-surface-hover hover:text-text-main'
                    )
                  }
                >
                  <User size={20} />
                  <span>Profile</span>
                </NavLink>
              </div>

              <div className="p-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <main className="flex-1 w-full relative mt-10 scroll-smooth p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>

        {/* =====================================================
            CHATBOT
        ====================================================== */}
        <ChatbotButton />
      </div>
    </WeatherBackground>
  );
};