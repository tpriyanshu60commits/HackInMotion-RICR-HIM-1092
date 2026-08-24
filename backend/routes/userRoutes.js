import express from 'express';
import {
  updateExtendedProfile,
  uploadProfileImage,
  deleteProfileImage,
  deleteAccount,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import uploadAvatar from '../middleware/uploadAvatar.js';

const router = express.Router();

router.patch('/profile', protect, updateExtendedProfile);
router.post('/profile-image', protect, uploadAvatar.single('image'), uploadProfileImage);
router.delete('/profile-image', protect, deleteProfileImage);
router.delete('/me', protect, deleteAccount);

export default router;
