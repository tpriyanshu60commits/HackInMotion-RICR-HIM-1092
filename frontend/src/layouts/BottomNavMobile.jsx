
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Menu as MenuIcon, Settings } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/utils';

export const BottomNavMobile = ({ setMobileMenuOpen }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { id: 'home', to: '/dashboard', icon: Home, label: t('nav.home', 'Home') },
    { id: 'menu', isAction: true, icon: MenuIcon, label: t('nav.menu', 'Menu') },
    { id: 'settings', to: '/profile', icon: Settings, label: t('nav.settings', 'Settings') },
  ];

  return (
    <div className="bottom-nav-mobile md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-[env(safe-area-inset-bottom)] pt-2 mb-2">
      <div className="glass border border-border/50 rounded-2xl flex items-center justify-around h-16 px-2 shadow-2xl backdrop-blur-md bg-background/60">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to ? location.pathname.startsWith(item.to) : false;

          const content = (
            <>
              <motion.div
                variants={{
                  active: { 
                    y: shouldReduceMotion ? 0 : -5, 
                    scale: shouldReduceMotion ? 1 : 1.1 
                  },
                  inactive: { y: 0, scale: 1 },
                  tap: { 
                    y: shouldReduceMotion ? 0 : -5, 
                    scale: shouldReduceMotion ? 1 : 1.05 
                  }
                }}
                initial="inactive"
                animate={isActive ? 'active' : 'inactive'}
                whileTap="tap"
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={cn(
                  "p-2 rounded-xl transition-colors duration-200",
                  isActive ? "bg-green-500/20 text-green-400" : "text-text-muted",
                  item.isAction && "bg-white/5 text-white/90 p-3 rounded-full"
                )}
              >
                <item.icon size={item.isAction ? 24 : 20} strokeWidth={2} />
              </motion.div>
              <span className={cn(
                "text-[10px] font-medium mt-1 transition-colors duration-200",
                isActive ? "text-green-400" : "text-text-muted"
              )}>
                {item.label}
              </span>
            </>
          );

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={() => setMobileMenuOpen(true)}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                {content}
              </button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.to}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              {content}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
