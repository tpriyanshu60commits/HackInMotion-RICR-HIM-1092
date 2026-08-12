import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Leaf, MapPin, BarChart3, Bell, User, Menu, X,
  Navigation as NavIcon, Sun, Moon, Droplets, Wind,
  Activity, Users, BookOpen, PanelLeftClose, PanelLeft, PanelLeftOpen
} from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../components/common/GlassCard';
import { WeatherBackground } from '../components/common/WeatherBackground';
import api from '../services/api';

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
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const sidebarWidth = useStore((state) => state.sidebarWidth); // 'minimized', 'compact', 'default'
  const setSidebarWidth = useStore((state) => state.setSidebarWidth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {} // ignore
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'admin' 
    ? [...NAV_ITEMS, { to: '/admin', icon: User, label: 'Admin Panel' }] 
    : NAV_ITEMS;

  const cycleSidebar = () => {
    if (sidebarWidth === 'default') setSidebarWidth('compact');
    else if (sidebarWidth === 'compact') setSidebarWidth('minimized');
    else setSidebarWidth('default');
  };

  return (
    <WeatherBackground>
      <div className="min-h-screen flex text-text-main w-full pb-16 md:pb-0"> {/* Padding bottom for mobile nav */}
        
        {/* Desktop Sidebar */}
        <nav className={cn(
          "hidden md:flex glass border-r border-border flex-col transition-all duration-300 ease-in-out z-40 sticky top-0 h-screen",
          sidebarWidth === 'default' ? 'w-64' : sidebarWidth === 'compact' ? 'w-48' : 'w-20'
        )}>
          {/* Logo Area */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400 font-heading font-bold text-xl overflow-hidden whitespace-nowrap">
              <Leaf className="text-primary-500 shrink-0" size={28} />
              {sidebarWidth !== 'minimized' && <span>VerdantX</span>}
            </div>
            {sidebarWidth !== 'minimized' && (
              <button onClick={cycleSidebar} className="text-text-muted hover:text-text-main shrink-0">
                {sidebarWidth === 'default' ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
              </button>
            )}
          </div>

          {/* Minimized toggle button when minimized */}
          {sidebarWidth === 'minimized' && (
            <div className="w-full flex justify-center mb-4">
              <button onClick={cycleSidebar} className="text-text-muted hover:text-text-main p-2">
                <PanelLeftOpen size={20} />
              </button>
            </div>
          )}

          {/* Nav Links */}
          <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-200 group relative",
                  sidebarWidth === 'minimized' ? 'justify-center px-0' : 'px-4',
                  isActive 
                    ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-inner" 
                    : "text-text-muted hover:bg-surface-hover hover:text-text-main"
                )}
                title={sidebarWidth === 'minimized' ? item.label : undefined}
              >
                <item.icon size={20} className="transition-transform group-hover:scale-110 shrink-0" />
                {sidebarWidth !== 'minimized' && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>

          {/* Theme Switcher & Logout */}
          <div className="p-3 border-t border-border mt-auto">
            {sidebarWidth !== 'minimized' && (
              <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2 px-1">Theme</p>
            )}
            <div className={cn(
              "grid gap-2 mb-4",
              sidebarWidth === 'default' ? 'grid-cols-2' : sidebarWidth === 'compact' ? 'grid-cols-2' : 'grid-cols-1'
            )}>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTheme(t.id)}
                  title={t.label}
                  className={cn(
                    "flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                    theme === t.id 
                      ? "bg-primary-500 text-white shadow-md"
                      : "bg-surface hover:bg-surface-hover text-text-muted hover:text-text-main"
                  )}
                >
                  <t.icon size={16} className="shrink-0" />
                  {sidebarWidth === 'default' && <span className="truncate">{t.label}</span>}
                </button>
              ))}
            </div>
            <button 
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors font-medium text-sm border border-red-500/20",
                sidebarWidth === 'minimized' ? 'px-0' : 'px-4'
              )}
              title={sidebarWidth === 'minimized' ? 'Logout' : undefined}
            >
              <User size={16} className="shrink-0" />
              {sidebarWidth !== 'minimized' && <span>Logout</span>}
            </button>
          </div>
        </nav>

        {/* Mobile Header (Hamburger for Secondary Actions) */}
        <header className="md:hidden glass border-b border-border p-4 flex items-center justify-between fixed top-0 w-full z-30">
          <div className="flex items-center gap-2 text-primary-600 font-bold">
            <Leaf size={24} />
            VerdantX
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 bg-surface rounded-lg shadow-sm border border-border text-text-main"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Slide-out Menu (Secondary routes) */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="absolute right-0 top-0 bottom-0 w-64 glass shadow-2xl p-4 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-text-muted hover:text-text-main"><X size={24}/></button>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                      isActive 
                        ? "bg-primary-500/10 text-primary-600 shadow-inner" 
                        : "text-text-muted hover:bg-surface-hover hover:text-text-main"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="pt-4 border-t border-border mt-auto">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-600 rounded-xl font-medium">Logout</button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Fixed Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full glass border-t border-border z-40 pb-safe">
          <div className="flex items-center justify-around p-2">
            {MOBILE_BOTTOM_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-primary-600 dark:text-primary-400" 
                    : "text-text-muted hover:text-text-main"
                )}
              >
                <item.icon size={20} className={cn("transition-transform", 'scale-110')} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 w-full relative mt-16 md:mt-0 h-full">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </WeatherBackground>
  );
};
