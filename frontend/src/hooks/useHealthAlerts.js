import { useMemo } from 'react';
import useStore from '../store/useStore';
import { healthAlertRules } from '../data/healthAlertRules';
import { useSimulatedWearable } from './useSimulatedWearable';

export const useHealthAlerts = () => {
  
  // Profile
  const userName = useStore(state => state.userName);
  const diagnosedConditions = useStore(state => state.diagnosedConditions);
  const prescribedMedication = useStore(state => state.prescribedMedication);
  const wearableConnected = useStore(state => state.wearableConnected);
  
  // Environment
  const currentAQI = useStore(state => state.currentAQI);
  
  // Wearable Stats
  const wearableStats = useSimulatedWearable(currentAQI);

  const alerts = useMemo(() => {
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

    return generatedAlerts;
  }, [userName, diagnosedConditions, prescribedMedication, wearableConnected, currentAQI, wearableStats]);

  // Generate a comprehensive summary paragraph
  const userAge = useStore(state => state.userAge);
  const getSummary = () => {
    if (!userName || diagnosedConditions.length === 0) return null;
    
    let summary = `Hi ${userName}`;
    if (userAge) summary += ` (Age: ${userAge})`;
    
    summary += `. Based on your active health profile including ${diagnosedConditions.join(', ')}`;
    
    if (currentAQI <= 50) {
      summary += `, today's air quality is excellent. Your conditions are at minimal risk, making it a great day for outdoor activities.`;
    } else if (currentAQI <= 100) {
      summary += `, today's moderate air quality might pose a slight risk. If you feel any discomfort, consider reducing prolonged outdoor exertion.`;
    } else if (currentAQI <= 150) {
      summary += `, today's air quality is unhealthy for sensitive groups. It is highly recommended that you limit outdoor activities and ensure you have your medications accessible.`;
    } else {
      summary += `, today's air quality is hazardous. You are at significant risk of exacerbating your conditions. Please stay indoors, keep windows closed, and run an air purifier if available.`;
    }
    
    return summary;
  };

  return { alerts, wearableStats, summary: getSummary() };
};
