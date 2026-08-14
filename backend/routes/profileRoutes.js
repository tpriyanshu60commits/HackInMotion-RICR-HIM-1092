import express from 'express';
import {
  getProfile,
  updateBasicProfile,
  getHealthProfile,
  updateHealthProfile,
  getNotificationSettings,
  updateNotificationSettings,
  getPreferences,
  updatePreferences,
  getPrivacySettings,
  updatePrivacySettings,
  exportData,
  deleteAccount,
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all profile routes
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateBasicProfile)
  .delete(deleteAccount);

router.route('/health')
  .get(getHealthProfile)
  .put(updateHealthProfile);

router.route('/notifications')
  .get(getNotificationSettings)
  .put(updateNotificationSettings);

router.route('/preferences')
  .get(getPreferences)
  .put(updatePreferences);

router.route('/privacy')
  .get(getPrivacySettings)
  .put(updatePrivacySettings);

router.get('/export', exportData);

export default router;
