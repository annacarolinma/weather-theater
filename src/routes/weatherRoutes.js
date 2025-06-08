import express from 'express';
import { fetchWeatherData } from '../models/weatherModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await fetchWeatherData(req.query);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
