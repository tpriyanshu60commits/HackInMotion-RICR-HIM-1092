import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  saveProfile,
  getProfile,
  generateReport,
  getLatestReport,
} from '../controllers/aiHealthController.js';

const router = express.Router();

router.route('/profile').post(protect, saveProfile).get(protect, getProfile);

router.post('/report/generate', protect, generateReport);
router.get('/report/latest', protect, getLatestReport);

export default router;
