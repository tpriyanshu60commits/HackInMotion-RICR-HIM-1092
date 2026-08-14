import express from 'express';
import { getSnapshots } from '../controllers/snapshotController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:locationId', protect, getSnapshots);

export default router;
