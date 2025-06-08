import Config from '../config/Config.js';
import OpenWeatherApi from '../gateways/OpenWeatherApi.js';
import LocationStrategy from '../strategies/LocationStrategy.js';
import { adaptCurrentWeather } from '../adapters/WeatherAdapter.js';
import {
    createHourlyForecast,
    createDailyForecast
} from '../factories/ForecastFactory.js';

/**
 * Serviço para obter dados de clima atual e previsões,
 * usando localização e API externa.
 */
class WeatherService {
    constructor({
        config = new Config(),
        weatherApi = null,
        locationStrategy = null
    } = {}) {
        this.apiKey = config.getApiKey();
        this.api = weatherApi || new OpenWeatherApi(this.apiKey);
        this.locator = locationStrategy || new LocationStrategy(this.api);
    }

    /**
     * Busca dados climáticos por cidade ou coordenadas.
     * @param {Object} query - { city?, lat?, lon? }
     * @returns {Promise<Object>} Dados atuais e previsão horária e diária.
     */
    async fetchWeatherData(query) {
        const { city, lat, lon } = query;

        let coords = city
            ? await this.locator.fromCity(city)
            : await this.locator.fromCoords(lat, lon);

        const currentData = await this.api.fetchCurrentWeather(coords.lat, coords.lon);
        const forecastData = await this.api.fetchForecast(coords.lat, coords.lon);

        return {
            temp: adaptCurrentWeather(currentData),
            forecast: createHourlyForecast(forecastData.list),
            dailyForecast: createDailyForecast(forecastData.list)
        };
    }
}

export default WeatherService;
