import { useState } from 'react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { Map, Plus, X, Loader2 } from 'lucide-react';

// Common cities for demonstration
const CITIES = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 }
];

export default function CityComparison() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const addCity = async (city) => {
    if (selectedCities.find(c => c.name === city.name)) return;

    setLoading(true);
    setSelectedCities(prev => [...prev, city]);
    setSearch('');

    try {
      const res = await api.get(
        `/data/current?lat=${city.lat}&lng=${city.lng}`
      );

      setCityData(prev => [
        ...prev,
        {
          name: city.name,
          AQI: res.data.aqi,
          PM25: res.data.pm2_5,
          temp: res.data.temperature
        }
      ]);
    } catch (err) {
      console.error(`Failed to fetch data for ${city.name}:`, err);

      // Remove city if API request fails
      setSelectedCities(prev =>
        prev.filter(c => c.name !== city.name)
      );
    } finally {
      setLoading(false);
    }
  };

  const removeCity = (cityName) => {
    setSelectedCities(prev =>
      prev.filter(c => c.name !== cityName)
    );

    setCityData(prev =>
      prev.filter(c => c.name !== cityName)
    );
  };

  const filteredCities = CITIES.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedCities.find(sc => sc.name === c.name)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <Map className="w-5 h-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            City Comparison
          </h1>

          <p className="text-muted-foreground text-sm">
            Compare environmental risk across multiple locations
          </p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search city to add..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-background border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {search && (
            <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-card border border-border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredCities.map(city => (
                <button
                  key={city.name}
                  onClick={() => addCity(city)}
                  className="w-full text-left px-4 py-3 hover:bg-muted flex items-center justify-between"
                >
                  <span>{city.name}</span>
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              ))}

              {filteredCities.length === 0 && (
                <div className="p-4 text-muted-foreground text-center">
                  No cities found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {selectedCities.map(city => (
            <div
              key={city.name}
              className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 font-medium shadow-sm"
            >
              {city.name}

              <button
                onClick={() => removeCity(city.name)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {loading && (
            <div className="flex items-center justify-center px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
        </div>

        {cityData.length > 0 ? (
          <div className="h-96 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cityData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                />

                <YAxis
                  stroke="var(--muted-foreground)"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow)'
                  }}
                  itemStyle={{
                    color: 'var(--foreground)',
                    fontWeight: 500
                  }}
                  cursor={{
                    fill: 'var(--muted)',
                    opacity: 0.4
                  }}
                />

                <Legend />

                <Bar
                  dataKey="AQI"
                  fill="var(--destructive)"
                  radius={[4, 4, 0, 0]}
                  name="US AQI"
                />

                <Bar
                  dataKey="PM25"
                  fill="var(--warning)"
                  radius={[4, 4, 0, 0]}
                  name="PM2.5 (µg/m³)"
                />

                <Bar
                  dataKey="temp"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  name="Temp (°C)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">
              Add cities to begin comparison
            </p>
          </div>
        )}
      </div>
    </div>
  );
}