import express from 'express';
import WeatherService from '../services/WeatherService.js';

const router = express.Router();
const weatherService = new WeatherService();

router.get('/', async (req, res) => {
    try {
        const query = {
            city: req.query.city,
            lat: req.query.lat,
            lon: req.query.lon
        };
        const data = await weatherService.fetchWeatherData(query);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
