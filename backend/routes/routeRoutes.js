import express from 'express';
import { analyzeRoute } from '../controllers/routeController.js';

const router = express.Router();

// POST /api/route/analyze
router.post('/analyze', analyzeRoute);

export default router;
