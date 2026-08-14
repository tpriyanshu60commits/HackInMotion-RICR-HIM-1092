import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

export const initFirebaseAdmin = () => {
  try {
    if (getApps().length === 0) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        initializeApp({
          credential: cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully');
      } else {
        console.log('FIREBASE_SERVICE_ACCOUNT_KEY missing, FCM disabled in development');
      }
    }
  } catch (err) {
    console.error('Firebase Admin initialization error:', err);
  }
};

export const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  if (!fcmToken || getApps().length === 0) return;
  
  try {
    await getMessaging().send({
      token: fcmToken,
      notification: { title, body },
      data
    });
    console.log(`Push notification sent to ${fcmToken.substring(0, 10)}...`);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
};
