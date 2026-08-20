import express from 'express';
import {
  getLocations,
  saveLocation,
  deleteLocation,
  searchLocations,
} from '../controllers/locationController.js';
import { protect } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { saveLocationSchema } from '../validators/locationValidators.js';

const router = express.Router();

router.get('/search', searchLocations);

router
  .route('/')
  .get(protect, getLocations)
  .post(protect, validateRequest(saveLocationSchema), saveLocation);

router.route('/:id').delete(protect, deleteLocation);

export default router;
