import express from 'express';
import {
  getCurrentEnvironmentByCoords,
  getCurrentEnvironmentByCity,
  getHistoricalEnvironment,
  compareCities,
} from '../controllers/environmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Allow public access to some endpoints if needed, but for personalized risk, we protect them
// If we want public access, we can create an optionalAuth middleware instead.
// For now, let's protect them as we want personalized risk.
router.get('/current', protect, getCurrentEnvironmentByCoords);
router.get('/city', protect, getCurrentEnvironmentByCity);
router.get('/history', protect, getHistoricalEnvironment);

// Compare cities might be optionally authenticated, but protect for simplicity
router.get('/compare', protect, compareCities);

export default router;
