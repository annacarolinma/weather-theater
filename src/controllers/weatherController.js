import { fetchWeatherData } from '../models/weatherModel.js';

export const getWeather = async (req, res) => {
    try {
        const data = await fetchWeatherData(req.query);
        res.json(data);
    } catch (error) {
        console.error('Erro no controller:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do clima.' });
    }
};
