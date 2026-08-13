import { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';

import { WaterDropLoader } from '../components/common/WaterDropLoader';
import { LocationSearch } from '../components/common/LocationSearch';
import {
  MapPin, Wind, Droplets, Thermometer, CloudRain, Activity,
  CheckCircle2, Sunrise, Gauge, Sun, Search,
  AlertTriangle, AlertCircle, AlertOctagon
} from 'lucide-react';
import { NotificationDropdown } from '../components/common/NotificationDropdown';
import { environmentService } from '../services/api';
import useStore from '../store/useStore';
import { resolveBackground } from '../utils/resolveBackground';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const getAqiStatus = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-500', icon: CheckCircle2, desc: 'Air quality is satisfactory and poses little or no risk.' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-500', icon: AlertTriangle, desc: 'Air quality is acceptable; however, there may be a moderate health concern for a very small number of people.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-500', icon: AlertCircle, desc: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-500', icon: AlertCircle, desc: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-500', icon: AlertOctagon, desc: 'Health warnings of emergency conditions. The entire population is more likely to be affected.' };
  return { label: 'Hazardous', color: 'text-rose-900', icon: AlertOctagon, desc: 'Health alert: everyone may experience more serious health effects.' };
};

const getUvStatus = (uv) => {
  if (uv <= 2) return { label: 'Low', color: 'text-green-500', bg: 'bg-green-500' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-500', bg: 'bg-orange-500' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-500', bg: 'bg-red-500' };
  return { label: 'Extreme', color: 'text-purple-500', bg: 'bg-purple-500' };
};

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const setLocation = useStore((state) => state.setLocation);
  const location = useStore((state) => state.location);
  const setWeatherCondition = useStore((state) => state.setWeatherCondition);
  const setIsDay = useStore((state) => state.setIsDay);
  const setCurrentAQI = useStore((state) => state.setCurrentAQI);
  const user = useStore(state => state.user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  };
  useEffect(() => {
    const fetchEnvData = async (lat, lng) => {
      setLoading(true);
      setError('');
      try {
        const [currentRes, forecastRes] = await Promise.all([
          environmentService.getCurrentByCoords(lat, lng),
          fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=us_aqi,pm2_5&timezone=auto&forecast_days=2`).then(res => res.json())
        ]);

        const envData = currentRes.data.data;
        setData(envData);
        
        // Update global derived states for backgrounds and overlays
        const resolvedBg = resolveBackground(envData.weatherCode, envData.isDay);
        setWeatherCondition(resolvedBg);
        setIsDay(envData.isDay);
        if (envData.aqi) setCurrentAQI(envData.aqi);

        if (forecastRes.hourly) {
          const chartData = forecastRes.hourly.time.map((time, idx) => ({
            time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            aqi: forecastRes.hourly.us_aqi[idx],
            pm25: forecastRes.hourly.pm2_5[idx]
          })).slice(0, 24); // next 24 hours
          setForecast(chartData);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch environmental data');
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchEnvData(location.lat, location.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setLocation({ lat: 51.5072, lng: 0.1276, name: 'London' }); // Default to London
        }
      );
    } else {
      setLocation({ lat: 51.5072, lng: 0.1276, name: 'London' });
    }
  }, [location, setLocation, setWeatherCondition]);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
  };

  if (loading && !data) return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh]">
      <WaterDropLoader message="Analyzing atmosphere..." />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10 px-2 lg:px-4 min-h-full relative">
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-2 md:pt-0">
        <div className="order-2 md:order-1">
          <h1 className="text-2xl md:text-[28px] font-bold tracking-tight mb-1 text-white drop-shadow-sm flex items-center gap-2">
            {getGreeting()}, {user?.name || 'Arpit'}! 👋
          </h1>
          <p className="text-sm text-gray-400 font-medium">Here's your environment summary</p>
        </div>

        <div className="flex items-center gap-4 relative z-50 order-1 md:order-2 w-full md:w-auto">
          <div className="w-full md:w-64 relative group z-50">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
            <div className="[&>div>input]:pl-11 [&>div>input]:pr-4 [&>div>input]:py-2.5 [&>div>input]:bg-white/[0.05] [&>div>input]:backdrop-blur-xl [&>div>input]:border [&>div>input]:border-white/[0.1] [&>div>input]:rounded-full [&>div>input]:text-sm [&>div>input]:text-white focus-within:[&>div>input]:border-white/[0.2] transition-all [&>div>input]:w-full relative z-50">
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </div>
          </div>
          <NotificationDropdown />
        </div>
      </div>

      {error && !data && (
        <div className="flex-1 flex items-center justify-center min-h-[50vh] text-red-400 font-bold bg-white/[0.05] backdrop-blur-[16px] rounded-[20px] p-8 border border-red-500/10">
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">

          {/* Main AQI Section (Plain text format) */}
          <div className="flex flex-col justify-start mb-2">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Air Quality Index</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
            </div>

            {data && (
              <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium mb-4">
                <MapPin size={14} className="text-gray-500" />
                {data.city && data.city !== 'Unknown Location' ? `${data.city}${data.country ? `, ${data.country}` : ''}` : (location?.name || 'Unknown Location')}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
              <div className="text-7xl md:text-8xl font-black text-white leading-none tracking-tighter drop-shadow-lg">
                {data.aqi || '--'}
              </div>
              {data.aqi !== undefined && (() => {
                const aqiStatus = getAqiStatus(data.aqi);
                const AqiIcon = aqiStatus.icon;
                return (
                  <div className="flex flex-col pb-2">
                    <div className={`flex items-center gap-2 font-bold text-xl mb-1 ${aqiStatus.color}`}>
                      <AqiIcon size={24} className={aqiStatus.color} />
                      {aqiStatus.label}
                    </div>
                    <p className="text-sm text-gray-400 font-medium">{aqiStatus.desc}</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 4-Column Grid for Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {/* PM2.5 */}
            <GlassCard className="p-5 flex flex-col justify-between min-h-[160px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">PM2.5</span>
                <Activity className="w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{data.pm25 || '--'}</span>
                  <span className="text-[10px] font-medium text-gray-400">µg/m³</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-400 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Good
                </div>
              </div>
            </GlassCard>

            {/* PM10 */}
            <GlassCard className="p-5 flex flex-col justify-between min-h-[160px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">PM10</span>
                <CloudRain className="w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{data.pm10 || '--'}</span>
                  <span className="text-[10px] font-medium text-gray-400">µg/m³</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-400 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Good
                </div>
              </div>
            </GlassCard>

            {/* Temperature */}
            <GlassCard className="p-5 flex flex-col justify-between min-h-[160px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">Temperature</span>
                <Thermometer className="w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{data.temperature || '--'}</span>
                  <span className="text-[10px] font-medium text-gray-400">°C</span>
                </div>
                <div className="text-[11px] font-medium text-gray-400">
                  Feels like {data.feelsLike || '--'}°C
                </div>
              </div>
            </GlassCard>

            {/* Humidity */}
            <GlassCard className="p-5 flex flex-col justify-between min-h-[160px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">Humidity</span>
                <Droplets className="w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{data.humidity || '--'}</span>
                  <span className="text-[10px] font-medium text-gray-400">%</span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                  Moderate
                </div>
              </div>
            </GlassCard>

            {/* Wind Speed */}
            <GlassCard className="p-5 flex flex-col justify-between min-h-[160px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">Wind Speed</span>
                <Wind className="w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{data.wind || '--'}</span>
                  <span className="text-[10px] font-medium text-gray-400">km/h</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-400 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Light
                </div>
              </div>
            </GlassCard>

            {/* Pressure */}
            <GlassCard className="p-5 flex flex-col justify-between min-h-[160px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">Pressure</span>
                <Gauge className="w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{data.pressure ? Math.round(data.pressure) : '--'}</span>
                  <span className="text-[10px] font-medium text-gray-400">hPa</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-400 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Normal
                </div>
              </div>
            </GlassCard>

            {/* UV Index */}
            <GlassCard className="p-5 flex flex-col justify-between min-h-[160px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">UV Index</span>
                <Sun className="w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{data.uvIndex || '--'}</span>
                </div>
                {data.uvIndex !== undefined && (() => {
                  const uvStatus = getUvStatus(data.uvIndex);
                  return (
                    <div className={`flex items-center gap-1.5 font-bold text-[11px] ${uvStatus.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${uvStatus.bg}`}></span>
                      {uvStatus.label}
                    </div>
                  );
                })()}
              </div>
            </GlassCard>

            {/* Sunrise */}
            <GlassCard className="p-5 flex flex-col justify-between min-h-[160px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">Sunrise</span>
                <Sunrise className="w-4 h-4 text-gray-500" />
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-white">{data.sunrise ? new Date(data.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
                </div>
                <div className="text-[11px] font-medium text-gray-400">Local Time</div>
              </div>
            </GlassCard>

          </div>

          {/* Bottom Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Trend Chart */}
            <GlassCard className="p-6 flex flex-col min-h-[280px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wide">AQI Trend (24h)</h3>
              <div className="flex-1 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecast}>
                    <defs>
                      <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      tickFormatter={(val, i) => i % 6 === 0 ? val : ''}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(10,15,13,0.9)', backdropFilter: 'blur(8px)' }}
                      itemStyle={{ color: '#22C55E' }}
                    />
                    <Area type="monotone" dataKey="aqi" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" activeDot={{ r: 4, fill: '#22C55E' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Breakdown Chart */}
            <GlassCard className="p-6 flex flex-col min-h-[280px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-[16px] rounded-[20px]">
              <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wide">Air Quality Breakdown</h3>
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-between px-2 gap-6">
                <div className="h-40 w-40 relative shrink-0">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{data.aqi || '--'}</span>
                  </div>
                  <div className="w-full h-full absolute inset-0 z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Good', value: 70, color: '#22c55e' },
                            { name: 'Moderate', value: 20, color: '#eab308' },
                            { name: 'Unhealthy', value: 8, color: '#f97316' },
                            { name: 'Very Unhealthy', value: 2, color: '#ef4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={75}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={4}
                        >
                          {[
                            { color: '#22c55e' },
                            { color: '#eab308' },
                            { color: '#f97316' },
                            { color: '#ef4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(10,15,13,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full sm:ml-4 max-w-[200px]">
                  {[
                    { label: 'Good (0-50)', pct: '70%', color: 'bg-green-500' },
                    { label: 'Moderate (51-100)', pct: '20%', color: 'bg-yellow-500' },
                    { label: 'Unhealthy (101-150)', pct: '8%', color: 'bg-orange-500' },
                    { label: 'Very Unhealthy (150+)', pct: '2%', color: 'bg-red-500' }
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`}></span>
                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                      </div>
                      <span className="font-bold text-white">{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

          </div>

        </div>
      )}
    </div>
  );
};
