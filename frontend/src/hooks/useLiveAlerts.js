import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';
import { alertRules } from '../data/alertRules';
import { useAlertSound } from './useAlertSound';
import { useVoiceAlert } from './useVoiceAlert';

export const useLiveAlerts = () => {
  const [activeToast, setActiveToast] = useState(null);
  const [queue, setQueue] = useState([]);
  
  // Data sources from the store
  const weatherCondition = useStore(state => state.weatherCondition);
  const currentAQI = useStore(state => state.currentAQI);
  const currentTemp = useStore(state => state.currentTemp);
  const language = useStore(state => state.language);
  const location = useStore(state => state.location);
  
  const playSound = useAlertSound();
  const { speak } = useVoiceAlert();

  // Evaluate rules every 60 seconds
  useEffect(() => {
    const evaluateRules = () => {
      const data = { weatherCondition, currentAQI, currentTemp };
      const todayDateStr = new Date().toDateString();
      const shownAlerts = JSON.parse(localStorage.getItem('shown_live_alerts') || '{}');
      
      const newAlerts = [];

      alertRules.forEach(rule => {
        if (rule.condition(data)) {
          // Check de-duplication: Have we shown this rule today?
          const cacheKey = `${rule.id}-${todayDateStr}`;
          if (!shownAlerts[cacheKey]) {
            newAlerts.push(rule);
            shownAlerts[cacheKey] = true;
          }
        }
      });

      if (newAlerts.length > 0) {
        localStorage.setItem('shown_live_alerts', JSON.stringify(shownAlerts));
        setQueue(prev => [...prev, ...newAlerts]);
      }
    };

    // Run immediately on mount, then every 60s
    evaluateRules();
    const interval = setInterval(evaluateRules, 60000);

    return () => clearInterval(interval);
  }, [weatherCondition, currentAQI, currentTemp]);

  // Process the queue
  useEffect(() => {
    if (!activeToast && queue.length > 0) {
      // Pull next alert from queue
      const nextAlert = queue[0];
      setQueue(prev => prev.slice(1));
      
      // Construct the toast object
      const toastData = {
        id: nextAlert.id + Date.now(),
        ruleId: nextAlert.id,
        category: nextAlert.category,
        icon: nextAlert.icon,
        severity: nextAlert.severity,
        message: nextAlert.messages[language] || nextAlert.messages.en,
        locationName: location?.name || 'Current Location',
        timestamp: new Date()
      };

      setActiveToast(toastData);
      
      // Fire effects
      playSound();
      speak(toastData.message);

      // Auto-dismiss after 7 seconds
      const timeout = setTimeout(() => {
        setActiveToast(null);
      }, 7000);

      return () => clearTimeout(timeout);
    }
  }, [queue, activeToast, language, location, playSound, speak]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return {
    activeToast,
    dismissToast
  };
};
