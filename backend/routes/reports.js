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

const router = express.Router();

router.post('/', upload.single('photo'), createReport);
router.get('/', getAllReports);
router.get('/mine/:userId', getMyReports);
router.get('/:id', getReportById);
router.patch('/:id/status', updateStatus);
router.post('/:id/upvote', upvoteReport);
router.post('/:id/escalate', escalateToCMHelp);
router.get('/:id/accept-escalation', acceptEscalation);

export default router;
