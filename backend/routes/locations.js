import express from 'express';
import Location from '../models/Location.js';

const router = express.Router();

// Mock user for now since auth isn't fully implemented in DEVICE 1 yet.
const MOCK_USER_ID = "60d0fe4f5311236168a109ca";

router.post('/', async (req, res) => {
    try {
        const { name, lat, lng } = req.body;
        const newLocation = new Location({ userId: MOCK_USER_ID, name, lat, lng });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ error: "Failed to save location" });
    }
});

router.get('/', async (req, res) => {
    try {
        const locations = await Location.find({ userId: MOCK_USER_ID });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch locations" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.json({ message: "Location deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete location" });
    }
});

export default router;
