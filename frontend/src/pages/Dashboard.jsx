import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { WaterDropLoader } from '../components/common/WaterDropLoader';
import { LocationSearch } from '../components/common/LocationSearch';
import { 
  MapPin, Wind, Droplets, Thermometer, CloudRain, Activity, 
  Info, CheckCircle2, Sunrise, Gauge, Sun
} from 'lucide-react';
import { environmentService } from '../services/api';
import useStore from '../store/useStore';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChangeMapView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
};

const getWeatherConditionString = (code) => {
  if (code === 0) return 'clear';
  if ([1,2,3,45,48].includes(code)) return 'cloudy';
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return 'rain';
  if ([71,73,75,77,85,86].includes(code)) return 'snow';
  if ([95,96,99].includes(code)) return 'storm';
  return 'clear';
};

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const setLocation = useStore((state) => state.setLocation);
  const location = useStore((state) => state.location);
  const setWeatherCondition = useStore((state) => state.setWeatherCondition);
  const user = useStore(state => state.user);

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
        setWeatherCondition(getWeatherConditionString(envData.weatherCode));
        
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
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Top Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-text-main drop-shadow-md">
            Welcome Back, {user?.name || 'Explorer'}
          </h1>
          {data && (
            <div className="flex items-center gap-2 text-text-main font-medium bg-surface/50 inline-flex px-4 py-2 rounded-xl border border-border backdrop-blur-md shadow-sm">
              <MapPin size={18} className="text-primary-600" />
              {data.city || 'Unknown Location'}, {data.country || ''}
            </div>
          )}
        </div>
        <div className="w-full lg:w-96">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>
      </div>

      {error && !data && (
        <div className="flex-1 flex items-center justify-center min-h-[50vh] text-red-500 font-bold bg-surface rounded-xl p-8 border border-red-500/20">
          <p>{error}</p>
        </div>
      )}

      {data && (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main AQI & Condition Card */}
        <GlassCard className="col-span-1 md:col-span-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-surface/80 to-surface-hover/80 backdrop-blur-xl">
          <div className="absolute -right-12 -top-12 opacity-10 pointer-events-none">
            <Activity size={240} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-between z-10 mb-8">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-text-muted font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <Activity size={16} /> Air Quality Index
                </h2>
                <RiskBadge level={data.risk?.riskLevel || 'UNKNOWN'} />
              </div>
              
              <div className="flex items-baseline gap-2 my-4">
                <span className="text-7xl md:text-8xl font-black text-text-main drop-shadow-lg tracking-tighter">{data.aqi}</span>
                <span className="text-xl font-bold text-text-muted">US AQI</span>
              </div>
              <p className="text-text-main font-medium text-lg">
                The current air quality poses a <span className="font-bold">{data.risk?.personalRisk?.toLowerCase()}</span> risk based on your profile.
              </p>
            </div>

            <div className="w-full md:w-64 space-y-4">
              <div className="bg-surface/80 rounded-2xl p-4 border border-border">
                <h3 className="text-sm font-bold text-text-muted mb-2 flex items-center gap-2">
                  <Thermometer size={16} /> Temperature
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-main">{data.temperature}°</span>
                </div>
                <div className="text-sm text-text-muted mt-1 font-medium">
                  Feels like {data.feelsLike}°
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface/60 border border-border/50 rounded-xl p-5 z-10 shadow-sm backdrop-blur-md">
            <h3 className="font-bold flex items-center gap-2 mb-3 text-text-main">
              <Info size={18} className="text-primary-500" /> Health Recommendations
            </h3>
            <ul className="space-y-2">
              {data.risk?.guidance?.map((guide, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm font-medium text-text-main">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-primary-500" />
                  {guide}
                </li>
              ))}
              {!data.risk?.guidance?.length && (
                <li className="text-sm font-medium text-text-main">Enjoy your outdoor activities!</li>
              )}
            </ul>
          </div>
        </GlassCard>

        {/* Forecast Chart */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <GlassCard className="flex-1 flex flex-col p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-text-main">
              <Activity size={18} /> 24h AQI Forecast
            </h3>
            <div className="flex-1 min-h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{fontSize: 12, fill: 'var(--text-muted)'}} tickFormatter={(val, i) => i % 4 === 0 ? val : ''} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }} />
                  <Area type="monotone" dataKey="aqi" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="col-span-1 md:col-span-12">
          <h3 className="text-xl font-bold mb-4 ml-1 text-text-main drop-shadow-sm">Atmospheric Conditions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            
            <GlassCard hover className="flex flex-col justify-between p-4">
              <span className="text-sm font-bold text-text-muted mb-3 flex items-center gap-2"><Wind size={16}/> Wind</span>
              <div>
                <div className="text-2xl font-black text-text-main">{data.wind || 0}</div>
                <div className="text-xs font-semibold text-text-muted">km/h</div>
              </div>
            </GlassCard>

            <GlassCard hover className="flex flex-col justify-between p-4">
              <span className="text-sm font-bold text-text-muted mb-3 flex items-center gap-2"><Droplets size={16}/> Humidity</span>
              <div>
                <div className="text-2xl font-black text-text-main">{data.humidity || 0}</div>
                <div className="text-xs font-semibold text-text-muted">%</div>
              </div>
            </GlassCard>

            <GlassCard hover className="flex flex-col justify-between p-4">
              <span className="text-sm font-bold text-text-muted mb-3 flex items-center gap-2"><CloudRain size={16}/> Precip.</span>
              <div>
                <div className="text-2xl font-black text-text-main">{data.precipitation || 0}</div>
                <div className="text-xs font-semibold text-text-muted">mm</div>
              </div>
            </GlassCard>

            <GlassCard hover className="flex flex-col justify-between p-4">
              <span className="text-sm font-bold text-text-muted mb-3 flex items-center gap-2"><Gauge size={16}/> Pressure</span>
              <div>
                <div className="text-2xl font-black text-text-main">{Math.round(data.pressure) || '--'}</div>
                <div className="text-xs font-semibold text-text-muted">hPa</div>
              </div>
            </GlassCard>

            <GlassCard hover className="flex flex-col justify-between p-4">
              <span className="text-sm font-bold text-text-muted mb-3 flex items-center gap-2"><Sun size={16}/> UV Index</span>
              <div>
                <div className="text-2xl font-black text-text-main">{data.uvIndex || '--'}</div>
                <div className="text-xs font-semibold text-text-muted">Max Today</div>
              </div>
            </GlassCard>

            <GlassCard hover className="flex flex-col justify-between p-4">
              <span className="text-sm font-bold text-text-muted mb-3 flex items-center gap-2"><Sunrise size={16}/> Sunrise</span>
              <div>
                <div className="text-2xl font-black text-text-main">{data.sunrise ? new Date(data.sunrise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}</div>
                <div className="text-xs font-semibold text-text-muted">Local Time</div>
              </div>
            </GlassCard>

          </div>
        </div>

        {/* Pollutants Breakdown & Map */}
        <div className="col-span-1 md:col-span-6 flex flex-col gap-4">
          <h3 className="text-xl font-bold ml-1 text-text-main drop-shadow-sm">Pollutant Breakdown</h3>
          <div className="grid grid-cols-2 gap-4 h-full">
            <GlassCard hover className="p-4 flex flex-col justify-center">
              <div className="text-sm font-bold text-text-muted mb-1">PM2.5</div>
              <div className="flex items-baseline gap-1">
                <div className="text-3xl font-black text-rose-500">{data.pm25 || '--'}</div>
                <div className="text-xs font-bold text-text-muted">µg/m³</div>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, ((data.pm25 || 0)/50)*100)}%` }}></div>
              </div>
            </GlassCard>
            
            <GlassCard hover className="p-4 flex flex-col justify-center">
              <div className="text-sm font-bold text-text-muted mb-1">PM10</div>
              <div className="flex items-baseline gap-1">
                <div className="text-3xl font-black text-amber-500">{data.pm10 || '--'}</div>
                <div className="text-xs font-bold text-text-muted">µg/m³</div>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, ((data.pm10 || 0)/100)*100)}%` }}></div>
              </div>
            </GlassCard>
            
            <GlassCard hover className="p-4 flex flex-col justify-center">
              <div className="text-sm font-bold text-text-muted mb-1">Carbon Monoxide</div>
              <div className="flex items-baseline gap-1">
                <div className="text-3xl font-black text-indigo-500">{data.co || '--'}</div>
                <div className="text-xs font-bold text-text-muted">µg/m³</div>
              </div>
            </GlassCard>

            <GlassCard hover className="p-4 flex flex-col justify-center">
              <div className="text-sm font-bold text-text-muted mb-1">Ozone (O3)</div>
              <div className="flex items-baseline gap-1">
                <div className="text-3xl font-black text-blue-500">{data.o3 || '--'}</div>
                <div className="text-xs font-bold text-text-muted">µg/m³</div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Map */}
        <div className="col-span-1 md:col-span-6 flex flex-col gap-4">
          <h3 className="text-xl font-bold ml-1 text-text-main drop-shadow-sm flex items-center gap-2">
             Location Map
          </h3>
          <GlassCard className="flex-1 p-2 min-h-[300px]">
            <div className="w-full h-full rounded-xl overflow-hidden z-0">
              {data.latitude && data.longitude && (
                <MapContainer 
                  center={[data.latitude, data.longitude]} 
                  zoom={11} 
                  scrollWheelZoom={false} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <ChangeMapView coords={[data.latitude, data.longitude]} />
                  <Marker position={[data.latitude, data.longitude]}>
                    <Popup>
                      <div className="font-bold text-center">{data.city}</div>
                      <div>AQI: {data.aqi}</div>
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
      )}
    </div>
  );
};
