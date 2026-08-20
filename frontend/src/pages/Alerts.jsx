import { useState, useEffect } from 'react';
import { ShieldAlert, ArrowUpRight, ArrowDownRight, Settings, MapPin } from 'lucide-react';
import { alertService } from '../services/api';

export const Alerts = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filters = ['All', 'Air Quality', 'Weather', 'Water Quality', 'Waste'];

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const res = await alertService.getAlerts();
        setAlerts(res.data.data || []);
      } catch (err) {
        console.error('Alert fetch error:', err);
        setError('Failed to load alerts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getAlertStyles = (type) => {
    switch (type) {
      case 'high-risk':
        return {
          icon: ShieldAlert,
          color: 'text-red-400',
          bg: 'bg-red-500/15',
          border: 'border-red-500/20',
          shadow: 'shadow-[0_0_18px_rgba(239,68,68,0.12)]',
          label: 'HIGH RISK',
        };
      case 'moderate-risk':
        return {
          icon: ArrowUpRight,
          color: 'text-amber-400',
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/20',
          shadow: 'shadow-[0_0_18px_rgba(245,158,11,0.12)]',
          label: 'MODERATE',
        };
      case 'forecast':
        return {
          icon: ArrowUpRight,
          color: 'text-blue-400',
          bg: 'bg-blue-500/15',
          border: 'border-blue-500/20',
          shadow: 'shadow-[0_0_18px_rgba(59,130,246,0.12)]',
          label: 'FORECAST',
        };
      case 'improvement':
        return {
          icon: ArrowDownRight,
          color: 'text-green-400',
          bg: 'bg-green-500/15',
          border: 'border-green-500/20',
          shadow: 'shadow-[0_0_18px_rgba(34,197,94,0.12)]',
          label: 'IMPROVED',
        };
      default:
        return {
          icon: ShieldAlert,
          color: 'text-gray-400',
          bg: 'bg-gray-500/15',
          border: 'border-gray-500/20',
          shadow: 'shadow-[0_0_18px_rgba(156,163,175,0.12)]',
          label: 'ALERT',
        };
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-full relative px-4 lg:px-8 py-8 animate-fade-in flex flex-col items-center">
      {/* Massive Main Glass Panel */}
      <div className="w-full max-w-[1400px] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-1">
              Alerts
            </h1>
            <p className="text-sm text-gray-400">Environmental alerts and important conditions</p>
          </div>

          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] text-gray-300 rounded-xl text-sm font-semibold transition-all duration-300">
            <Settings size={18} /> Preferences
          </button>
        </div>

        {/* Horizontal Category Filters */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-8 border-b border-white/[0.05] pb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-green-400/15 border border-green-400/20 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.08)]'
                  : 'bg-white/[0.025] border border-transparent text-gray-400 hover:bg-white/[0.06] hover:text-white hover:border-white/[0.08]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-8">{error}</div>
          ) : alerts.length > 0 ? (
            alerts.map((alert) => {
              const styles = getAlertStyles(alert.type);
              const AlertIcon = styles.icon;
              return (
                <div
                  key={alert._id}
                  className={`w-full min-h-[115px] bg-white/[0.035] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.055] hover:border-white/[0.15] hover:-translate-y-[2px] transition-all duration-300 ease-out rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-5 md:items-center group ${!alert.read ? 'border-l-4 border-l-green-500' : ''}`}
                >
                  {/* Left: Icon */}
                  <div
                    className={`shrink-0 w-14 h-14 rounded-2xl ${styles.bg} border ${styles.border} ${styles.shadow} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    <AlertIcon size={26} className={styles.color} />
                  </div>

                  {/* Center: Content */}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-semibold text-base md:text-lg text-white mb-1.5">
                      {alert.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2.5 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400">
                      <MapPin size={14} className="text-gray-500" />
                      <span className="truncate">
                        {alert.location?.city || alert.location?.name || 'Unknown Location'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status & Time */}
                  <div className="md:text-right shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.05]">
                    <span
                      className={`text-sm font-bold tracking-wide uppercase mb-0 md:mb-1.5 ${styles.color}`}
                    >
                      {styles.label}
                    </span>
                    <span className="text-xs text-gray-400">{formatTime(alert.createdAt)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full bg-white/[0.02] backdrop-blur-md border border-white/[0.04] rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <ShieldAlert size={32} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Alerts</h3>
              <p className="text-sm text-gray-400">There are no active environmental alerts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
