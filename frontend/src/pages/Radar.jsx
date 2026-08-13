import React, { useState, useEffect } from 'react';
import { PageTransition } from '../components/common/PageTransition';
import { GlassCard } from '../components/common/GlassCard';
import { Activity } from 'lucide-react';
import { cn } from '../components/common/GlassCard';
import { environmentService } from '../services/api';
import useStore from '../store/useStore';
import { WaterDropLoader } from '../components/common/WaterDropLoader';

const RADAR_POLLUTANTS = ['PM2.5', 'PM10', 'O₃', 'NO₂', 'SO₂', 'CO'];
const ANGLES = RADAR_POLLUTANTS.map((_, i) => (i * 360) / RADAR_POLLUTANTS.length - 90);

const getColor = (val, max) => {
  const pct = val / max;
  if (pct <= 0.3) return '#4ADE80';
  if (pct <= 0.6) return '#FACC15';
  if (pct <= 0.8) return '#FB923C';
  return '#F87171';
};

export const Radar = () => {
  const location = useStore((state) => state.location);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const lat = location?.lat || 28.6139;
      const lng = location?.lng || 77.2090;
      try {
        const res = await environmentService.getCurrentByCoords(lat, lng);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location]);

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><WaterDropLoader message="Scanning pollution..." /></div>;

  const maxVals = { 'PM2.5': 75, 'PM10': 150, 'O₃': 180, 'NO₂': 200, 'SO₂': 150, 'CO': 15000 };
  const values = data ? [data.pm25, data.pm10, data.o3, data.no2, data.so2, data.co] : [0,0,0,0,0,0];

  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const rings = [0.25, 0.5, 0.75, 1];

  const points = values.map((val, i) => {
    const max = Object.values(maxVals)[i] || 100;
    const r = Math.min(1, (val || 0) / max) * (size / 2 - 30);
    const angle = (ANGLES[i] * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      val,
      name: RADAR_POLLUTANTS[i],
      color: getColor(val || 0, max),
    };
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <PageTransition>
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main drop-shadow-md">Pollution Radar</h1>
          <p className="text-text-muted mt-1">Animated radar visualization of current pollutant levels.</p>
        </div>

        <GlassCard className="flex flex-col items-center justify-center p-8">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="drop-shadow-lg">
              {/* Concentric rings */}
              {rings.map((r, i) => (
                <circle key={i} cx={cx} cy={cy} r={r * (size / 2 - 30)} fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
              ))}

              {/* Axis lines */}
              {ANGLES.map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const ex = cx + (size / 2 - 30) * Math.cos(rad);
                const ey = cy + (size / 2 - 30) * Math.sin(rad);
                return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="var(--border-color)" strokeWidth="1" opacity="0.3" />;
              })}

              {/* Data polygon */}
              <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="2" />

              {/* Data points */}
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="6" fill={p.color} stroke="white" strokeWidth="2" className="drop-shadow-sm" />
              ))}

              {/* Radar sweep line */}
              <line x1={cx} y1={cy} x2={cx} y2={30} stroke="rgba(99,102,241,0.4)" strokeWidth="2" className="radar-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }} />
            </svg>

            {/* Labels */}
            {ANGLES.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const lx = cx + (size / 2 - 8) * Math.cos(rad);
              const ly = cy + (size / 2 - 8) * Math.sin(rad);
              return (
                <div key={i} className="absolute text-[10px] font-bold text-text-muted -translate-x-1/2 -translate-y-1/2" style={{ left: lx, top: ly }}>
                  {RADAR_POLLUTANTS[i]}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            {points.map((p, i) => (
              <div key={i} className="glass-inner rounded-xl px-3 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs font-bold text-text-main">{p.name}</span>
                <span className="text-xs text-text-muted">{p.val ?? '--'}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
};
