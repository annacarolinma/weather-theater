/**
 * Controlador responsável por orquestrar a obtenção dos dados meteorológicos
 * e atualizar a interface do usuário.
 */
export default class WeatherController {
  /*** Cria uma instância do controlador de clima. */
  constructor(service, ui) {
    this.service = service;
    this.ui = ui;
  }

  /*** Carrega os dados meteorológicos e atualiza a interface do usuário.*/
  async loadWeather(city = '') {
    try {
      // Busca dados do clima pela cidade ou pela localização atual
      const data = city
        ? await this.service.fetchByCity(city)
        : await this.service.fetchByGeo();

      console.log("Dados recebidos:", data);

      // Atualiza a interface com os dados obtidos
      this.ui.updateCurrentWeather(data.temp);
      this.ui.updateForecast(data.forecast);
      this.ui.updateDailyForecast(data.dailyForecast);

    } catch (error) {
      console.error("Erro ao obter clima:", error);
      alert(error.message);
    }
  }
}
