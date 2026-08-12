import useStore from '../../store/useStore';
import { clsx } from 'clsx';
import { Moon, Sun, Leaf, Droplets } from 'lucide-react';

const THEMES = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
  { id: 'nature', icon: Leaf, label: 'Nature' },
  { id: 'ocean', icon: Droplets, label: 'Ocean' },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useStore();

  return (
    <div className="flex items-center bg-muted/50 p-1 rounded-full border border-border">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          className={clsx(
            "p-1.5 rounded-full transition-all",
            theme === t.id 
              ? "bg-background shadow-sm text-primary" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <t.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
