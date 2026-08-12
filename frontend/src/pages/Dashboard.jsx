import { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Cloud, Wind, Droplets, MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import useStore from '../store/useStore';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { location, setLocation } = useStore();

  const fetchData = async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/data/current?lat=${lat}&lng=${lng}`);
      setData(res.data);
      
      const forecastRes = await axios.get(`http://localhost:5000/api/data/forecast?lat=${lat}&lng=${lng}`);
      
      const formattedForecast = forecastRes.data.hourly.time.map((time, i) => ({
        time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aqi: forecastRes.data.hourly.us_aqi[i],
        pm25: forecastRes.data.hourly.pm2_5[i],
      })).slice(0, 24);
      
      setForecast(formattedForecast);
    } catch (err) {
      setError('Failed to load environmental data.');
    } finally {
      setLoading(false);
    }
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          fetchData(coords.lat, coords.lng);
        },
        () => {
          setError('Location permission denied.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported.');
    }
  };

  useEffect(() => {
    if (location) {
      fetchData(location.lat, location.lng);
    } else {
      locateUser();
    }
  }, []);

  const getRiskColor = (aqi) => {
    if (!aqi) return 'text-muted-foreground';
    if (aqi <= 50) return 'text-success';
    if (aqi <= 100) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Environmental Dashboard</h1>
          <p className="text-muted-foreground">Real-time local air quality and weather</p>
        </div>
        <button 
          onClick={locateUser}
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <MapPin className="w-5 h-5" />
          <span>Use Current Location</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Analyzing environmental data...</p>
        </div>
      ) : error ? (
        <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center py-16">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to Load Data</h2>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => location ? fetchData(location.lat, location.lng) : locateUser()}
            className="mt-6 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      ) : data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50"></div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Air Quality Index</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold ${getRiskColor(data.aqi)}`}>{data.aqi}</span>
                <span className="text-sm font-medium">US AQI</span>
              </div>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">Temperature</h3>
                <Cloud className="w-5 h-5 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">{data.temperature}°C</div>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">Wind Speed</h3>
                <Wind className="w-5 h-5 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">{data.windSpeed} <span className="text-xl">km/h</span></div>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">Humidity</h3>
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">{data.humidity}%</div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">24-Hour Air Quality Forecast (AQI)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="aqi" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAqi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
