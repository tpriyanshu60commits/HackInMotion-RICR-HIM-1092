import cron from "node-cron";
import User from "../models/User.js";
import Location from "../models/Location.js";
import Alert from "../models/Alert.js";
import { getAirQualityByCoordinates } from "./airQualityService.js";

export const checkLocationsAndAlert = async () => {
  try {
    console.log("Running scheduled air quality check for user locations...");

    // Get all users who have alerts enabled
    const users = await User.find({
      $or: [
        { "alertPreferences.highRisk": true },
        { "alertPreferences.moderateRisk": true },
      ],
    });

    for (const user of users) {
      // Get user's saved locations
      const locations = await Location.find({ user: user._id });

      for (const location of locations) {
        try {
          const envData = await getAirQualityByCoordinates(
            location.latitude,
            location.longitude,
            user.healthProfile,
          );

          if (!envData) continue;

          const { risk } = envData;

          // Check for High Risk
          if (user.alertPreferences.highRisk && risk.severity >= 4) {
            // UNHEALTHY or worse
            await createAlertIfNotExists(
              user,
              location._id,
              "high-risk",
              `High Risk Alert for ${location.name}`,
              `${location.name} (${location.city}) has reached a ${risk.label} risk level (AQI: ${envData.aqi}). ${risk.explanation}`,
              envData.aqi,
            );
          }
          // Check for Moderate Risk
          else if (user.alertPreferences.moderateRisk && risk.severity === 3) {
            await createAlertIfNotExists(
              user,
              location._id,
              "moderate-risk",
              `Moderate Risk Warning for ${location.name}`,
              `${location.name} (${location.city}) is now Unhealthy for Sensitive Groups (AQI: ${envData.aqi}).`,
              envData.aqi,
            );
          }
        } catch (err) {
          console.error(
            `Error checking location ${location.name}:`,
            err.message,
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in checkLocationsAndAlert cron job:", error.message);
  }
};

import { sendPushNotification } from '../utils/firebaseAdmin.js';

const createAlertIfNotExists = async (
  user,
  locationId,
  type,
  title,
  message,
  aqiValue,
) => {
  // Check if an unread alert of the same type for this location already exists recently (e.g., last 24 hours)
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const existingAlert = await Alert.findOne({
    user: user._id,
    location: locationId,
    type,
    createdAt: { $gte: oneDayAgo },
  });

  if (!existingAlert) {
    await Alert.create({
      user: user._id,
      location: locationId,
      type,
      title,
      message,
      aqiValue,
    });
    console.log(`Created alert for user ${user._id} at location ${locationId}`);
    
    // Send Push Notification if token exists
    if (user.fcmToken) {
      await sendPushNotification(user.fcmToken, title, message, {
        locationId: locationId.toString(),
        type,
        aqiValue: aqiValue.toString()
      });
    }
  }
};

// Start the cron job
export const initCronJobs = () => {
  // Run every 2 hours
  cron.schedule("0 */2 * * *", () => {
    checkLocationsAndAlert();
  });
  console.log("Cron jobs initialized.");
};
