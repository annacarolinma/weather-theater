export default class WeatherController {
  constructor(service, ui) {
    this.service = service;
    this.ui = ui;
  }

  async loadWeather(city = '') {
    try {
      const data = city ? await this.service.fetchByCity(city) : await this.service.fetchByGeo();
      console.log("Dados recebidos:", data);
      this.ui.updateCurrentWeather(data.temp);
      this.ui.updateForecast(data.forecast);
      this.ui.updateDailyForecast(data.dailyForecast);
    } catch (error) {
      console.error("Erro ao obter clima:", error);
      alert(error.message);
    }
  }
}
