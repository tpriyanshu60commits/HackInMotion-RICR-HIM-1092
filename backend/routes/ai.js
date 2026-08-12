import express from 'express';
import { askAI } from '../services/aiService.js';

const router = express.Router();

router.post('/ask', async (req, res) => {
    try {
        const { message, contextData } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        
        const response = await askAI(message, contextData);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: "AI service failed to respond" });
    }
});

export default router;
