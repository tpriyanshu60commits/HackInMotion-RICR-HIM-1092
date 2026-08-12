import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Leaf, 
  MapPin, 
  BarChart3, 
  Bell, 
  User, 
  Menu, 
  X,
  Navigation as NavIcon,
  Sun,
  Moon,
  Droplets,
  Wind,
  Activity,
  Users
} from 'lucide-react';
import { cn } from '../components/common/GlassCard';

const THEMES = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
  { id: 'nature', icon: Leaf, label: 'Nature' },
  { id: 'ocean', icon: Droplets, label: 'Ocean' },
];

const NAV_ITEMS = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/history', icon: Activity, label: 'History' },
  { to: '/compare', icon: Wind, label: 'Compare' },
  { to: '/route', icon: NavIcon, label: 'Route Risk' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const MainLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex text-text-main">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 glass border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400 font-heading font-bold text-xl">
            <Leaf className="text-primary-500" size={28} />
            <span>VerdantX</span>
          </div>
          <button 
            className="lg:hidden text-text-muted hover:text-text-main"
            onClick={() => setMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-inner" 
                  : "text-text-muted hover:bg-surface-hover hover:text-text-main"
              )}
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Theme Switcher */}
        <div className="p-4 border-t border-border mt-auto">
          <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-3 px-2">Theme</p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTheme(t.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  theme === t.id 
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-surface hover:bg-surface-hover text-text-muted hover:text-text-main"
                )}
              >
                <t.icon size={16} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden glass border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-primary-600 font-bold">
            <Leaf size={24} />
            VerdantX
          </div>
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 bg-surface rounded-lg shadow-sm border border-border text-text-main"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full relative">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
