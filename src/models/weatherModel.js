import WeatherService from '../services/WeatherService.js';

const weatherService = new WeatherService();

export async function getWeather(req, res) {
    try {
        const query = {
            city: req.query.city,
            lat: req.query.lat,
            lon: req.query.lon
        };
        const result = await weatherService.fetchWeatherData(query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
