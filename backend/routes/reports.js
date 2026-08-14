import express from 'express';
import upload from '../middleware/upload.js';
import {
  createReport,
  getAllReports,
  getMyReports,
  getReportById,
  updateStatus,
  upvoteReport,
  escalateToCMHelp,
  acceptEscalation
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('photo'), createReport);
router.get('/', getAllReports);
router.get('/mine/:userId', protect, getMyReports);
router.get('/:id', getReportById);
router.patch('/:id/status', protect, updateStatus);
router.post('/:id/upvote', protect, upvoteReport);
router.post('/:id/escalate', protect, escalateToCMHelp);
router.get('/:id/accept-escalation', acceptEscalation);

export default router;
