import express from 'express';
import Location from '../models/Location.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
        const { name, latitude, longitude } = req.body;
        const newLocation = new Location({ userId: req.user._id, name, latitude, longitude });
        await newLocation.save();
        res.status(201).json({ success: true, data: newLocation });
    } catch (_error) {
        res.status(500).json({ success: false, error: "Failed to create location" });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const locations = await Location.find({ userId: req.user._id });
        res.json({ success: true, data: locations });
    } catch (_error) {
        res.status(500).json({ success: false, error: "Failed to fetch locations" });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        await Location.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true, message: "Location deleted" });
    } catch (_error) {
        res.status(500).json({ success: false, error: "Failed to delete location" });
    }
});

export default router;
