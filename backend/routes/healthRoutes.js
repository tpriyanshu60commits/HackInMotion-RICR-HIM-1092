import express from 'express';
import { uploadHealthReport, downloadReportPDF } from '../controllers/healthReportController.js';
import { protect } from '../middleware/auth.js';
import uploadHealthReportMiddleware from '../middleware/uploadHealthReport.js';

const router = express.Router();

router.post('/report', protect, uploadHealthReportMiddleware.single('image'), uploadHealthReport);
router.get('/report/pdf', protect, downloadReportPDF);

export default router;
