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
  Droplets,
  Activity,
  Users,
  BookOpen,
  PanelLeftClose,
  PanelLeft,
  PanelLeftOpen,
} from 'lucide-react';

import useStore from '../store/useStore';
import { cn } from '../components/common/GlassCard';
import { WeatherBackground } from '../components/common/WeatherBackground';
import api from '../services/api';

// IMPORTANT:
// Agar ChatbotButton kisi separate file mein hai,
// to yahan uska correct path import karo.
// Example:
// import { ChatbotButton } from '../components/common/ChatbotButton';

const NAV_ITEMS = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/history', icon: Activity, label: 'History' },
  { to: '/compare', icon: Wind, label: 'Compare' },
  { to: '/route', icon: NavIcon, label: 'Route Risk' },
  { to: '/education', icon: BookOpen, label: 'Education' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const MOBILE_BOTTOM_NAV = [
  { to: '/dashboard', icon: BarChart3, label: 'Home' },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const sidebarWidth = useStore(
    (state) => state.sidebarWidth
  );

  const setSidebarWidth = useStore(
    (state) => state.setSidebarWidth
  );

  const navigate = useNavigate();

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Logout should continue even if API fails
    }

    logout();
    navigate('/login');
  };

  // -----------------------------
  // ADMIN NAVIGATION
  // -----------------------------
  const navItems =
    user?.role === 'admin'
      ? [
        ...NAV_ITEMS,
        {
          to: '/admin',
          icon: User,
          label: 'Admin Panel',
        },
      ]
      : NAV_ITEMS;

  // -----------------------------
  // SIDEBAR WIDTH
  // -----------------------------
  const cycleSidebar = () => {
    if (sidebarWidth === 'default') {
      setSidebarWidth('compact');
    } else if (sidebarWidth === 'compact') {
      setSidebarWidth('minimized');
    } else {
      setSidebarWidth('default');
    }
  };

  return (
    <WeatherBackground>
      <div className="h-screen w-full flex text-text-main overflow-hidden bg-background">

        {/* =====================================================
            DESKTOP SIDEBAR
        ====================================================== */}
        <nav
          className={cn(
            'hidden md:flex glass border-r border-border flex-col transition-all duration-300 ease-in-out z-40 h-full flex-shrink-0',
            sidebarWidth === 'default'
              ? 'w-64'
              : sidebarWidth === 'compact'
                ? 'w-48'
                : 'w-20'
          )}
        >

          {/* ================= LOGO ================= */}
          <div
            className={cn(
              'flex items-center justify-between border-b border-white/10 mb-4',
              sidebarWidth === 'minimized'
                ? 'p-4 justify-center'
                : 'p-6'
            )}
          >
            <div
              className={cn(
                'flex items-center gap-3 text-white font-heading font-bold text-xl overflow-hidden whitespace-nowrap',
                sidebarWidth === 'minimized'
                  ? 'justify-center'
                  : ''
              )}
            >
              <Leaf
                className="text-green-500 shrink-0"
                size={28}
              />

              {sidebarWidth !== 'minimized' && (
                <Link to="/">
                  VerdantX
                </Link>
              )}
            </div>

            {sidebarWidth !== 'minimized' && (
              <button
                onClick={cycleSidebar}
                className="text-text-muted hover:text-text-main shrink-0 transition-colors"
                aria-label="Resize sidebar"
              >
                {sidebarWidth === 'default' ? (
                  <PanelLeftClose size={20} />
                ) : (
                  <PanelLeft size={20} />
                )}
              </button>
            )}
          </div>

          {/* ================= MINIMIZED TOGGLE ================= */}
          {sidebarWidth === 'minimized' && (
            <div className="w-full flex justify-center mb-4">
              <button
                onClick={cycleSidebar}
                className="text-text-muted hover:text-text-main p-2 transition-colors"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen size={20} />
              </button>
            </div>
          )}

          {/* ================= NAVIGATION ================= */}
          <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto overflow-x-hidden">

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 py-3 rounded-full font-medium transition-all duration-200 group relative border border-transparent',

                    sidebarWidth === 'minimized'
                      ? 'justify-center px-0'
                      : 'px-4',

                    isActive
                      ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[inset_0_1px_4px_rgba(34,197,94,0.1)]'
                      : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                  )
                }
                title={
                  sidebarWidth === 'minimized'
                    ? item.label
                    : undefined
                }
              >
                <item.icon
                  size={20}
                  className="transition-transform group-hover:scale-110 shrink-0"
                />

                {sidebarWidth !== 'minimized' && (
                  <span className="truncate">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}

          </div>

          {/* ================= LOGOUT ================= */}
          <div className="p-3 border-t border-border mt-auto">
            <button
              onClick={handleLogout}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-200 font-medium text-sm border border-red-500/20',

                sidebarWidth === 'minimized'
                  ? 'px-0'
                  : 'px-4'
              )}
              title={
                sidebarWidth === 'minimized'
                  ? 'Logout'
                  : undefined
              }
            >
              <User
                size={16}
                className="shrink-0"
              />

              {sidebarWidth !== 'minimized' && (
                <span>Logout</span>
              )}
            </button>
          </div>
        </nav>

        {/* =====================================================
            MOBILE HEADER
        ====================================================== */}
        <header className="md:hidden glass border-b border-border p-4 flex items-center justify-between fixed top-0 left-0 w-full z-30">

          <div className="flex items-center gap-2 text-primary-600 font-bold">
            <Leaf size={24} />
            <span>VerdantX</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 bg-surface rounded-lg shadow-sm border border-border text-text-main"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

        </header>

        {/* =====================================================
            MOBILE SLIDE MENU
        ====================================================== */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute right-0 top-0 bottom-0 w-64 glass shadow-2xl p-4 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Menu Header */}
              <div className="flex justify-between items-center mb-8">

                <span className="font-bold text-lg">
                  Menu
                </span>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-text-muted hover:text-text-main"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>

              </div>

              {/* Mobile Links */}
              <div className="flex-1 space-y-2 overflow-y-auto">

                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group',

                        isActive
                          ? 'bg-primary-500/10 text-primary-600 shadow-inner'
                          : 'text-text-muted hover:bg-surface-hover hover:text-text-main'
                      )
                    }
                  >
                    <item.icon size={20} />

                    <span>
                      {item.label}
                    </span>
                  </NavLink>
                ))}

              </div>

              {/* Mobile Logout */}
              <div className="pt-4 border-t border-border mt-auto">

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors"
                >
                  <User size={18} />
                  Logout
                </button>

              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MOBILE BOTTOM NAV
        ====================================================== */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full glass border-t border-border z-40 pb-safe">

          <div className="flex items-center justify-around p-2">

            {MOBILE_BOTTOM_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-all duration-200',

                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-text-muted hover:text-text-main'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      className={cn(
                        'transition-transform',
                        isActive
                          ? 'scale-110'
                          : 'scale-100'
                      )}
                    />

                    <span className="text-[10px] font-medium">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}

          </div>
        </nav>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <main
          className="
            flex-1
            min-w-0
            h-full
            overflow-y-auto
            overflow-x-hidden
            p-4
            pt-20
            pb-20
            md:p-8
            md:pb-8
            relative
            scroll-smooth
            transition-all
            duration-300
          "
        >
          {/* IMPORTANT:
              max-w-7xl removed so content uses
              ALL remaining width after sidebar.
          */}
          <div className="w-full min-h-full">
            <Outlet />
          </div>
        </main>

        {/* =====================================================
            CHATBOT
        ====================================================== */}

        {/* 
          If ChatbotButton component exists, import it above:

          import { ChatbotButton } 
            from '../components/common/ChatbotButton';

          Then uncomment:

          <ChatbotButton />

          If it does NOT exist, keep this commented for now.
        */}

      </div>
    </WeatherBackground>
  );
};