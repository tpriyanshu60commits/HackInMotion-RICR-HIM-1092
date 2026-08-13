import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, MapPin, ChevronRight, X, 
  CloudRain, Cloud, Sun, CloudFog 
} from 'lucide-react';

const INITIAL_LOCATIONS = [
  { id: 1, name: "New Delhi", country: "India", aqi: 2, status: "Good", temperature: 28, condition: "Light Rain", icon: 'CloudRain' },
  { id: 2, name: "Mumbai", country: "India", aqi: 68, status: "Moderate", temperature: 27, condition: "Cloudy", icon: 'Cloud' },
  { id: 3, name: "Bengaluru", country: "India", aqi: 35, status: "Good", temperature: 25, condition: "Sunny", icon: 'Sun' },
  { id: 4, name: "Kolkata", country: "India", aqi: 85, status: "Moderate", temperature: 29, condition: "Haze", icon: 'CloudFog' }
];

const WeatherIcon = ({ type, size = 20, className }) => {
  switch (type) {
    case 'CloudRain': return <CloudRain size={size} className={className} />;
    case 'Cloud': return <Cloud size={size} className={className} />;
    case 'Sun': return <Sun size={size} className={className} />;
    case 'CloudFog': return <CloudFog size={size} className={className} />;
    default: return <Cloud size={size} className={className} />;
  }
};

const getAqiStyle = (aqi) => {
  if (aqi <= 50) return { color: 'text-green-400', bg: 'bg-green-500/10', glow: 'shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]' };
  if (aqi <= 100) return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', glow: 'shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]' };
  if (aqi <= 150) return { color: 'text-orange-500', bg: 'bg-orange-500/10', glow: 'shadow-[inset_0_0_20px_rgba(249,115,22,0.1)]' };
  return { color: 'text-red-500', bg: 'bg-red-500/10', glow: 'shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]' };
};

const LocationCard = ({ loc }) => {
  const aqiStyle = getAqiStyle(loc.aqi);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
      }}
      whileHover={{ scale: 1.02, y: -3 }}
      className="group relative w-full rounded-[20px] bg-white/[0.04] backdrop-blur-[16px] border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.08] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out cursor-pointer overflow-hidden flex flex-col md:flex-row items-start md:items-center p-5 md:p-6 gap-4 md:gap-6"
    >
      {/* Subtle internal gradient/glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px] ${aqiStyle.glow}`}></div>

      {/* Location Icon */}
      <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-green-500/10 group-hover:border-green-500/20 group-hover:text-green-400 transition-all duration-300">
        <MapPin size={22} className="text-gray-400 group-hover:text-green-400 transition-colors" />
      </div>

      {/* Location Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white tracking-tight">{loc.name}</h3>
        <span className="text-sm text-gray-400 font-medium">{loc.country}</span>
      </div>

      {/* AQI Info */}
      <div className="flex flex-col md:items-center min-w-[120px]">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">AQI Status</span>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-black ${aqiStyle.color}`}>{loc.aqi}</span>
          <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${aqiStyle.bg} ${aqiStyle.color}`}>
            {loc.status}
          </span>
        </div>
      </div>

      {/* Weather Info */}
      <div className="flex flex-col md:items-end min-w-[120px]">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Weather</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">{loc.temperature}°C</span>
          <div className="flex items-center gap-1.5 text-gray-300 bg-white/[0.05] px-2 py-1 rounded-md border border-white/[0.05]">
            <WeatherIcon type={loc.icon} size={14} className="text-gray-400" />
            <span className="text-xs font-medium">{loc.condition}</span>
          </div>
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="hidden md:flex shrink-0 ml-2">
        <ChevronRight size={24} className="text-gray-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300 ease-in-out" />
      </div>
    </motion.div>
  );
};

const AddLocationModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-md bg-[#0A0F0D]/90 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-2xl pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Add Location</h2>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">City / Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tokyo" 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Country</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Japan" 
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                  Add Location
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export const Locations = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLocations = INITIAL_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase()) || 
    loc.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className="min-h-full relative px-2 lg:px-4 pb-10"
     style={{
  backgroundImage: `
    linear-gradient(
      rgba(1, 11, 7, 0.4),
      rgba(0, 0, 0, 0.4)
    ),
    url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop")
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
}}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white drop-shadow-md">Locations</h1>
          <p className="text-sm text-gray-400 font-medium">Monitor environmental conditions across your saved locations.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] rounded-full pl-11 pr-4 py-2.5 text-sm text-white outline-none focus:border-green-500/50 focus:bg-white/[0.06] transition-all placeholder:text-gray-500"
            />
          </div>

          {/* Add Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 hover:border-green-500/40 rounded-full font-bold transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            <Plus size={18} />
            Add Location
          </button>
        </div>
      </div>

      {/* Location Cards */}
      {filteredLocations.length > 0 ? (
        <motion.div 
          className="flex flex-col gap-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {filteredLocations.map(loc => (
            <LocationCard key={loc.id} loc={loc} />
          ))}
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full py-20 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/[0.05] rounded-[24px] backdrop-blur-md"
        >
          <div className="w-16 h-16 bg-white/[0.05] rounded-full flex items-center justify-center mb-4">
            <Search size={28} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No locations found</h3>
          <p className="text-gray-400 font-medium max-w-sm">
            We couldn't find any locations matching "{search}". Try searching for another city.
          </p>
        </motion.div>
      )}

      {/* Modal */}
      <AddLocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
