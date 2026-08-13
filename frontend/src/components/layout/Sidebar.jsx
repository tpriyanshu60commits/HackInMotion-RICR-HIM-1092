import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Map, Navigation, AlertTriangle, Settings, Cloud, Droplet, Trash2, Zap, MapPin, Bell, FileText, Users, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import useStore from '../../store/useStore';
import logo from '../../assets/logo.png'; // Assuming there is a logo or we can just use an icon

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ai', label: 'Air Quality', icon: Cloud },
  { path: '/weather', label: 'Weather', icon: Cloud },
  { path: '/water', label: 'Water Quality', icon: Droplet },
  { path: '/waste', label: 'Waste Management', icon: Trash2 },
  { path: '/energy', label: 'Renewable Energy', icon: Zap },
  { path: '/map', label: 'Maps & Location', icon: MapPin },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/education', label: 'Education', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const user = useStore(state => state.user);

  return (
    <aside className="w-64 bg-white/[0.02] backdrop-blur-3xl border-r border-white/[0.05] flex-col hidden md:flex h-full">
      <div className="p-6 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 text-green-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
          VerdantX
        </h1>
        <p className="text-[10px] text-gray-400 mt-1 tracking-wider font-semibold">Environmental Intelligence</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto scrollbar-hide pb-4">
        {NAV_ITEMS.map((item) => {
          // Hardcoded Dashboard as active for this view, or matching path
          const isActive = item.path === '/' ? (location.pathname === '/' || location.pathname === '/dashboard') : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all border border-transparent",
                isActive 
                  ? "bg-[#142e23] border-[#204a37] text-white shadow-lg" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={clsx("w-4 h-4", isActive ? "text-green-400" : "text-gray-400")} />
              <span className="font-medium text-[13px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto mb-2">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 bg-[#142e23] flex items-center justify-center">
            {/* Real avatar or initial fallback */}
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-green-400 font-bold">{user?.name ? user.name[0] : 'A'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Arpit Gupta'}</p>
            <Link to="/profile" className="text-[10px] text-gray-400 hover:text-white transition-colors">View Profile</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
