import admin from 'firebase-admin';

export const initFirebaseAdmin = () => {
  try {
    if (admin.apps.length === 0) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
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
  if (!fcmToken || admin.apps.length === 0) return;
  
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data
    });
    console.log(`Push notification sent to ${fcmToken.substring(0, 10)}...`);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
};
