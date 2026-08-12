import React from 'react';
import { MapPin, Smile } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const mockData = [
  { value: 45 }, { value: 42 }, { value: 48 }, { value: 40 },
  { value: 42 }, { value: 46 }, { value: 42 }
];

export const AQICard = () => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] flex flex-col relative overflow-hidden w-full max-w-md mx-auto">
      
      {/* Top Row */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">Air Quality Index</span>
        <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 text-xs font-bold tracking-wide">Live</span>
        </div>
      </div>

      {/* Main Value */}
      <div className="flex items-end gap-4 mb-2">
        <span className="text-7xl font-extrabold text-white leading-none tracking-tighter">42</span>
        <div className="flex items-center gap-1 mb-2">
          <Smile className="text-emerald-400 w-6 h-6" />
          <span className="text-emerald-400 text-xl font-semibold">Good</span>
        </div>
      </div>
      
      <p className="text-gray-400 text-xs mb-6">Updated 2 min ago</p>

      {/* Location Tags */}
      <div className="flex gap-2 mb-8">
        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
          <MapPin className="text-gray-300 w-3.5 h-3.5" />
          <span className="text-gray-200 text-xs font-medium">New Delhi, India</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 opacity-50 cursor-not-allowed">
          <MapPin className="text-gray-400 w-3.5 h-3.5" />
          <span className="text-gray-400 text-xs font-medium">New Delhi, India</span>
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="h-20 w-full mt-auto -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#34d399" 
              strokeWidth={3} 
              dot={false} 
              isAnimationActive={true}
              animationDuration={2000}
              filter="url(#glow)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
