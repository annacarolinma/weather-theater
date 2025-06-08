import WeatherIconMap from '../utils/weatherIconMap.js';

/**
 * Converte os dados brutos da API de clima para um formato mais simples e útil.
 * 
 * @param {Object} data - Dados retornados da API de clima atual.
 * @returns {Object} Objeto com informações essenciais do clima adaptadas.
 */
export function adaptCurrentWeather(data) {
    // Pega o código do clima (ex: 800 para céu limpo)
    const id = data.weather[0].id;
    
    // Pega o código do ícone do clima (ex: "10d" - chuva durante o dia)
    const iconCode = data.weather[0].icon;
    
    // Verifica se é dia ("d") ou noite ("n") com base no código do ícone
    const isDay = iconCode.endsWith('d');

    return {
        // Nome da cidade
        city: data.name,
        
        // Código do país (ex: "BR", "US")
        country: data.sys.country,
        
        // Temperatura atual arredondada e com símbolo de grau
        temperature: `${Math.round(data.main.temp)}°`,
        
        // Sensação térmica arredondada e com símbolo de grau
        feels_like: `${Math.round(data.main.feels_like)}°`,
        
        // Descrição textual do clima atual (ex: "clear sky")
        weather: data.weather[0].description,
        
        // Ícone correspondente ao clima e período do dia (dia ou noite)
        // Se não encontrar, retorna mensagem de erro
        icon: WeatherIconMap[id]?.[isDay ? 'day' : 'night'] || 'Erro: icon not found'
    };
}
