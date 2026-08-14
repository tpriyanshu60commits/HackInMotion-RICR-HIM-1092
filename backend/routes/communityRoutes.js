import express from 'express';
import {
  getReports,
  createReport,
  upvoteReport,
  updateReportStatus,
} from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { createReportSchema } from '../validators/communityValidators.js';

const router = express.Router();

router.route('/').get(getReports).post(protect, validateRequest(createReportSchema), createReport);

router.route('/:id/upvote').put(protect, upvoteReport);
router.route('/:id/status').put(protect, updateReportStatus);

export default router;
