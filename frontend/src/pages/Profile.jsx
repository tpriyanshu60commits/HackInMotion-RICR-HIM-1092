import React from 'react';
import { HeartPulse, Activity, Info } from 'lucide-react';

export const Profile = () => {
  return (
    <div 
      className="min-h-full relative px-4 py-8 animate-fade-in flex flex-col items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10,15,13,0.94), rgba(10,15,13,0.94)), url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Centered Glassmorphism Container */}
      <div className="w-full max-w-[650px] bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col">
        
        {/* Profile Header (Repurposed for Health Info) */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/[0.04] border-2 border-green-300/40 shadow-[0_0_25px_rgba(74,222,128,0.15)] text-green-400 mb-6">
            <HeartPulse size={40} />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-2">Health & Sensitivities</h1>
          <p className="text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
            Customize your profile to receive personalized environmental safety guidance. 
            <br/><span className="text-xs text-green-400/80 mt-2 block font-medium uppercase tracking-wider">Not a medical diagnosis tool.</span>
          </p>
        </div>

        {/* Action List (Form) */}
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Age Group</label>
            <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all appearance-none cursor-pointer">
              <option className="bg-[#0A0F0D]">Adult (18-64)</option>
              <option className="bg-[#0A0F0D]">Child (0-17)</option>
              <option className="bg-[#0A0F0D]">Elderly (65+)</option>
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Activity size={18} className="text-green-400" /> Known Sensitivities
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Respiratory condition (e.g. COPD)",
                "Asthma",
                "Heart condition",
                "Outdoor worker",
                "Children in household",
                "Elderly in household"
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black/50 text-green-500 focus:ring-green-500 focus:ring-offset-0 cursor-pointer" />
                  <span className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5 flex items-start gap-3">
            <Info className="text-cyan-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-cyan-300 text-sm mb-1.5">Why do we need this?</h4>
              <p className="text-xs text-cyan-100/70 leading-relaxed">
                Different groups react differently to air pollution. A moderate AQI might be safe for a healthy adult but dangerous for someone with asthma. This information helps us convert raw data into meaningful, personalized safety advice.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <button className="w-full md:w-auto md:float-right px-8 py-3.5 bg-green-500/20 border border-green-400/20 text-green-300 font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.12)] hover:bg-green-500/30 hover:border-green-400/40 hover:-translate-y-[1px] transition-all duration-300">
              Save Preferences
            </button>
            <div className="clear-both"></div>
          </div>
        </form>

      </div>
    </div>
  );
};
