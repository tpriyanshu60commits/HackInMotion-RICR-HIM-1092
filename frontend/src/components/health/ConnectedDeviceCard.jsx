import React from 'react';
import { Watch, Heart, Activity } from 'lucide-react';
import useStore from '../../store/useStore';
import { useSimulatedWearable } from '../../hooks/useSimulatedWearable';
import { cn } from '../common/GlassCard';

export const ConnectedDeviceCard = () => {
  const wearableConnected = useStore(state => state.wearableConnected);
  const setWearableConnected = useStore(state => state.setWearableConnected);
  const currentAQI = useStore(state => state.currentAQI);
  
  const stats = useSimulatedWearable(currentAQI);

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col h-full relative overflow-hidden">
      
      {/* Background glow if connected */}
      {wearableConnected && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-xl border transition-colors",
            wearableConnected ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" : "bg-white/5 border-white/10 text-gray-400"
          )}>
            <Watch size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Connected Devices</h3>
            <p className="text-xs text-gray-400">Smartwatch / Health Tracker</p>
          </div>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={wearableConnected}
            onChange={(e) => setWearableConnected(e.target.checked)}
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
        </label>
      </div>

      <div className={cn(
        "flex-1 flex flex-col justify-center transition-all duration-500",
        wearableConnected ? "opacity-100 translate-y-0" : "opacity-30 pointer-events-none translate-y-2"
      )}>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          
          {/* Heart Rate */}
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group">
            <Heart className={cn("text-rose-500 mb-2 transition-transform", wearableConnected && "animate-pulse")} size={24} />
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white tracking-tight">{wearableConnected ? stats.heartRate : '--'}</span>
              <span className="text-xs text-gray-400 font-medium">bpm</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
            <Activity className="text-blue-400 mb-2" size={24} />
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white tracking-tight">{wearableConnected ? stats.spo2 : '--'}</span>
              <span className="text-xs text-gray-400 font-medium">%</span>
            </div>
          </div>

        </div>

        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
            Simulated data for demo purposes — not a substitute for medical advice.
          </p>
        </div>

      </div>

    </div>
  );
};
