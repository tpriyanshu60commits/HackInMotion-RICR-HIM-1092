import { cn } from '../../utils/utils';
import { ShieldAlert, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

const RISK_LEVELS = {
  GOOD: {
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: CheckCircle,
  },
  MODERATE: {
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: AlertTriangle,
  },
  UNHEALTHY: {
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: AlertOctagon,
  },
  HIGH_RISK: {
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: ShieldAlert,
  },
  HAZARDOUS: {
    color: 'text-purple-600',
    bg: 'bg-purple-600/10',
    border: 'border-purple-600/20',
    icon: ShieldAlert,
  },
};

export const RiskBadge = ({ level = 'GOOD', className }) => {
  const config = RISK_LEVELS[level] || RISK_LEVELS.GOOD;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold tracking-wide shadow-sm backdrop-blur-md',
        config.color,
        config.bg,
        config.border,
        className
      )}
    >
      <Icon size={16} />
      <span>{level.replace('_', ' ')}</span>
    </div>
  );
};
