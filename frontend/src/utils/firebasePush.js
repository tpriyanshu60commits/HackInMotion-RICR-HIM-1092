import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import api from '../services/api';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let messaging;

try {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (error) {
  console.log('Firebase initialization error', error);
}

export const requestFirebaseNotificationPermission = async () => {
  try {
    if (!messaging) return null;
    
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { 
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY 
      });
      
      if (currentToken) {
        // Send the token to the backend
        await api.post('/profile/fcm-token', { token: currentToken });
        console.log('FCM token sent to backend');
        return currentToken;
      }
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
  return null;
};
