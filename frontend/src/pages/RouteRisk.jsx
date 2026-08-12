import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { Navigation as NavIcon, MapPin, AlertTriangle, Play } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export const RouteRisk = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        overallRisk: 'MODERATE',
        exposure: 'Medium',
        warnings: [
          'High PM2.5 levels detected near bypass road.',
          'Traffic congestion causing localized pollution spikes.'
        ],
        recommendations: [
          'Keep windows rolled up during commute.',
          'Use vehicle air recirculation mode.',
          'Consider leaving 20 mins earlier to avoid peak exposure.'
        ]
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Route Risk Planner</h1>
        <p className="text-text-muted">Analyze environmental exposure along your journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Input Panel */}
        <div className="col-span-1 space-y-6 flex flex-col">
          <GlassCard className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></div>
              <input 
                type="text" 
                placeholder="Start Location" 
                defaultValue="Home (Rewa)"
                className="w-full bg-surface/50 border border-border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            
            <div className="ml-5 border-l-2 border-dashed border-border h-4"></div>
            
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500" size={18} />
              <input 
                type="text" 
                placeholder="Destination" 
                defaultValue="Work (Bhopal)"
                className="w-full bg-surface/50 border border-border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-500 font-medium"
              />
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <span className="flex items-center gap-2 animate-pulse">
                  Analyzing Route <span className="animate-spin text-white">↻</span>
                </span>
              ) : (
                <span className="flex items-center gap-2"><Play size={18} fill="currentColor"/> Analyze Route</span>
              )}
            </button>
          </GlassCard>

          {/* Results Panel */}
          {result && (
            <GlassCard className="flex-1 animate-fade-in-up border-primary-500/30 bg-primary-500/5">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-lg">Route Analysis</h3>
                <RiskBadge level={result.overallRisk} />
              </div>

              <div className="mb-6">
                <span className="text-sm font-semibold text-text-muted uppercase tracking-wider block mb-1">Estimated Exposure</span>
                <div className="text-2xl font-black text-primary-600 dark:text-primary-400">{result.exposure}</div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-bold flex items-center gap-2 text-red-500 text-sm">
                  <AlertTriangle size={16} /> Route Warnings
                </h4>
                <ul className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span> {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-emerald-500 text-sm">
                  <NavIcon size={16} /> Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Map View */}
        <GlassCard className="col-span-1 lg:col-span-2 min-h-[400px] lg:min-h-full p-2 relative overflow-hidden flex flex-col">
          <div className="absolute top-4 left-4 z-[400] bg-surface/90 backdrop-blur-md px-4 py-2 rounded-lg border border-border shadow-md font-semibold text-sm flex items-center gap-2">
            <MapPin size={16} className="text-primary-500"/>
            Live Environmental Map
          </div>
          <div className="w-full h-full rounded-xl overflow-hidden flex-1 z-0">
            {/* 
              Leaflet requires fixed height, 
              using inline style for simplicity since h-full sometimes struggles with flex children 
            */}
            <MapContainer center={[24.5373, 81.3042]} zoom={6} style={{ height: '100%', minHeight: '400px', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <Marker position={[24.5373, 81.3042]}>
                <Popup>
                  <div className="font-bold">Rewa</div>
                  <div className="text-sm">AQI: 78 (Moderate)</div>
                </Popup>
              </Marker>
              <Marker position={[23.2599, 77.4126]}>
                <Popup>
                  <div className="font-bold">Bhopal</div>
                  <div className="text-sm">AQI: 185 (Unhealthy)</div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
