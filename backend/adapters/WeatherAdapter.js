import WeatherIconMap from '../utils/weatherIconMap.js';

export function adaptCurrentWeather(data) {
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
