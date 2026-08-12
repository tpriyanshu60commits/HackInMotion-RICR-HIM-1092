import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { HeartPulse, Shield, Info, Activity } from 'lucide-react';

export const Profile = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-500 mb-4">
          <HeartPulse size={40} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Health & Sensitivities</h1>
        <p className="text-text-muted max-w-lg mx-auto">
          Customize your profile to receive personalized environmental safety guidance. 
          <br/><span className="text-xs text-primary-500 mt-2 inline-block font-semibold">Not a medical diagnosis tool.</span>
        </p>
      </div>

      <GlassCard className="p-8">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Age Group</label>
              <select className="w-full bg-surface/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500">
                <option>Adult (18-64)</option>
                <option>Child (0-17)</option>
                <option>Elderly (65+)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold border-b border-border pb-2 flex items-center gap-2">
              <Activity size={18} /> Known Sensitivities
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Respiratory condition (e.g. COPD)",
                "Asthma",
                "Heart condition",
                "Outdoor worker",
                "Children in household",
                "Elderly in household"
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface/30 cursor-pointer hover:bg-surface transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-border text-primary-500 focus:ring-primary-500" />
                  <span className="font-medium text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-5 flex items-start gap-3">
            <Info className="text-primary-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-primary-800 dark:text-primary-300 text-sm mb-1">Why do we need this?</h4>
              <p className="text-xs text-primary-700/80 dark:text-primary-200/80 leading-relaxed">
                Different groups react differently to air pollution. A moderate AQI might be safe for a healthy adult but dangerous for someone with asthma. This information helps us convert raw data into meaningful, personalized safety advice.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="px-8 py-3 bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors">
              Save Preferences
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
