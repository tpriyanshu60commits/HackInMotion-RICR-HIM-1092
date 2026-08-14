import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

import { cn } from '../../utils/utils';

export const LocationSearch = ({ onLocationSelect, className, initialQuery = '', retainSelection = false }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length > 2 && isTyping) {
        setLoading(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&accept-language=en`);
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error("Location search failed", error);
        } finally {
          setLoading(false);
        }
      } else if (!isTyping) {
        // If not typing (e.g. initial mount or after selection), ensure it doesn't open
        setIsOpen(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query, isTyping]);

  const handleSelect = (loc) => {
    const selectedName = loc.display_name.split(',')[0];
    setQuery(retainSelection ? selectedName : '');
    setIsTyping(false);
    setIsOpen(false);
    onLocationSelect({
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lon),
      name: loc.display_name
    });
  };

  return (
    <div className={cn("relative z-50", className)} ref={dropdownRef}>
      <div className="relative flex items-center w-full">
        <div className="absolute left-3 text-gray-400">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsTyping(true);
          }}
          placeholder="Search location (e.g. London, Paris)..."
          className="w-full pl-10 pr-10 py-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl focus:outline-none focus:border-white/30 shadow-sm placeholder-gray-500 text-white transition-all"
        />
        {query && (
          <button onClick={() => { setQuery(''); setIsTyping(true); }} className="absolute right-3 text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0F0D] border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden max-h-64 overflow-y-auto animate-fade-in-up z-[9999]">
          {results.map((loc) => (
            <button
              key={loc.place_id}
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-4 py-3 border-b border-white/10 hover:bg-white/10 focus:bg-white/10 focus:outline-none flex items-start gap-3 transition-colors last:border-b-0 cursor-pointer"
            >
              <MapPin size={18} className="text-green-400 mt-1 shrink-0" />
              <div>
                <div className="text-sm font-medium text-white line-clamp-1">{loc.display_name.split(',')[0]}</div>
                <div className="text-xs text-gray-300 line-clamp-1">{loc.display_name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
