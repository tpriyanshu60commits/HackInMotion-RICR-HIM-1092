import React from 'react';
import { cn } from './GlassCard';

const getColor = (value, thresholds) => {
  if (value <= thresholds[0]) return 'text-risk-good';
  if (value <= thresholds[1]) return 'text-risk-moderate';
  if (value <= thresholds[2]) return 'text-risk-unhealthy';
  return 'text-risk-hazardous';
};

const getBarColor = (value, thresholds) => {
  if (value <= thresholds[0]) return 'bg-risk-good';
  if (value <= thresholds[1]) return 'bg-risk-moderate';
  if (value <= thresholds[2]) return 'bg-risk-unhealthy';
  return 'bg-risk-hazardous';
};

// WHO annual guideline thresholds [good, moderate, unhealthy]
const POLLUTANT_THRESHOLDS = {
  'PM2.5': [15, 35, 55],
  'PM10': [45, 100, 150],
  'O₃': [60, 100, 140],
  'NO₂': [40, 80, 120],
  'SO₂': [40, 80, 120],
  'CO': [4400, 9400, 15400],
};

export const PollutantChip = ({ name, value, unit = 'µg/m³', max }) => {
  const thresholds = POLLUTANT_THRESHOLDS[name] || [50, 100, 150];
  const displayMax = max || thresholds[2] * 1.5;
  const pct = Math.min(100, (value / displayMax) * 100);
  const color = getColor(value, thresholds);
  const barColor = getBarColor(value, thresholds);

  return (
    <div className="glass-inner rounded-xl p-3 flex flex-col gap-2 min-w-[100px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{name}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-lg font-black", color)}>{value ?? '--'}</span>
        <span className="text-[9px] text-text-muted font-medium">{unit}</span>
      </div>
      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
        <div className={cn("h-1.5 rounded-full transition-all duration-700", barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
