import { Bell, Search, Menu } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import useStore from '../../store/useStore';

export default function Header() {
  const alerts = useStore((state) => state.alerts);
  const unreadCount = alerts.filter(a => !a.read).length;

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
