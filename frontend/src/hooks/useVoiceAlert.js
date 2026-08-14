import { useCallback } from 'react';
import useStore from '../store/useStore';

export const useVoiceAlert = () => {
  const language = useStore((state) => state.language);
  const voiceAlertsEnabled = useStore((state) => state.voiceAlertsEnabled);

  const speak = useCallback(
    (text, force = false) => {
      // Only speak if forced (e.g. manual button click) or if voice alerts are enabled globally
      if (!force && !voiceAlertsEnabled) return;

      if (!('speechSynthesis' in window)) {
        console.warn('Speech Synthesis not supported in this browser.');
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set appropriate language locale
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    },
    [language, voiceAlertsEnabled]
  );

  return { speak };
};
