import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { Wind, Thermometer, Droplets, ArrowRight } from 'lucide-react';

const COMPARE_DATA = [
  { city: "Rewa", aqi: 78, risk: "MODERATE", temp: 28, hum: 65, wind: 12, pm25: 35.4, pm10: 82.1, trend: "Improving" },
  { city: "Bhopal", aqi: 185, risk: "UNHEALTHY", temp: 31, hum: 45, wind: 8, pm25: 120.5, pm10: 190.2, trend: "Worsening" },
  { city: "Indore", aqi: 45, risk: "GOOD", temp: 26, hum: 70, wind: 15, pm25: 12.1, pm10: 30.5, trend: "Stable" }
];

export const Compare = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Compare Locations</h1>
          <p className="text-text-muted">Analyze environmental conditions across multiple cities.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">
          Add City
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max md:min-w-0 md:grid md:grid-cols-3">
          {COMPARE_DATA.map((data, idx) => (
            <GlassCard key={idx} className="w-72 md:w-auto flex-shrink-0 flex flex-col">
              <div className="text-center pb-6 border-b border-border mb-6">
                <h2 className="text-2xl font-bold mb-2">{data.city}</h2>
                <RiskBadge level={data.risk} />
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="text-center">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">AQI</span>
                  <span className={`text-5xl font-black ${
                    data.aqi < 50 ? 'text-emerald-500' : 
                    data.aqi < 100 ? 'text-amber-500' : 'text-red-500'
                  }`}>{data.aqi}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface/50 p-3 rounded-xl border border-border text-center">
                    <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">PM2.5</span>
                    <span className="font-bold">{data.pm25}</span>
                  </div>
                  <div className="bg-surface/50 p-3 rounded-xl border border-border text-center">
                    <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">PM10</span>
                    <span className="font-bold">{data.pm10}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center gap-2 text-text-muted"><Thermometer size={16}/> Temp</div>
                    <span>{data.temp}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center gap-2 text-text-muted"><Droplets size={16}/> Humidity</div>
                    <span>{data.hum}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center gap-2 text-text-muted"><Wind size={16}/> Wind</div>
                    <span>{data.wind} km/h</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm">
                <span className="font-semibold text-text-muted">Trend</span>
                <span className={`font-bold ${
                  data.trend === 'Improving' ? 'text-emerald-500' : 
                  data.trend === 'Worsening' ? 'text-red-500' : 'text-blue-500'
                }`}>{data.trend}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
