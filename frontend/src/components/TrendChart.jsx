import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TrendChart = ({ locationId }) => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!locationId) return;
    
    const fetchSnapshots = async () => {
      setLoading(true);
      try {
<<<<<<< Updated upstream
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/snapshots/${locationId}?range=${range}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await res.json();
=======
        const res = await api.get(`/snapshots/${locationId}?range=${range}`);
        const result = res.data;
>>>>>>> Stashed changes
        
        if (result.success) {
          const formatted = result.data.map(d => ({
            ...d,
            date: new Date(d.timestamp).toLocaleDateString()
          }));
          setData(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch snapshots', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, [locationId, range]);

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Historical AQI Trend</h3>
        <div className="space-x-2">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                range === r 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400">Loading trends...</div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">No historical data available yet.</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="aqi" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TrendChart;
