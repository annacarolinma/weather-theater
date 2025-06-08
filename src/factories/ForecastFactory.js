import WeatherIconMap from '../utils/weatherIconMap.js';

function createForecastItem(hourData) {
    const id = hourData.weather[0].id;
    const iconCode = hourData.weather[0].icon;
    const isDay = iconCode.endsWith('d');

    return {
        time: new Date(hourData.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            hour12: true
        }).toLowerCase(),
        temperature: `${Math.round(hourData.main.temp)}°`,
        icon: WeatherIconMap[id]?.[isDay ? 'day' : 'night'] || 'Erro: icon not found'
    };
}

function groupForecastByDay(forecastList) {
    const days = {};

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0]; // yyyy-mm-dd
        if (!days[date]) days[date] = [];
        days[date].push(item);
    });

    return days;
}

function createDailyForecastFromGrouped(groupedDays) {
    const dailyForecast = [];

    for (const [date, items] of Object.entries(groupedDays)) {
        let minTemp = Infinity;
        let maxTemp = -Infinity;

        const noonItem = items.find(i => new Date(i.dt * 1000).getHours() === 12) || items[0];
        const weatherId = noonItem.weather[0].id;
        const iconCode = noonItem.weather[0].icon;
        const isDay = iconCode.endsWith('d');
        const weatherType = noonItem.weather[0].main.toLowerCase();

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

function createHourlyForecast(list) {
    return list.map(createForecastItem);
}

function createDailyForecast(list) {
    const grouped = groupForecastByDay(list);
    return createDailyForecastFromGrouped(grouped);
}

export {
    createHourlyForecast,
    createDailyForecast
};
