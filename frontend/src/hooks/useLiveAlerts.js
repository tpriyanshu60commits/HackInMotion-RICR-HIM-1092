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

  // ─── Rule Evaluation ──────────────────────────────────────────────────────
  useEffect(() => {
    const evaluateRules = () => {
      const data = { weatherCondition, currentAQI, currentTemp };
      const todayDateStr = new Date().toDateString();
      const shownAlerts = JSON.parse(
        localStorage.getItem('shown_live_alerts') || '{}'
      );

      const newAlerts = [];

      alertRules.forEach(rule => {
        if (rule.condition(data)) {
          // De-duplication: only show each rule once per day
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

        // Persist to notification dropdown store
        newAlerts.forEach(alert => {
          useStore.getState().addAlert({
            title: 'Live Alert',
            message: alert.messages[language] || alert.messages.en,
            type:
              alert.severity === 'red' || alert.severity === 'orange'
                ? 'danger'
                : alert.severity === 'amber'
                  ? 'warning'
                  : 'info',
            timestamp: new Date(),
          });
        });
      }
    };

    // Run immediately on mount, then every 2 minutes
    evaluateRules();
    const interval = setInterval(evaluateRules, 120000);

    return () => {
      clearInterval(interval);
    };
  }, [weatherCondition, currentAQI, currentTemp, language]);

  // ─── Queue Processor ──────────────────────────────────────────────────────
  useEffect(() => {
    if (activeToast || queue.length === 0) return;      // ✅ cleaner guard

    const nextAlert = queue[0];

    // Defer to avoid synchronous cascading renders
    const processTimeout = setTimeout(() => {
      setQueue(prev => prev.slice(1));

      const toastData = {
        id: nextAlert.id + Date.now(),
        ruleId: nextAlert.id,
        category: nextAlert.category,
        icon: nextAlert.icon,
        severity: nextAlert.severity,
        message: nextAlert.messages[language] || nextAlert.messages.en,
        locationName: location?.name || 'Current Location',
        timestamp: new Date(),
      };

      setActiveToast(toastData);    // ✅ master: inside setTimeout

      // Fire side effects
      playSound();
      speak(toastData.message);
    }, 0);

    return () => clearTimeout(processTimeout);          // ✅ master: cleanup
  }, [queue, activeToast, language, location, playSound, speak]);

  // ─── Auto-dismiss ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeToast) return;

    const timeout = setTimeout(() => {
      setActiveToast(null);
    }, 7000);                                           // ✅ master: 7s not 2s

    return () => clearTimeout(timeout);                 // ✅ single cleanup
  }, [activeToast]);

  // ─── Manual Dismiss ───────────────────────────────────────────────────────
  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  return {
    activeToast,
    dismissToast,
  };
};