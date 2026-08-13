import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { healthAlertRules } from '../data/healthAlertRules';
import { useSimulatedWearable } from './useSimulatedWearable';

export const useHealthAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  
  // Profile
  const userName = useStore(state => state.userName);
  const diagnosedConditions = useStore(state => state.diagnosedConditions);
  const prescribedMedication = useStore(state => state.prescribedMedication);
  const wearableConnected = useStore(state => state.wearableConnected);
  
  // Environment
  const currentAQI = useStore(state => state.currentAQI);
  
  // Wearable Stats
  const wearableStats = useSimulatedWearable(currentAQI);

  useEffect(() => {
    const profile = {
      userName,
      diagnosedConditions,
      prescribedMedication,
      wearableConnected
    };

    const envData = {
      aqi: currentAQI,
      wearable: wearableConnected ? wearableStats : null
    };

    const generatedAlerts = [];

    healthAlertRules.forEach(rule => {
      if (rule.appliesIf(profile) && rule.triggersIf(envData)) {
        generatedAlerts.push({
          id: rule.id,
          severity: rule.severity,
          message: rule.buildMessage(profile, envData)
        });
      }
    });

    // If no specific rules match, provide a fallback generic alert based on AQI
    if (generatedAlerts.length === 0) {
      if (currentAQI > 100) {
        generatedAlerts.push({
          id: 'fallback-poor',
          severity: 'amber',
          message: `${userName || 'Friend'}, the air quality is poor today. Take care.`
        });
      }
    }

    setAlerts(generatedAlerts);
  }, [userName, diagnosedConditions, prescribedMedication, wearableConnected, currentAQI, wearableStats]);

  return { alerts, wearableStats };
};
