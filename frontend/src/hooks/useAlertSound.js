import { useCallback } from 'react';
import useStore from '../store/useStore';

// A tiny, pleasant base64 "chime" sound (so it doesn't fail if an MP3 file is missing)
const BASE64_CHIME =
  'data:audio/wav;base64,UklGRmIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTwAAACgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoK';

export const useAlertSound = () => {
  const isMuted = useStore((state) => state.isMuted);

  const playSound = useCallback(() => {
    if (isMuted) return;

    try {
      // In a real production app, you might use an actual MP3 file like:
      // const audio = new Audio('/sounds/alert-soft.mp3');
      const audio = new Audio(BASE64_CHIME);
      audio.volume = 0.5; // Soft volume

      // Some browsers block autoplay until user interaction, so we catch the promise
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Browser blocked alert sound (needs user interaction first):', error);
        });
      }
    } catch (e) {
      console.error('Failed to play sound', e);
    }
  }, [isMuted]);

  return playSound;
};
