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
        
        // Also add them to the persistent notification dropdown store
        newAlerts.forEach(alert => {
          useStore.getState().addAlert({
            title: 'Live Alert',
            message: alert.messages[language] || alert.messages.en,
            type: alert.severity === 'red' || alert.severity === 'orange' ? 'danger' : alert.severity === 'amber' ? 'warning' : 'info',
            timestamp: new Date()
          });
        });
      }
    };

    // Run immediately on mount, then every 2 mins (120000 ms)
    evaluateRules();
    const interval = setInterval(evaluateRules, 120000);

    // TEMPORARY: Send 1 single demo alert
    const demoTimeout = setTimeout(() => {
      const sampleAlert = {
        id: `demo-alert-${Date.now()}`,
        category: 'health',
        icon: alertRules[1].icon,
        severity: 'amber',
        messages: {
          en: `Demo Alert: This should hide automatically in 2 seconds.`,
          hi: `डेमो अलर्ट: यह 2 सेकंड में छिप जाना चाहिए।`
        }
      };
      
      setQueue(prev => [...prev, sampleAlert]);
      
      useStore.getState().addAlert({
        title: `Test Alert`,
        message: sampleAlert.messages.en,
        type: 'warning',
        timestamp: new Date()
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(demoTimeout);
    };
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
    }
  }, [queue, activeToast, language, location, playSound, speak]);

  // Handle auto-dismiss separately so it doesn't get cancelled by the queue effect re-running
  useEffect(() => {
    if (activeToast) {
      const timeout = setTimeout(() => {
        setActiveToast(null);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [activeToast]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return {
    activeToast,
    dismissToast
  };
};
