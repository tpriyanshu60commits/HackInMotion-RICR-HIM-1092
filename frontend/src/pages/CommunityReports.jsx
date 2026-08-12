import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { Flame, CloudFog, Factory, Trash2, ShieldAlert, Plus, MapPin } from 'lucide-react';

const REPORTS = [
  { id: 1, type: 'Waste Burning', desc: 'Large waste fire near bypass road.', location: 'Bypass Road, Rewa', time: '10 mins ago', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 2, type: 'Heavy Dust', desc: 'Construction site generating extreme dust without covers.', location: 'Civil Lines', time: '2 hours ago', icon: CloudFog, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 3, type: 'Industrial Emission', desc: 'Unusual black smoke from factory.', location: 'Industrial Area', time: '5 hours ago', icon: Factory, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export const CommunityReports = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Community Reports</h1>
          <p className="text-text-muted">Crowdsourced local environmental hazards.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">
          <Plus size={18} /> Submit Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report List */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          {REPORTS.map(report => (
            <GlassCard key={report.id} hover className="flex gap-4 items-start p-5">
              <div className={`shrink-0 w-12 h-12 rounded-2xl ${report.bg} ${report.color} flex items-center justify-center`}>
                <report.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{report.type}</h3>
                  <span className="text-xs font-semibold text-text-muted bg-surface px-2 py-1 rounded-md border border-border">
                    {report.time}
                  </span>
                </div>
                <p className="text-text-muted text-sm mb-3">{report.desc}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  <MapPin size={14} />
                  {report.location}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Submit Form Placeholder */}
        <div className="col-span-1">
          <GlassCard className="sticky top-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-4">
              <ShieldAlert size={20} className="text-primary-500" />
              File a New Report
            </h3>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Issue Type</label>
                <select className="w-full bg-surface/50 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm">
                  <option>Waste Burning</option>
                  <option>Heavy Smoke</option>
                  <option>Construction Dust</option>
                  <option>Industrial Emission</option>
                  <option>Unusual Odor</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Description</label>
                <textarea 
                  rows={3}
                  className="w-full bg-surface/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm resize-none"
                  placeholder="Describe what you see..."
                ></textarea>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border hover:bg-surface-hover rounded-xl text-sm font-semibold transition-colors text-text-main">
                <MapPin size={16} className="text-primary-500"/>
                Use Current Location
              </button>
              <button className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">
                Submit Report
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
