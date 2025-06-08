export default class EventHandler {
  constructor(cityInput, searchBtn, weatherController, messages) {
    this.cityInput = cityInput;
    this.searchBtn = searchBtn;
    this.weatherController = weatherController;
    this.messages = messages;
  }

  init() {
    this.searchBtn.addEventListener('click', () => this.handleCitySearch());
    this.cityInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.handleCitySearch();
    });
  }

  handleCitySearch() {
    const city = this.cityInput.value.trim();
    if (city) {
      this.weatherController.loadWeather(city);
    } else {
      alert(this.messages.emptyCity);
    }
  }
}
