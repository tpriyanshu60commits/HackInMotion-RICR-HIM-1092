import express from 'express';
import { getAlerts, markAlertAsRead, deleteAlert } from '../controllers/alertController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getAlerts);
router.route('/:id/read').put(protect, markAlertAsRead);
router.route('/:id').delete(protect, deleteAlert);

export default router;
