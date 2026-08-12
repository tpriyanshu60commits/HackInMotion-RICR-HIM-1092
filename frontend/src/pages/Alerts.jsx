import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Bell, ShieldAlert, ArrowUpRight, ArrowDownRight, Settings } from 'lucide-react';

const ALERTS = [
  {
    id: 1,
    type: 'HIGH_RISK',
    title: 'High Risk Alert',
    message: 'Bhopal air quality entered a high-risk zone (AQI > 200). Avoid outdoor activities.',
    location: 'Bhopal',
    time: '10 minutes ago',
    icon: ShieldAlert,
    color: 'text-red-500',
    bg: 'bg-red-500/10'
  },
  {
    id: 2,
    type: 'MODERATE',
    title: 'Air Quality Worsening',
    message: 'Rewa AQI increased significantly by 25 points in the last hour.',
    location: 'Rewa',
    time: '2 hours ago',
    icon: ArrowUpRight,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    id: 3,
    type: 'IMPROVED',
    title: 'Air Quality Improved',
    message: 'Indore air quality improved to GOOD. Safe for outdoor activities.',
    location: 'Indore',
    time: '5 hours ago',
    icon: ArrowDownRight,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  }
];

export const Alerts = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Alerts & Notifications</h1>
          <p className="text-text-muted">Real-time environmental warnings and updates.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass hover:bg-surface-hover rounded-xl text-sm font-semibold transition-colors">
          <Settings size={18} /> Preferences
        </button>
      </div>

      <div className="space-y-4">
        {ALERTS.map(alert => (
          <GlassCard key={alert.id} hover className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className={`shrink-0 w-12 h-12 rounded-full ${alert.bg} ${alert.color} flex items-center justify-center`}>
              <alert.icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg">{alert.title}</h3>
                <span className="text-xs font-semibold text-text-muted">{alert.time}</span>
              </div>
              <p className="text-text-muted text-sm mb-2">{alert.message}</p>
              <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-surface border border-border">
                {alert.location}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
