import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.post('/logout', logoutUser);

router
  .route('/me')
  .get(protect, getUserProfile)
  .put(protect, validateRequest(updateProfileSchema), updateUserProfile);

// For backwards compatibility with the PRD naming 'profile'
router.put('/profile', protect, validateRequest(updateProfileSchema), updateUserProfile);

export default router;
