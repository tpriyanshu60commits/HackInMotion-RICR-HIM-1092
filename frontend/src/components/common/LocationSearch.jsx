import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import useStore from '../../store/useStore';
import { cn } from './GlassCard';

export const LocationSearch = ({ onLocationSelect, className }) => {
  const [query, setQuery] = useState('');
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
      if (query.length > 2) {
        setLoading(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`);
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error("Location search failed", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (loc) => {
    setQuery('');
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
        <div className="absolute left-3 text-text-muted">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location (e.g. London, Paris)..."
          className="w-full pl-10 pr-10 py-2.5 bg-surface backdrop-blur-md border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm placeholder-text-muted text-text-main transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 text-text-muted hover:text-text-main">
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto animate-fade-in-up">
          {results.map((loc) => (
            <button
              key={loc.place_id}
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-4 py-3 border-b border-border hover:bg-surface-hover flex items-start gap-3 transition-colors last:border-b-0"
            >
              <MapPin size={18} className="text-primary-500 mt-1 shrink-0" />
              <div>
                <div className="text-sm font-medium text-text-main line-clamp-1">{loc.display_name.split(',')[0]}</div>
                <div className="text-xs text-text-muted line-clamp-1">{loc.display_name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
