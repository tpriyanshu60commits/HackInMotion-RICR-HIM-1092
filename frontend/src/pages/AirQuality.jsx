import React, { useState, useEffect } from 'react';
import { PageTransition } from '../components/common/PageTransition';
import { GlassCard } from '../components/common/GlassCard';
import { PollutantChip } from '../components/common/PollutantChip';
import { RiskBadge } from '../components/common/RiskBadge';
import { Activity, Info, Wind, Droplets, Thermometer } from 'lucide-react';
import { environmentService } from '../services/api';
import useStore from '../store/useStore';
import { WaterDropLoader } from '../components/common/WaterDropLoader';

const WHO_GUIDELINES = {
  'PM2.5': { limit: 15, desc: 'Fine particles that penetrate deep into lungs. Major cause of respiratory and cardiovascular disease.' },
  'PM10': { limit: 45, desc: 'Inhalable particles from dust, construction, roads. Aggravates asthma and bronchitis.' },
  'O₃': { limit: 100, desc: 'Ground-level ozone formed by sunlight reacting with pollutants. Triggers breathing difficulties.' },
  'NO₂': { limit: 25, desc: 'From vehicle exhaust and power plants. Inflames airways, worsens asthma.' },
  'SO₂': { limit: 40, desc: 'From burning fossil fuels. Causes respiratory irritation, acid rain precursor.' },
  'CO': { limit: 4000, desc: 'Colorless, odorless. Reduces oxygen delivery in blood. Dangerous indoors.' },
};

export const AirQuality = () => {
  const location = useStore((state) => state.location);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const lat = location?.lat || 28.6139;
      const lng = location?.lng || 77.2090;
      try {
        const res = await environmentService.getCurrentByCoords(lat, lng);
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch air quality', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [location]);

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><WaterDropLoader message="Analyzing pollutants..." /></div>;

  const pollutants = data ? [
    { name: 'PM2.5', value: data.pm25 },
    { name: 'PM10', value: data.pm10 },
    { name: 'O₃', value: data.o3 },
    { name: 'NO₂', value: data.no2 },
    { name: 'SO₂', value: data.so2 },
    { name: 'CO', value: data.co, unit: 'µg/m³' },
  ] : [];

  return (
    <PageTransition>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-main drop-shadow-md">Air Quality Deep Dive</h1>
            <p className="text-text-muted mt-1">Detailed pollutant breakdown with WHO guideline comparisons.</p>
          </div>
          {data && <RiskBadge level={data.risk?.riskLevel || 'UNKNOWN'} />}
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="text-center">
                <Activity size={20} className="mx-auto mb-2 text-text-muted" />
                <div className="text-sm font-bold text-text-muted mb-1">Overall AQI</div>
                <div className="text-5xl font-black text-text-main">{data.aqi}</div>
              </GlassCard>
              <GlassCard className="text-center">
                <Thermometer size={20} className="mx-auto mb-2 text-text-muted" />
                <div className="text-sm font-bold text-text-muted mb-1">Temperature</div>
                <div className="text-3xl font-black text-text-main">{data.temperature}°C</div>
              </GlassCard>
              <GlassCard className="text-center">
                <Droplets size={20} className="mx-auto mb-2 text-text-muted" />
                <div className="text-sm font-bold text-text-muted mb-1">Humidity</div>
                <div className="text-3xl font-black text-text-main">{data.humidity}%</div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {pollutants.map(p => (
                <PollutantChip key={p.name} name={p.name} value={p.value} unit={p.unit} />
              ))}
            </div>

            <h2 className="text-xl font-bold text-text-main mt-4">WHO Guideline Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pollutants.map(p => {
                const who = WHO_GUIDELINES[p.name];
                if (!who) return null;
                const pct = p.value ? Math.min(200, (p.value / who.limit) * 100) : 0;
                const exceeds = pct > 100;
                return (
                  <GlassCard key={p.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-text-main">{p.name}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${exceeds ? 'bg-risk-hazardous/15 text-risk-hazardous' : 'bg-risk-good/15 text-risk-good'}`}>
                        {exceeds ? 'Exceeds WHO' : 'Within WHO'}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{who.desc}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-text-muted">
                        <span>Current: {p.value ?? '--'} µg/m³</span>
                        <span>WHO: {who.limit} µg/m³</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2 relative overflow-hidden">
                        <div className={`h-2 rounded-full transition-all duration-700 ${exceeds ? 'bg-risk-hazardous' : 'bg-risk-good'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                        <div className="absolute top-0 h-2 w-0.5 bg-text-muted/50" style={{ left: '50%' }} title="WHO Limit" />
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};
