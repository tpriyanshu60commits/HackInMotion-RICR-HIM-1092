// ✅ master: React default import not needed in modern React (17+)
import { useState } from 'react';
import { LocationSearch } from '../components/common/LocationSearch';

// ✅ feature/SS06: all icons used in the component body
import {
  Navigation as NavIcon,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Fuel,
  Bed,
  Activity,
} from 'lucide-react';

// ✅ feature/SS06: Popup and Marker used for amenity markers
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

// ✅ feature/SS06: needed for custom div icons
import L from 'leaflet';

// ✅ feature/SS06: needed for route analysis API call
import api from '../services/api';

// ✅ feature/SS06: custom icons used for amenity markers on the map
const createIcon = (color, emoji) =>
  L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 12px; color: white;">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

const fuelIcon     = createIcon('#F59E0B', '⛽');
const hotelIcon    = createIcon('#3B82F6', '🏨');
const hospitalIcon = createIcon('#EF4444', '🏥');

export const RouteRisk = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const [origin, setOrigin] = useState('New Delhi, India');
  const [destination, setDestination] = useState('Gurgaon, India');

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
<<<<<<< Updated upstream
      const response = await axios.post(
        'http://localhost:5000/api/route/analyze',
=======
      const response = await api.post(
        '/route/analyze',
>>>>>>> Stashed changes
        { origin, destination }
      );
      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (error) {
      console.error('Error analyzing route:', error);
      alert('Failed to analyze route. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Dynamically generated route positions from API response
  const routePositions = result?.route?.geometry || [];

  // Center map dynamically
  const mapCenter =
    routePositions.length > 0
      ? routePositions[Math.floor(routePositions.length / 2)]
      : [28.6139, 77.209];

  return (
    <div className="min-h-full relative px-4 lg:px-8 py-8 animate-fade-in flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col h-full gap-8">

        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">
            Route Risk
          </h1>
          <p className="text-sm text-gray-400">
            Find the safest route based on current environmental conditions
          </p>
        </div>

        {/* Location Inputs */}
        <div className="w-full relative z-30 bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-4 lg:p-6 shadow-2xl flex flex-col lg:flex-row items-center gap-4 lg:gap-6">

          <div className="flex-1 w-full relative group z-20">
            <LocationSearch
              initialQuery={origin}
              onLocationSelect={(loc) => setOrigin(loc.name)}
              retainSelection={true}
              className="w-full"
            />
          </div>

          <ArrowRight className="text-gray-500 hidden lg:block shrink-0" size={20} />

          <div className="flex-1 w-full relative group z-10">
            <LocationSearch
              initialQuery={destination}
              onLocationSelect={(loc) => setDestination(loc.name)}
              retainSelection={true}
              className="w-full"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full lg:w-auto px-8 py-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl font-bold hover:bg-green-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                Analyzing <span className="animate-spin">↻</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">Analyze</span>
            )}
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 flex-1">

          {/* Map Container (70%) */}
          <div className="col-span-1 lg:col-span-2 bg-white/[0.02] backdrop-blur-sm border border-white/[0.07] rounded-2xl p-2 relative overflow-hidden min-h-[480px] lg:min-h-[600px] shadow-2xl flex flex-col group hover:border-white/[0.12] transition-colors duration-300">
            <div className="w-full h-full rounded-xl overflow-hidden flex-1 relative z-0">
              <div className="absolute inset-0 z-0 [&_.leaflet-layer]:brightness-[0.4] [&_.leaflet-layer]:contrast-[1.2] [&_.leaflet-layer]:grayscale-[0.8] [&_.leaflet-layer]:invert-[1] [&_.leaflet-layer]:hue-rotate-[180deg]">
                <MapContainer
                  center={mapCenter}
                  zoom={9}
                  style={{ height: '100%', width: '100%' }}
                  key={mapCenter.join(',')}
                >
                  <TileLayer
                    url={`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_MAP_KEY}`}
                    attribution="&copy; Geoapify &copy; OpenStreetMap"
                  />
                  {routePositions.length > 0 && (
                    <>
                      <Marker position={routePositions[0]} />
                      <Marker position={routePositions[routePositions.length - 1]} />
                      <Polyline
                        positions={routePositions}
                        pathOptions={{
                          color: '#F59E0B',
                          weight: 4,
                          opacity: 0.8,
                          className: 'animate-pulse',
                        }}
                      />
                    </>
                  )}

                  {/* High Risk Point */}
                  {result?.risk?.worstPoint && (
                    <Marker
                      position={[
                        result.risk.worstPoint.lat,
                        result.risk.worstPoint.lng,
                      ]}
                    >
                      <Popup>Worst AQI: {result.risk.worstPoint.aqi}</Popup>
                    </Marker>
                  )}

                  {/* Amenity Markers */}
                  {result?.amenities?.fuelStations?.list?.map((p, i) => (
                    <Marker
                      key={`fuel-${i}`}
                      position={[p.lat, p.lng]}
                      icon={fuelIcon}
                    >
                      <Popup>{p.name || 'Fuel Station'}</Popup>
                    </Marker>
                  ))}
                  {result?.amenities?.hotels?.list?.map((p, i) => (
                    <Marker
                      key={`hotel-${i}`}
                      position={[p.lat, p.lng]}
                      icon={hotelIcon}
                    >
                      <Popup>{p.name || 'Hotel'}</Popup>
                    </Marker>
                  ))}
                  {result?.amenities?.hospitals?.list?.map((p, i) => (
                    <Marker
                      key={`hospital-${i}`}
                      position={[p.lat, p.lng]}
                      icon={hospitalIcon}
                    >
                      <Popup>{p.name || 'Hospital'}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Floating Overlay */}
              <div className="absolute top-6 left-6 z-[400] bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/10 shadow-lg font-semibold text-sm flex items-center gap-2 text-white">
                <MapPin size={16} className="text-green-400" />
                Live Route Analysis
              </div>
            </div>
          </div>

          {/* Risk Summary (30%) */}
          {result ? (
            <div className="col-span-1 bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-6 lg:p-8 hover:bg-white/[0.04] transition-all duration-300 ease-out hover:-translate-y-[2px] flex flex-col shadow-2xl">

              <h2 className="text-lg font-semibold text-white mb-8 pb-4 border-b border-white/[0.05]">
                Route Risk
              </h2>

              {/* Score */}
              <div className="mb-10 flex flex-col">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Overall Status
                </span>
                <div className="flex items-baseline gap-4">
                  <span className="text-6xl font-black text-white leading-none tracking-tighter">
                    {result.risk.averageAQI}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                    <span className="text-base font-bold uppercase tracking-wider text-yellow-500">
                      {result.risk.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Distance / Duration */}
              <div className="mb-10 grid grid-cols-2 gap-4">
                <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <span className="text-sm text-cyan-400/80 uppercase font-semibold tracking-wider block mb-1">
                    Distance
                  </span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {result.route.distanceKm} km
                  </span>
                </div>
                <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <span className="text-sm text-cyan-400/80 uppercase font-semibold tracking-wider block mb-1">
                    Duration
                  </span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {result.route.durationMin} min
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-8 flex-1 flex flex-col">
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                    Amenities Along Route
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center justify-center p-3 bg-white/[0.03] rounded-xl border border-white/10 text-center">
                      <Fuel className="text-orange-400 mb-2" size={20} />
                      <span className="text-xl font-bold text-white">
                        {result.amenities.fuelStations.count}
                      </span>
                      <span className="text-xs text-gray-400">Pumps</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white/[0.03] rounded-xl border border-white/10 text-center">
                      <Bed className="text-blue-400 mb-2" size={20} />
                      <span className="text-xl font-bold text-white">
                        {result.amenities.hotels.count}
                      </span>
                      <span className="text-xs text-gray-400">Hotels</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-white/[0.03] rounded-xl border border-white/10 text-center">
                      <Activity className="text-red-400 mb-2" size={20} />
                      <span className="text-xl font-bold text-white">
                        {result.amenities.hospitals.count}
                      </span>
                      <span className="text-xs text-gray-400">Hospitals</span>
                    </div>
                  </div>

                  {result.risk.worstPoint && (
                    <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                      <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <ShieldAlert size={16} /> Worst Stretch
                      </h4>
                      <p className="text-sm text-gray-300">
                        We detected a high risk zone with an AQI of{' '}
                        <span className="font-bold text-orange-400">
                          {result.risk.worstPoint.aqi}
                        </span>{' '}
                        along your route. Ensure your windows are rolled up and
                        air recirculation is active.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-1 bg-white/[0.02] backdrop-blur-[24px] border border-white/[0.04] rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center text-center shadow-2xl">
              <NavIcon size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No Route Selected
              </h3>
              <p className="text-sm text-gray-500">
                Enter your start location and destination to analyze
                environmental risks along your journey.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};