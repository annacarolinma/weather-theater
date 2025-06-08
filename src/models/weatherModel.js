import fetch from 'node-fetch';
import WeatherIconMap from '../utils/weatherIconMap.js';

// 🧩 Singleton – para centralizar o acesso à chave da API
class Config {
    constructor() {
        if (Config.instance) return Config.instance;
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        if (!this.apiKey) throw new Error('Chave da API não configurada');
        Config.instance = this;
    }

    getApiKey() {
        return this.apiKey;
    }
}

// 🔁 Strategy – para seleção de estratégia de localização
const locationStrategy = {
    async fromCity(city, apiKey) {
        const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const res = await fetch(geoUrl);
        const data = await res.json();
        if (data.cod !== 200) throw new Error('Cidade não encontrada.');
        return { lat: data.coord.lat, lon: data.coord.lon };
    },

    async fromCoords(lat, lon) {
        if (!lat || !lon) throw new Error('Coordenadas inválidas');
        return { lat, lon };
    }
};

// 🔌 Adapter – para adaptar dados da API para seu modelo interno
function adaptCurrentWeather(data) {
    const id = data.weather[0].id;
    const iconCode = data.weather[0].icon;
    const isDay = iconCode.endsWith('d');

    return {
        city: data.name,
        country: data.sys.country,
        temperature: `${Math.round(data.main.temp)}°`,
        feels_like: `${Math.round(data.main.feels_like)}°`,
        weather: data.weather[0].description,
        icon: WeatherIconMap[id]?.[isDay ? 'day' : 'night'] || 'Erro: icon not found'
    };
}

// 🏭 Factory Method – para criar objetos de previsão
function createForecastItem(hour) {
    const id = hour.weather[0].id;
    const iconCode = hour.weather[0].icon;
    const isDay = iconCode.endsWith('d');

    return {
        time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            hour12: true
        }).toLowerCase(),
        temperature: `${Math.round(hour.main.temp)}°`,
        icon: WeatherIconMap[id]?.[isDay ? 'day' : 'night'] || 'Erro: icon not found'
    };
}

function groupForecastByDay(forecastList) {
    const days = {};

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0]; // yyyy-mm-dd
        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(item);
    });

    return days;
}


function createDailyForecastFromGrouped(daysGrouped) {
    const dailyForecast = [];

    for (const [date, items] of Object.entries(daysGrouped)) {
        let minTemp = Infinity;
        let maxTemp = -Infinity;

        // Escolhe o ícone do horário mais próximo do meio-dia (12h) ou o primeiro do dia
        const noonItem = items.find(i => new Date(i.dt * 1000).getHours() === 12) || items[0];
        const weatherId = noonItem.weather[0].id;
        const iconCode = noonItem.weather[0].icon;
        const isDay = iconCode.endsWith('d');

        // 🔍 Tipo de clima
        const weatherType = noonItem.weather[0].main.toLowerCase(); // exemplo: "Rain", "Clouds", "Clear"

        items.forEach(item => {
            if (item.main.temp_min < minTemp) minTemp = item.main.temp_min;
            if (item.main.temp_max > maxTemp) maxTemp = item.main.temp_max;
        });

        dailyForecast.push({
            date,
            min: `${Math.round(minTemp)}°`,
            max: `${Math.round(maxTemp)}°`,
            icon: WeatherIconMap[weatherId]?.[isDay ? 'day' : 'night'] || 'Erro: icon not found',
            weatherType 
        });
    }

    return dailyForecast;
}

function getDailyForecastFromForecastList(forecastList) {
    const grouped = groupForecastByDay(forecastList);
    return createDailyForecastFromGrouped(grouped);
}

// 🚀 Função principal
export async function fetchWeatherData(query) {
    const config = new Config();
    const apiKey = config.getApiKey();

    let { city, lat, lon } = query;
    city = city?.trim();

    let coords;
    if (city) {
        coords = await locationStrategy.fromCity(city, apiKey);
    } else {
        coords = await locationStrategy.fromCoords(lat, lon);
    }

    // Dados de clima atual
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    // Dados de previsão
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();
    if (forecastData.cod !== "200") throw new Error('Erro ao obter previsão.');

    const icon = adaptCurrentWeather(weatherData).icon;

    const forecast = forecastData.list.map(hour => createForecastItem(hour));
    const dailyForecast = getDailyForecastFromForecastList(forecastData.list);

    return {
        temp: adaptCurrentWeather(weatherData),
        forecast,
        dailyForecast
    };
}
