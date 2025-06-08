import fetch from 'node-fetch';

class OpenWeatherApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    async fetchCurrentWeather(lat, lon) {
        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        return data;
    }

    async fetchForecast(lat, lon) {
        const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== "200") throw new Error('Erro ao obter previsão.');
        return data;
    }

    async fetchCoordsFromCity(city) {
        const url = `${this.baseUrl}/weather?q=${city}&units=metric&appid=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) throw new Error('Cidade não encontrada.');
        return {
            lat: data.coord.lat,
            lon: data.coord.lon
        };
    }
}

export default OpenWeatherApi;
