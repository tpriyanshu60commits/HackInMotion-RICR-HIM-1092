import { useState, useEffect } from 'react';
import useStore from '../store/useStore';

export const useSimulatedWearable = (currentAQI) => {
  const wearableConnected = useStore(state => state.wearableConnected);
  
  // Initial baseline stats
  const [stats, setStats] = useState({
    heartRate: 75,
    spo2: 98
  });

  useEffect(() => {
    if (!wearableConnected) return;

    const driftStats = () => {
      setStats(prev => {
        // Base drift logic: AQI affects the baseline slightly
        let targetSpO2 = 98;
        let targetHR = 75;

        if (currentAQI > 150) {
          targetSpO2 = 95; // SpO2 dips in bad air
          targetHR = 85;   // Heart rate increases due to strain
        } else if (currentAQI > 100) {
          targetSpO2 = 96;
          targetHR = 80;
        }

        // Add some random natural fluctuation (-1 to +1 for SpO2, -3 to +3 for HR)
        const fluctuationSpO2 = Math.floor(Math.random() * 3) - 1; 
        const fluctuationHR = Math.floor(Math.random() * 7) - 3;

        let newSpO2 = targetSpO2 + fluctuationSpO2;
        let newHR = targetHR + fluctuationHR;

        // Clamp values to realistic ranges
        if (newSpO2 > 100) newSpO2 = 100;
        if (newSpO2 < 90) newSpO2 = 90;
        if (newHR > 120) newHR = 120;
        if (newHR < 50) newHR = 50;

        // Smooth transition (move 1 step towards target to avoid jarring jumps)
        return {
          heartRate: prev.heartRate < newHR ? prev.heartRate + 1 : prev.heartRate > newHR ? prev.heartRate - 1 : newHR,
          spo2: prev.spo2 < newSpO2 ? prev.spo2 + 1 : prev.spo2 > newSpO2 ? prev.spo2 - 1 : newSpO2
        };
      });
    };

    // Drift every 5 seconds for visual effect
    const interval = setInterval(driftStats, 5000);
    return () => clearInterval(interval);
  }, [wearableConnected, currentAQI]);

  return stats;
};
