import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin } from 'lucide-react';
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
  const windSpeed = useStore(state => state.windSpeed || 0);
  const uvIndex = useStore(state => state.uvIndex || 0);
  const humidity = useStore(state => state.humidity || 0);
  const pressure = useStore(state => state.pressure || 1013);
  const language = useStore(state => state.language);
  const location = useStore(state => state.location);

  const playSound = useAlertSound();
  const { speak } = useVoiceAlert();

  const dataRef = useRef(null);
  const locationRef = useRef(null);

  // ─── Rule Evaluation ──────────────────────────────────────────────────────
  useEffect(() => {
    const currentData = { weatherCondition, currentAQI, currentTemp, windSpeed, uvIndex, humidity, pressure };

    if (!dataRef.current) {
      dataRef.current = currentData;
    }

    // Fire location change summary alert if data is loaded for the new location
    if (location && location.name !== locationRef.current && weatherCondition && currentAQI) {
      locationRef.current = location.name;
      
      const isBad = currentAQI > 100 || weatherCondition === 'rain' || weatherCondition === 'thunderstorm';
      
      const locAlert = {
        id: `loc-change-${Date.now()}`,
        category: 'location',
        type: isBad ? 'bad' : 'good',
        icon: MapPin,
        messages: {
          en: isBad 
            ? `${location.name} has ${weatherCondition === 'rain' || weatherCondition === 'thunderstorm' ? 'rain/storms' : 'poor air quality'} right now — check details before heading out.`
            : `Weather looks pleasant in ${location.name} right now.`,
          hi: isBad 
            ? `${location.name} में अभी मौसम/हवा खराब है — बाहर जाने से पहले जाँच लें।`
            : `${location.name} में अभी मौसम सुहावना लग रहा है।`
        }
      };
      
      setQueue(prev => [...prev, locAlert]);
    }

    const interval = setInterval(() => {
      const latestData = { weatherCondition, currentAQI, currentTemp, windSpeed, uvIndex, humidity, pressure };
      
      if (dataRef.current) {
        const prevData = dataRef.current;
        const todayDateStr = new Date().toDateString();
        const shownAlerts = JSON.parse(
          localStorage.getItem('shown_live_alerts') || '{}'
        );

        const newAlerts = [];

        alertRules.forEach(rule => {
          if (rule.condition(prevData, latestData)) {
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

          newAlerts.forEach(alert => {
            useStore.getState().addAlert({
              title: 'Live Alert',
              message: alert.messages[language] || alert.messages.en,
              type: alert.type === 'bad' ? 'danger' : 'success',
              timestamp: new Date(),
            });
          });
        }
      }

      dataRef.current = latestData;
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [weatherCondition, currentAQI, currentTemp, windSpeed, uvIndex, humidity, pressure, language, location]);

  // ─── Queue Processor ──────────────────────────────────────────────────────
  useEffect(() => {
    if (activeToast || queue.length === 0) return;

    const nextAlert = queue[0];

    const processTimeout = setTimeout(() => {
      setQueue(prev => prev.slice(1));

      const toastData = {
        id: nextAlert.id + Date.now(),
        ruleId: nextAlert.id,
        category: nextAlert.category,
        icon: nextAlert.icon,
        type: nextAlert.type,
        message: nextAlert.messages[language] || nextAlert.messages.en,
        locationName: location?.name || 'Current Location',
        timestamp: new Date(),
      };

      setActiveToast(toastData);

      playSound();
      speak(toastData.message);
    }, 0);

    return () => clearTimeout(processTimeout);
  }, [queue, activeToast, language, location, playSound, speak]);

  // ─── Auto-dismiss ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeToast) return;

    const timeout = setTimeout(() => {
      setActiveToast(null);
    }, 5000);

    return () => clearTimeout(timeout);
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