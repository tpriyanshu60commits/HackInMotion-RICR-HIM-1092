
import { cn } from '../../utils/utils';

export const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Pending':
        return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'In Review':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'Resolved':
        return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
      case 'Escalated':
        return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', pulsing: true };
      case 'CM Accepted':
        return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit', config.bg, config.text, config.border)}>
      {config.pulsing && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
      {status}
    </span>
  );
};
