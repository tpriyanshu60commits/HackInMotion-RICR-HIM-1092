import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/current', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: "Latitude and longitude are required" });
        }

        // Open-Meteo for air quality and weather
        const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,us_aqi&timezone=auto`;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;

        const [aqResponse, weatherResponse] = await Promise.all([
            axios.get(aqUrl),
            axios.get(weatherUrl)
        ]);

        res.json({
            aqi: aqResponse.data.current.us_aqi,
            pm2_5: aqResponse.data.current.pm2_5,
            pm10: aqResponse.data.current.pm10,
            temperature: weatherResponse.data.current.temperature_2m,
            humidity: weatherResponse.data.current.relative_humidity_2m,
            windSpeed: weatherResponse.data.current.wind_speed_10m,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch environmental data" });
    }
});

router.get('/forecast', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: "Latitude and longitude are required" });
        }

        const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=us_aqi,pm2_5&timezone=auto&forecast_days=2`;
        const response = await axios.get(aqUrl);

        res.json({
            hourly: response.data.hourly
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch forecast" });
    }
});

export default router;
