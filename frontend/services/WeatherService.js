/**
 * Serviço para buscar dados meteorológicos.
 * Disponibiliza métodos para consulta por cidade ou por geolocalização do usuário.
 */
export default class WeatherService {
  /**
   * Busca informações do clima com base no nome da cidade.
   * 
   * @param {string} city - Nome da cidade para consulta.
   * @returns {Promise<Object>} Dados meteorológicos em formato JSON.
   * @throws {Error} Se a requisição para obter o clima falhar.
   */
  static async fetchByCity(city) {
    const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    if (!response.ok) throw new Error('Erro na requisição por cidade');
    return await response.json();
  }

  /**
   * Busca informações do clima com base na geolocalização atual do usuário.
   * Solicita permissão para acessar a localização via navegador.
   * 
   * @returns {Promise<Object>} Dados meteorológicos em formato JSON.
   * @throws {Error} Se a requisição para obter o clima falhar ou se o acesso à geolocalização for negado.
   */
  static async fetchByGeo() {
    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
    const { latitude: lat, longitude: lon } = position.coords;
    const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Erro na requisição por geolocalização');
    return await response.json();
  }
}
