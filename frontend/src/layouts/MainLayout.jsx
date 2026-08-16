import { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  MapPin,
  User,
  Menu,
  X,
  Wind,
  Navigation as NavIcon,
  Activity,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

import useStore from '../store/useStore';
import { cn } from '../utils/utils';
import { WeatherBackground } from '../components/common/WeatherBackground';
import { ChatbotButton } from '../components/chat/ChatbotButton';
import { AlertToastContainer } from '../components/alerts/AlertToastContainer';

import { BottomNavMobile } from './BottomNavMobile';

const NAV_ITEMS = [
  { to: '/locations', icon: MapPin, label: 'Locations', tKey: 'locations' },
  { to: '/history', icon: Activity, label: 'History', tKey: 'history' },
  { to: '/compare', icon: Wind, label: 'Compare', tKey: 'compare' },
  { to: '/route', icon: NavIcon, label: 'Route Risk', tKey: 'routeRisk' },
  { to: '/education', icon: BookOpen, label: 'Education', tKey: 'education' },
];

export const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useStore((state) => state.user);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Sync i18n language with user preferences
  useEffect(() => {
    if (user?.preferences?.language) {
      i18n.changeLanguage(user.preferences.language);
    }
  }, [user?.preferences?.language, i18n]);

  const navItems =
    user?.role === 'admin'
      ? [...NAV_ITEMS, { to: '/admin', icon: User, label: 'Admin Panel', tKey: 'adminPanel' }]
      : NAV_ITEMS;

  return (
    <WeatherBackground>
      <div className="min-h-screen  w-full flex flex-col text-text-main overflow-x-hidden">
        {/* =====================================================
            TOP NAVBAR
        ====================================================== */}
        <header className="glass border-b border-border fixed top-2 z-[90] w-19/20 h-16 hidden md:flex items-center justify-between ms-10 mt-1 px-4 md:px-8 rounded-full">
          {/* Logo Section */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-white font-heading font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <Leaf className="text-green-500 shrink-0" size={28} />
            <span>VerdantX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex gap-2">
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
                  <item.icon
                    size={18}
                    className="transition-transform group-hover:scale-110 shrink-0"
                  />
                  <span className="text-xs">{t(`nav.${item.tKey}`, item.label)}</span>
                </NavLink>
              ))}
            </nav>

            {/* User Profile / Logout (Desktop) */}
            <div className="hidden xl:flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/report"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors text-sm shadow-lg shadow-green-500/20 mr-2"
                >
                  <AlertCircle size={16} />
                  <span>{t('nav.reportIssue', 'Report Issue')}</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold hover:bg-green-500/30 transition-colors overflow-hidden"
                  title="Account Settings"
                >
                  {user?.profileImage?.url ? (
                    <img
                      src={user.profileImage.url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    'A'
                  )}
                </Link>
              </motion.div>
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
          <div className="fixed inset-0 z-[100] xl:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 glass shadow-2xl flex flex-col h-full animate-fade-in">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <span className="font-bold text-lg text-white">{t('nav.menu', 'Menu')}</span>
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
                    <span>{t(`nav.${item.tKey}`, item.label)}</span>
                  </NavLink>
                ))}
              </div>

              <div className="p-4 border-t border-border flex flex-col gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/report"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-green-500/20"
                  >
                    <AlertCircle size={20} />
                    {t('nav.reportIssue', 'Report Issue')}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10"
                  >
                    <User size={20} />
                    {t('nav.accountSettings', 'Account Settings')}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <main className="flex-1 w-full relative mt-0 md:mt-20 scroll-smooth p-0 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:p-8 overflow-x-hidden">
      <AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{
      opacity: 0,
      scale: 0.88,
      rotateY: -18,
      rotateX: 5,
      x: 45,
      filter: 'blur(12px)',
    }}
    animate={{
      opacity: 1,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      x: 0,
      filter: 'blur(0px)',
    }}
    exit={{
      opacity: 0,
      scale: 0.92,
      rotateY: 18,
      rotateX: -5,
      x: -45,
      filter: 'blur(12px)',
    }}
    transition={{
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    }}
    style={{
      perspective: 1400,
      transformStyle: 'preserve-3d',
      transformOrigin: 'center center',
      willChange: 'transform, opacity, filter',
    }}
    className="relative w-full h-full"
  >
    {/* Butterfly Glow */}
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0.5, 1.2, 1.5],
      }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
      }}
      className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary-400/10 blur-3xl"
    />

    <Outlet />
  </motion.div>
</AnimatePresence>
        </main>

        {/* =====================================================
            LIVE ALERTS TOAST
        ====================================================== */}
        <AlertToastContainer />

        {/* =====================================================
            CHATBOT
        ====================================================== */}
        <ChatbotButton />

        {/* =====================================================
            MOBILE BOTTOM NAV
        ====================================================== */}
        <BottomNavMobile setMobileMenuOpen={setMobileMenuOpen} />
      </div>
    </WeatherBackground>
  );
};
