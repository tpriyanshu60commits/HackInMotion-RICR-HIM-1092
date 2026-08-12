import express from 'express';
import { protect } from '../middleware/auth.js';
import { askQuestion, getHistory, clearHistory } from '../controllers/aiController.js';

const router = express.Router();

// All AI routes require authentication
router.use(protect);

router.post('/ask', askQuestion);
router.get('/history', getHistory);
router.delete('/history', clearHistory);

export default router;
