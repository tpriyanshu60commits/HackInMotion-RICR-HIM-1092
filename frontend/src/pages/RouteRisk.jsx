import React, { useState } from 'react';
import { Navigation as NavIcon, MapPin, Play, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

export const RouteRisk = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        overallRisk: 'MODERATE',
        exposure: '32 min',
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

  // Mock route line for visual flair on the map
  const routePositions = [
    [24.5373, 81.3042],
    [24.1, 80.8],
    [23.8, 80.1],
    [23.5, 78.8],
    [23.2599, 77.4126]
  ];

  return (
    <div 
      className="min-h-full relative px-4 lg:px-8 py-8 animate-fade-in flex flex-col"
     style={{
  backgroundImage: `
    linear-gradient(
      rgba(1, 11, 7, 0.4),
      rgba(0, 0, 0, 0.4)
    ),
    url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop")
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
}}
    >
      <div className="max-w-[1600px] w-full mx-auto flex flex-col h-full gap-8">
        
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">Route Risk</h1>
          <p className="text-sm text-gray-400">Find the safest route based on current environmental conditions</p>
        </div>

        {/* Location Inputs (Glass Bar) */}
        <div className="w-full bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-4 lg:p-6 shadow-2xl flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
          
          <div className="flex-1 w-full relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center group-focus-within:bg-green-400/10 group-focus-within:border-green-400/20 transition-all">
              <MapPin size={16} className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
            </div>
            <input 
              type="text" 
              defaultValue="New Delhi, India"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-16 pr-4 py-4 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium transition-all"
            />
          </div>

          <ArrowRight className="text-gray-500 hidden lg:block shrink-0" size={20} />

          <div className="flex-1 w-full relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center group-focus-within:bg-green-400/10 group-focus-within:border-green-400/20 transition-all">
              <MapPin size={16} className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
            </div>
            <input 
              type="text" 
              defaultValue="Gurgaon, India"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-16 pr-4 py-4 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium transition-all"
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
              
              {/* Map Dark CSS Filter Wrapper */}
              <div className="absolute inset-0 z-0 [&_.leaflet-layer]:brightness-[0.4] [&_.leaflet-layer]:contrast-[1.2] [&_.leaflet-layer]:grayscale-[0.8] [&_.leaflet-layer]:invert-[1] [&_.leaflet-layer]:hue-rotate-[180deg]">
                <MapContainer center={[24.5373, 81.3042]} zoom={6} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <Marker position={[24.5373, 81.3042]} />
                  <Marker position={[23.2599, 77.4126]} />
                  {result && (
                    <Polyline 
                      positions={routePositions} 
                      pathOptions={{ color: '#F59E0B', weight: 4, opacity: 0.8, className: 'animate-pulse' }} 
                    />
                  )}
                </MapContainer>
              </div>

              {/* Floating Overlay on map */}
              <div className="absolute top-6 left-6 z-[400] bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/10 shadow-lg font-semibold text-sm flex items-center gap-2 text-white">
                <MapPin size={16} className="text-green-400"/>
                Live Route Analysis
              </div>

            </div>
          </div>

          {/* Risk Summary Container (30%) */}
          {result ? (
            <div className="col-span-1 bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-6 lg:p-8 hover:bg-white/[0.04] transition-all duration-300 ease-out hover:-translate-y-[2px] flex flex-col shadow-2xl">
              
              <h2 className="text-lg font-semibold text-white mb-8 pb-4 border-b border-white/[0.05]">Route Risk</h2>
              
              {/* Massive Score */}
              <div className="mb-10 flex flex-col">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Overall Status</span>
                <div className="flex items-baseline gap-4">
                  {/* Mock score mapping to existing Moderate text */}
                  <span className="text-6xl font-black text-white leading-none tracking-tighter">
                    78
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"></span>
                    <span className="text-base font-bold uppercase tracking-wider text-yellow-500">
                      {result.overallRisk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exposure Highlight */}
              <div className="mb-10 p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                <span className="text-sm text-cyan-400/80 uppercase font-semibold tracking-wider block mb-1">Estimated Exposure</span>
                <span className="text-2xl font-bold text-cyan-400">{result.exposure}</span>
              </div>

              {/* Compact Metric Rows for Warnings/Recs */}
              <div className="space-y-8 flex-1 flex flex-col">
                
                <div>
                  <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <ShieldAlert size={16} /> Warnings
                  </h4>
                  <div className="space-y-1">
                    {result.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-3 py-3 border-b border-white/[0.05] hover:bg-white/[0.02] -mx-3 px-3 rounded transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></span>
                        <span className="text-sm text-gray-300 leading-relaxed">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-green-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <CheckCircle2 size={16} /> Recommendations
                  </h4>
                  <div className="space-y-1">
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 py-3 border-b border-transparent hover:bg-white/[0.02] -mx-3 px-3 rounded transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                        <span className="text-sm text-gray-300 leading-relaxed">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="col-span-1 bg-white/[0.02] backdrop-blur-[24px] border border-white/[0.04] rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center text-center shadow-2xl">
              <NavIcon size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Route Selected</h3>
              <p className="text-sm text-gray-500">Enter your start location and destination to analyze environmental risks along your journey.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
