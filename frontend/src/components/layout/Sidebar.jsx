import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Map, Navigation, AlertTriangle, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ai', label: 'AI Assistant', icon: MessageSquare },
  { path: '/compare', label: 'City Compare', icon: Map },
  { path: '/route', label: 'Route Risk', icon: Navigation },
  { path: '/reports', label: 'Community', icon: AlertTriangle },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border glass flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          VerdantX
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted text-foreground/80 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted w-full transition-all text-foreground/80">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
