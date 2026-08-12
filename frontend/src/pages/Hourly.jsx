import React, { useState, useEffect } from 'react';
import { PageTransition } from '../components/common/PageTransition';
import { GlassCard } from '../components/common/GlassCard';
import { Clock, Sun, Moon, Shield, Activity } from 'lucide-react';
import { cn } from '../components/common/GlassCard';
import useStore from '../store/useStore';

const getAqiColor = (aqi) => {
  if (aqi <= 50) return 'bg-risk-good';
  if (aqi <= 100) return 'bg-risk-moderate';
  if (aqi <= 150) return 'bg-risk-unhealthy';
  return 'bg-risk-hazardous';
};

const getAqiTextColor = (aqi) => {
  if (aqi <= 50) return 'text-risk-good';
  if (aqi <= 100) return 'text-risk-moderate';
  if (aqi <= 150) return 'text-risk-unhealthy';
  return 'text-risk-hazardous';
};

export const Hourly = () => {
  const location = useStore((state) => state.location);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHourly = async () => {
      const lat = location?.lat || 28.6139;
      const lng = location?.lng || 77.2090;
      try {
        const res = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=us_aqi,pm2_5,pm10&timezone=auto&forecast_days=2`
        );
        const data = await res.json();
        if (data.hourly) {
          const items = data.hourly.time.map((time, idx) => ({
            time,
            hour: new Date(time).getHours(),
            aqi: data.hourly.us_aqi[idx] || 0,
            pm25: data.hourly.pm2_5[idx] || 0,
            pm10: data.hourly.pm10[idx] || 0,
          })).slice(0, 48);
          setHourlyData(items);
        }
      } catch (err) {
        console.error('Failed to fetch hourly data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHourly();
  }, [location]);

  const currentHour = new Date().getHours();
  const safeWindow = hourlyData.filter(h => h.aqi <= 50);
  const bestStart = safeWindow.length > 0 ? safeWindow[0] : null;

  return (
    <PageTransition>
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main drop-shadow-md">Hourly Forecast</h1>
          <p className="text-text-muted mt-1">24-hour air quality timeline with safe activity windows.</p>
        </div>

        {bestStart && (
          <GlassCard className="bg-risk-good/10 border-risk-good/30">
            <div className="flex items-center gap-3">
              <Shield className="text-risk-good" size={24} />
              <div>
                <h3 className="font-bold text-text-main">Safe Activity Window</h3>
                <p className="text-sm text-text-muted">
                  Best air quality starts at <span className="font-bold text-risk-good">{new Date(bestStart.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span> (AQI: {bestStart.aqi})
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-3 min-w-max">
            {hourlyData.slice(0, 24).map((item, idx) => {
              const isNow = item.hour === currentHour && idx < 24;
              const isDaytime = item.hour >= 6 && item.hour < 18;
              return (
                <div
                  key={idx}
                  className={cn(
                    "glass-inner rounded-2xl p-3 flex flex-col items-center gap-2 min-w-[72px] transition-all",
                    isNow && "ring-2 ring-primary-500 shadow-lg scale-105",
                    item.aqi <= 50 && "border-risk-good/20"
                  )}
                >
                  <span className="text-[10px] font-bold text-text-muted uppercase">
                    {isNow ? 'NOW' : `${item.hour}:00`}
                  </span>
                  {isDaytime ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white", getAqiColor(item.aqi))}>
                    {item.aqi}
                  </div>
                  <span className="text-[9px] text-text-muted font-medium">PM2.5: {item.pm25}</span>
                </div>
              );
            })}
          </div>
        </div>

        <GlassCard>
          <h3 className="font-bold mb-4 flex items-center gap-2 text-text-main">
            <Activity size={18} /> Next 24 Hours Detail
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {hourlyData.slice(0, 24).map((item, idx) => (
              <div key={idx} className="glass-inner rounded-xl p-3 text-center">
                <div className="text-xs font-bold text-text-muted mb-1">
                  {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </div>
                <div className={cn("text-2xl font-black", getAqiTextColor(item.aqi))}>{item.aqi}</div>
                <div className="text-[10px] text-text-muted mt-1">PM2.5: {item.pm25}</div>
                <div className="text-[10px] text-text-muted">PM10: {item.pm10}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
};
