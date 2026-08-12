import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { type, severity, description, lat, lng } = req.body;
        const newReport = new Report({ type, severity, description, lat, lng });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: "Failed to create report" });
    }
});

router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 }).limit(50);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});

export default router;
