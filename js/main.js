import Clock from './utils/Clock.js';
import WeatherService from './services/WeatherService.js';
import WeatherUI from './ui/WeatherUI.js';
import WeatherController from './controllers/WeatherController.js';
import EventHandler from './events/EventHandler.js';

document.addEventListener('DOMContentLoaded', () => {
  const MESSAGES = {
    emptyCity: "Por favor, insira o nome de uma cidade.",
    locationError: "Não foi possível acessar sua localização.",
    noHourlyForecast: "Previsões não disponíveis",
    noDailyForecast: "Previsões diárias não disponíveis"
  };

  // Elementos DOM
  const cityInput = document.getElementById('city');
  const tempElement = document.getElementById('temp');
  const feelsElement = document.getElementById('feel');
  const weatherIconElement = document.getElementById('weatherIcon');
  const placeElement = document.getElementById('city-temp');
  const searchCityButton = document.getElementById('search-city');
  const dateElement = document.getElementById('dateelem');
  const hourElement = document.getElementById('hour');
  const hourlyForecastContainer = document.getElementById('hourly-container');
  const dailyContainer = document.querySelector('.temp-next-days');

  // Instanciando classes
  const clock = new Clock(dateElement, hourElement);
  const weatherUI = new WeatherUI({
    tempElem: tempElement,
    feelsElem: feelsElement,
    iconElem: weatherIconElement,
    placeElem: placeElement,
    hourlyContainer: hourlyForecastContainer,
    dailyContainer,
    messages: MESSAGES
  });
  const weatherController = new WeatherController(WeatherService, weatherUI);
  const eventHandler = new EventHandler(cityInput, searchCityButton, weatherController, MESSAGES);

  clock.start();
  weatherController.loadWeather();
  eventHandler.init();

  setInterval(() => weatherController.loadWeather(), 10 * 60 * 1000);
});
