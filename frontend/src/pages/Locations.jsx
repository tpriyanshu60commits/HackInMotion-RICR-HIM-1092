import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { Search, MapPin, Navigation, Star, Plus } from 'lucide-react';

const SAVED_LOCATIONS = [
  { id: 1, name: "Home", city: "Rewa", aqi: 46, risk: "GOOD", temp: 28 },
  { id: 2, name: "Work", city: "Bhopal", aqi: 87, risk: "MODERATE", temp: 31 },
  { id: 3, name: "College", city: "Indore", aqi: 132, risk: "UNHEALTHY", temp: 29 },
];

export const Locations = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-text-muted mt-1">Manage and monitor air quality across your places.</p>
        </div>
      </div>

      <GlassCard className="p-2">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search city, area, or zip code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface/50 border border-border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium placeholder:text-text-muted/60"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20 rounded-xl font-semibold transition-colors">
            <Navigation size={18} />
            Use Current Location
          </button>
        </div>
      </GlassCard>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="text-yellow-500" size={20} /> Saved Locations
          </h2>
          <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
            <Plus size={16} /> Add New
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAVED_LOCATIONS.map(loc => (
            <GlassCard key={loc.id} hover className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{loc.name}</h3>
                  <div className="flex items-center gap-1 text-text-muted text-sm mt-0.5">
                    <MapPin size={14} />
                    {loc.city}
                  </div>
                </div>
                <RiskBadge level={loc.risk} />
              </div>
              <div className="mt-auto pt-4 border-t border-border flex justify-between items-end">
                <div>
                  <span className="text-sm font-semibold text-text-muted">AQI</span>
                  <div className="text-3xl font-black">{loc.aqi}</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-text-muted">Temp</span>
                  <div className="text-xl font-bold">{loc.temp}°C</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
