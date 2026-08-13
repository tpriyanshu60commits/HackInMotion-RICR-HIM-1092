import { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, Calendar, Wind } from 'lucide-react';
import useStore from '../store/useStore';
import { environmentService } from '../services/api';
import { LocationSearch } from '../components/common/LocationSearch';

export const HistoricalTrends = () => {
  const [range, setRange] = useState('7 Days');
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const loc = useStore.getState().location;
    return (loc && loc.lat && loc.lng) ? loc : null;
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedLocation || !selectedLocation.lat || !selectedLocation.lng) {
      return;
    }

    let days = 7;
    if (range === '30 Days') days = 30;
    if (range === '90 Days') days = 90;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await environmentService.getHistory(selectedLocation.lat, selectedLocation.lng, days);
        if (response.success) {
          setChartData(response.data);
          console.log('Real Chart Data:', response.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load historical data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedLocation, range]);

  const calculateStats = () => {
    if (!chartData || chartData.length === 0) return { trend: 0, pm25: 0, pm10: 0 };
    
    const pm25Avg = chartData.reduce((acc, curr) => acc + curr.pm25, 0) / chartData.length;
    const pm10Avg = chartData.reduce((acc, curr) => acc + curr.pm10, 0) / chartData.length;
    
    const midPoint = Math.floor(chartData.length / 2);
    const firstHalf = chartData.slice(0, midPoint);
    const secondHalf = chartData.slice(midPoint);
    
    const firstHalfAvgAqi = firstHalf.length ? firstHalf.reduce((acc, curr) => acc + curr.aqi, 0) / firstHalf.length : 1;
    const secondHalfAvgAqi = secondHalf.length ? secondHalf.reduce((acc, curr) => acc + curr.aqi, 0) / secondHalf.length : 1;
    
    const trend = ((secondHalfAvgAqi - firstHalfAvgAqi) / (firstHalfAvgAqi || 1)) * 100;
    
    return {
      trend: Math.round(trend),
      pm25: pm25Avg.toFixed(1),
      pm10: pm10Avg.toFixed(1)
    };
  };

  const getStatus = (value, type) => {
    if (type === 'pm25') {
      if (value <= 12) return { text: 'Good', color: 'text-green-500', bg: 'bg-green-500', shadow: 'shadow-[0_0_8px_rgba(34,197,94,0.8)]' };
      if (value <= 35.4) return { text: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500', shadow: 'shadow-[0_0_8px_rgba(234,179,8,0.8)]' };
      if (value <= 55.4) return { text: 'Unhealthy (SG)', color: 'text-orange-500', bg: 'bg-orange-500', shadow: 'shadow-[0_0_8px_rgba(249,115,22,0.8)]' };
      return { text: 'Unhealthy', color: 'text-red-500', bg: 'bg-red-500', shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.8)]' };
    }
    if (type === 'pm10') {
      if (value <= 54) return { text: 'Good', color: 'text-green-500', bg: 'bg-green-500', shadow: 'shadow-[0_0_8px_rgba(34,197,94,0.8)]' };
      if (value <= 154) return { text: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500', shadow: 'shadow-[0_0_8px_rgba(234,179,8,0.8)]' };
      if (value <= 254) return { text: 'Unhealthy (SG)', color: 'text-orange-500', bg: 'bg-orange-500', shadow: 'shadow-[0_0_8px_rgba(249,115,22,0.8)]' };
      return { text: 'Unhealthy', color: 'text-red-500', bg: 'bg-red-500', shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.8)]' };
    }
  };

  const stats = calculateStats();
  const pm25Status = getStatus(stats.pm25, 'pm25');
  const pm10Status = getStatus(stats.pm10, 'pm10');
  
  const trendSign = stats.trend > 0 ? '+' : '';
  const trendColor = stats.trend > 0 ? 'text-red-500' : stats.trend < 0 ? 'text-green-500' : 'text-gray-400';
  const trendBg = stats.trend > 0 ? 'bg-red-500' : stats.trend < 0 ? 'bg-green-500' : 'bg-gray-400';
  const trendShadow = stats.trend > 0 ? 'shadow-[0_0_8px_rgba(239,68,68,0.8)]' : stats.trend < 0 ? 'shadow-[0_0_8px_rgba(34,197,94,0.8)]' : '';
  const trendText = stats.trend > 0 ? 'Worsened AQI' : stats.trend < 0 ? 'Improved AQI' : 'Stable AQI';

  return (
    <div
      className="min-h-full relative px-2 lg:px-4 pb-10"
      
    >
      {/* Header and Filters Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-4">
        <div className="flex-1 w-full md:w-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white drop-shadow-md">Historical Trends</h1>
          <p className="text-sm text-gray-400 font-medium mb-3">Track environmental changes and patterns over time.</p>
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-gray-300 font-medium">Showing data for:</span>
            <span className="text-green-400 font-bold">{selectedLocation?.name || 'Select a location'}</span>
          </div>
          <div className="max-w-md w-full relative z-50">
            <LocationSearch onLocationSelect={setSelectedLocation} />
          </div>
        </div>

        {/* Compact Glass Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Mock AQI dropdown for visual completeness as requested */}
          <div className="flex items-center gap-2 bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] rounded-full px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/[0.06] cursor-pointer">
            <span className="font-semibold text-gray-200">Metric:</span>
            <span className="text-gray-400">AQI</span>
            <span className="text-gray-500 text-[10px] ml-1">▼</span>
          </div>

          <div className="flex bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] rounded-full p-1 shadow-sm">
            {['7 Days', '30 Days', '90 Days'].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 ${range === r
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area: Chart and Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Chart Panel */}
        <div className="lg:col-span-2 mb-6 lg:mb-0">
        <GlassCard hover={false} className="p-6 md:p-8 bg-white/[0.02] border-white/[0.06] backdrop-blur-[24px] h-full flex flex-col">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8 flex items-center gap-2">
            <Calendar size={16} className="text-green-500" />
            AQI Trend ({range})
          </h3>
          <div className="h-[400px] lg:h-[500px] w-full flex items-center justify-center flex-1">
            {loading ? (
              <div className="text-green-500 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading historical data...</p>
              </div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : chartData.length === 0 ? (
              <div className="text-gray-400">No data available for this location.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                    dy={15}
                    interval="preserveStartEnd"
                    tickFormatter={(dateStr) => {
                      if (!dateStr) return '';
                      // Append a dummy time to parse the date in local timezone instead of UTC 
                      // to avoid off-by-one day issues (e.g. "2026-08-06" -> "Aug 05" in some timezones).
                      // A safer way is using UTC methods or appending "T00:00:00".
                      const d = new Date(dateStr + 'T12:00:00');
                      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10,15,13,0.9)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ color: '#22C55E', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9CA3AF', fontWeight: '600', marginBottom: '8px' }}
                    labelFormatter={(dateStr, props) => {
                      const item = props[0]?.payload;
                      if (!item?.date) return dateStr;
                      const d = new Date(item.date + 'T12:00:00');
                      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                      return `${item.name}, ${formattedDate}`;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    stroke="#22C55E"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAqi)"
                    activeDot={{ r: 5, fill: '#22C55E', stroke: '#0A0F0D', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
        </div>

        {/* Summary Stat Cards */}
        <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">

        {/* Trend Analysis Card */}
        <GlassCard className="flex flex-col p-6 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out cursor-default">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity size={14} className="text-gray-500" />
            Trend Analysis
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
               <div className="animate-pulse h-10 w-24 bg-white/10 rounded mb-3"></div>
            ) : (
              <>
                <div className="text-4xl font-black text-white mb-3 tracking-tighter">
                  {trendSign}{stats.trend}%
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${trendColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${trendBg} ${trendShadow}`}></span>
                  {trendText}
                </div>
              </>
            )}
          </div>
        </GlassCard>

        {/* PM2.5 Average Card */}
        <GlassCard className="flex flex-col p-6 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out cursor-default">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wind size={14} className="text-gray-500" />
            Average PM2.5 ({range})
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
               <div className="animate-pulse h-10 w-32 bg-white/10 rounded mb-3"></div>
            ) : (
              <>
                <div className="text-4xl font-black text-white mb-3 tracking-tighter flex items-baseline gap-1">
                  {stats.pm25} <span className="text-sm font-semibold text-gray-500 tracking-normal">µg/m³</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${pm25Status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pm25Status.bg} ${pm25Status.shadow}`}></span>
                  {pm25Status.text}
                </div>
              </>
            )}
          </div>
        </GlassCard>

        {/* PM10 Average Card */}
        <GlassCard className="flex flex-col p-6 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out cursor-default">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wind size={14} className="text-gray-500" />
            Average PM10 ({range})
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
               <div className="animate-pulse h-10 w-32 bg-white/10 rounded mb-3"></div>
            ) : (
              <>
                <div className="text-4xl font-black text-white mb-3 tracking-tighter flex items-baseline gap-1">
                  {stats.pm10} <span className="text-sm font-semibold text-gray-500 tracking-normal">µg/m³</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${pm10Status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pm10Status.bg} ${pm10Status.shadow}`}></span>
                  {pm10Status.text}
                </div>
              </>
            )}
          </div>
        </GlassCard>

        </div>
      </div>
    </div>
  );
};
