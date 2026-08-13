import React, { useState } from 'react';
import { Flame, CloudFog, Factory, Plus, MapPin, ShieldAlert } from 'lucide-react';

const REPORTS = [
  { id: 1, type: 'Waste Burning', desc: 'Large waste fire near bypass road.', location: 'Bypass Road, Rewa', time: '10 mins ago', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 2, type: 'Heavy Dust', desc: 'Construction site generating extreme dust without covers.', location: 'Civil Lines', time: '2 hours ago', icon: CloudFog, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 3, type: 'Industrial Emission', desc: 'Unusual black smoke from factory.', location: 'Industrial Area', time: '5 hours ago', icon: Factory, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export const CommunityReports = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Air Quality', 'Water', 'Waste', 'Other'];

  return (
    <div 
      className="min-h-full relative px-4 lg:px-8 py-8 animate-fade-in flex flex-col items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10,15,13,0.94), rgba(10,15,13,0.94)), url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Massive Main Glass Panel */}
      <div className="w-full max-w-[1400px] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Community Reports</h1>
            <p className="text-sm text-gray-400">Environmental reports submitted by the community</p>
          </div>
          
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500/20 border border-green-400/20 text-green-300 rounded-xl text-sm font-semibold hover:bg-green-500/30 hover:border-green-400/40 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.12)]">
            <Plus size={18} /> New Report
          </button>
        </div>

        {/* Horizontal Category Filters */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-8 border-b border-white/[0.05] pb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-green-400/15 border border-green-400/20 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                  : 'bg-white/[0.025] border border-transparent text-gray-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 2-Col Layout for Reports and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Report List (Left Side) */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            {REPORTS.map(report => (
              <div 
                key={report.id} 
                className="w-full bg-white/[0.035] backdrop-blur-md border border-white/[0.08] rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center hover:bg-white/[0.055] hover:border-white/[0.15] hover:-translate-y-[2px] transition-all duration-300 ease-out group"
              >
                
                {/* Thumbnail Icon */}
                <div className={`shrink-0 w-16 h-16 rounded-xl ${report.bg} border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <report.icon size={28} className={report.color} />
                </div>
                
                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0 space-y-1">
                  <h3 className="font-semibold text-base md:text-lg text-white truncate">{report.desc}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <MapPin size={14} />
                    <span className="truncate">{report.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${report.bg} ${report.color} border-current/20`}>
                      ● {report.type}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {report.time}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Submit Form Placeholder (Right Side) */}
          <div className="col-span-1">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-6 sticky top-6 hover:border-white/[0.15] transition-colors duration-300 shadow-2xl">
              <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2 border-b border-white/[0.05] pb-4">
                <ShieldAlert size={20} className="text-green-400" />
                File a New Report
              </h3>
              
              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Issue Type</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all appearance-none">
                    <option className="bg-[#0A0F0D]">Waste Burning</option>
                    <option className="bg-[#0A0F0D]">Heavy Smoke</option>
                    <option className="bg-[#0A0F0D]">Construction Dust</option>
                    <option className="bg-[#0A0F0D]">Industrial Emission</option>
                    <option className="bg-[#0A0F0D]">Unusual Odor</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm resize-none transition-all placeholder:text-gray-600"
                    placeholder="Describe what you see..."
                  ></textarea>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] rounded-xl text-sm font-semibold transition-colors text-gray-300">
                  <MapPin size={16} className="text-green-400"/>
                  Use Current Location
                </button>
                
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl font-bold hover:bg-green-500/20 transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] mt-2">
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
