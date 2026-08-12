import React from 'react';

export const StatCard = ({ title, icon: Icon, value, unit, statusText, statusColor }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
      {/* Tiny mini sparkline background effect (CSS based pseudo element or simple div) */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>

      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-300 text-xs font-medium uppercase tracking-wider">{title}</span>
        {Icon && <Icon className="text-gray-400 w-4 h-4" />}
      </div>
      
      <div className="flex items-baseline gap-1 mt-1 z-10">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        {unit && <span className="text-gray-300 text-sm">{unit}</span>}
      </div>

      {statusText && (
        <div className="mt-3 flex items-center gap-1.5 z-10">
          <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
          <span className={`text-xs font-medium ${statusColor.replace('bg-', 'text-')}`}>
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};
