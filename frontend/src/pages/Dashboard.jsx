import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { WaterDropLoader } from '../components/common/WaterDropLoader';
import { MapPin, Wind, Droplets, Thermometer, CloudRain, Activity, Info, CheckCircle2 } from 'lucide-react';

// Mock API Call
const fetchDashboardData = () => new Promise(resolve => {
  setTimeout(() => resolve({
    location: "Rewa, Madhya Pradesh",
    aqi: 78,
    riskLevel: "MODERATE",
    riskScore: 42,
    weather: { temp: 28, humidity: 65, wind: 12, condition: "Partly Cloudy" },
    pollutants: { pm25: 35.4, pm10: 82.1, o3: 45, no2: 22 },
    guidance: [
      "Outdoor activities are generally acceptable.",
      "Unusually sensitive people should consider reducing prolonged outdoor exertion.",
      "Keep windows open for ventilation during afternoon."
    ]
  }), 1500);
});

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh]">
      <WaterDropLoader message="Analyzing local atmosphere..." />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <div className="flex items-center gap-2 text-text-muted font-medium bg-surface/50 inline-flex px-3 py-1.5 rounded-full border border-border backdrop-blur-sm">
            <MapPin size={18} className="text-primary-500" />
            {data.location}
          </div>
        </div>
        <RiskBadge level={data.riskLevel} className="scale-110 origin-left md:origin-right" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main AQI Card */}
        <GlassCard className="col-span-1 md:col-span-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-surface to-surface-hover">
          <div className="absolute -right-12 -top-12 opacity-10 dark:opacity-20 pointer-events-none">
            <Activity size={240} />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10 mb-8">
            <div>
              <h2 className="text-text-muted font-semibold uppercase tracking-wider text-sm mb-1">Current Air Quality Index</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl md:text-7xl font-black text-amber-500 tracking-tighter">{data.aqi}</span>
                <span className="text-xl font-bold text-text-muted">AQI</span>
              </div>
            </div>
            
            <div className="bg-surface/80 rounded-2xl p-4 border border-border min-w-[200px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Risk Score</span>
                <span className="text-sm font-bold text-amber-500">{data.riskScore}/100</span>
              </div>
              <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${data.riskScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 z-10">
            <h3 className="font-bold flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400">
              <Info size={18} /> What should you do?
            </h3>
            <ul className="space-y-2">
              {data.guidance.map((guide, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm font-medium text-amber-900/80 dark:text-amber-200/80">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-amber-500" />
                  {guide}
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>

        {/* Weather Card */}
        <GlassCard className="col-span-1 md:col-span-4 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-text-muted">
            <CloudRain size={20} /> Current Conditions
          </h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-surface/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
              <Thermometer className="text-orange-500 mb-2" size={28} />
              <span className="text-2xl font-bold">{data.weather.temp}°C</span>
              <span className="text-xs text-text-muted font-medium uppercase mt-1">Temperature</span>
            </div>
            <div className="bg-surface/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
              <Droplets className="text-blue-500 mb-2" size={28} />
              <span className="text-2xl font-bold">{data.weather.humidity}%</span>
              <span className="text-xs text-text-muted font-medium uppercase mt-1">Humidity</span>
            </div>
            <div className="bg-surface/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center col-span-2">
              <Wind className="text-teal-500 mb-2" size={28} />
              <span className="text-2xl font-bold">{data.weather.wind} km/h</span>
              <span className="text-xs text-text-muted font-medium uppercase mt-1">Wind Speed • {data.weather.condition}</span>
            </div>
          </div>
        </GlassCard>

        {/* Pollutants Breakdown */}
        <div className="col-span-1 md:col-span-12">
          <h3 className="text-lg font-bold mb-4 ml-1">Key Pollutants</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'PM2.5', value: data.pollutants.pm25, unit: 'µg/m³', color: 'text-rose-500' },
              { label: 'PM10', value: data.pollutants.pm10, unit: 'µg/m³', color: 'text-amber-500' },
              { label: 'O3', value: data.pollutants.o3, unit: 'ppb', color: 'text-blue-500' },
              { label: 'NO2', value: data.pollutants.no2, unit: 'ppb', color: 'text-purple-500' }
            ].map((p, idx) => (
              <GlassCard key={idx} hover className="flex flex-col justify-between">
                <span className="text-sm font-semibold text-text-muted mb-2">{p.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${p.color}`}>{p.value}</span>
                  <span className="text-xs font-medium text-text-muted">{p.unit}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
