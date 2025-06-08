import fetch from 'node-fetch';

/**
 * Classe para comunicação com a API OpenWeather.
 * Responsável por buscar dados de clima atual, previsão e coordenadas por cidade.
 */
class OpenWeatherApi {
    /**
     * Inicializa com a chave da API.
     * @param {string} apiKey - Chave de autenticação da OpenWeather.
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    /**
     * Busca o clima atual para coordenadas geográficas.
     * @param {number} lat - Latitude.
     * @param {number} lon - Longitude.
     * @returns {Promise<Object>} Dados do clima atual.
     * @throws Erro se a API retornar erro.
     */
    async fetchCurrentWeather(lat, lon) {
        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        return data;
    }

    /**Busca a previsão de clima para coordenadas geográficas.*/
    async fetchForecast(lat, lon) {
        const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== "200") throw new Error('Erro ao obter previsão.');
        return data;
    }

    /*** Busca coordenadas geográficas a partir do nome da cidade.*/
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
