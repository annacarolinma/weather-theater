import moment from 'moment';

export default class WeatherUI {
  constructor({ tempElem, feelsElem, iconElem, placeElem, hourlyContainer, dailyContainer, messages }) {
    this.tempElem = tempElem;
    this.feelsElem = feelsElem;
    this.iconElem = iconElem;
    this.placeElem = placeElem;
    this.hourlyContainer = hourlyContainer;
    this.dailyContainer = dailyContainer;
    this.messages = messages;
    this.weatherTypeToImage = {
      clear: 'assets/images/sunny.png',
      clouds: 'assets/images/clouds.png',
      rain: 'assets/images/rainy.png',
      snow: 'assets/images/snow.png',
      thunderstorm: 'assets/images/Thunderstorm.png',
      drizzle: 'assets/images/partlycloudy.png',
      mist: 'assets/images/mist.png',
    };
  }

  updateCurrentWeather({ icon, temperature, feels_like, city }) {
    if (icon) this.iconElem.src = icon;
    if (temperature !== undefined) this.tempElem.textContent = temperature;
    if (feels_like !== undefined) this.feelsElem.textContent = `feels like ${feels_like}`;
    if (city) this.placeElem.textContent = city;
  }

  updateForecast(forecastData) {
    this.hourlyContainer.innerHTML = '';
    if (!forecastData || forecastData.length === 0) {
      this.hourlyContainer.textContent = this.messages.noHourlyForecast;
      return;
    }
    forecastData.forEach(({ time, temperature, icon }) => {
      const item = document.createElement('div');
      item.classList.add('forecast-item');
      item.innerHTML = `
        <img class="forecast-icon" src="${icon}" alt="Icon at ${time}">
        <span class="forecast-time">${time}</span>
        <span class="forecast-temp">${temperature}</span>
      `;
      this.hourlyContainer.appendChild(item);
    });
  }

  createDailyForecastCards(dailyData) {
    this.dailyContainer.innerHTML = '';
    const limitedData = dailyData.slice(0, 5);

    limitedData.forEach((dayData, index) => {
      const imageSrc = this.weatherTypeToImage[dayData.weatherType.toLowerCase()] || '';
      const dayName = moment(dayData.date).format('dddd');
      const formattedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
      const formattedWeatherType = dayData.weatherType.charAt(0).toUpperCase() + dayData.weatherType.slice(1).toLowerCase();

      const card = document.createElement('div');
      card.classList.add('card-day-temp');
      card.innerHTML = `
        <h6 id="what-is-day-${index}">${formattedDayName}</h6>
        <img id="weatherImage-${index}" src="${imageSrc}" alt="Weather image for ${formattedWeatherType}">
        <div class="card-content">
          <div class="title">
            <p id="weather-title-${index}">${formattedWeatherType}</p>
            <p id="tempera-${index}">${dayData.min} / ${dayData.max}</p>
          </div>
          <div class="img-card-content">
            <img id="weatherIcon-Card-${index}" src="${dayData.icon}" alt="Weather icon small" width="30" height="30">
          </div>
        </div>
      `;
      this.dailyContainer.appendChild(card);
    });
  }

  updateDailyForecast(dailyData) {
    if (!dailyData || dailyData.length === 0) {
      this.dailyContainer.textContent = this.messages.noDailyForecast;
      return;
    }
    this.createDailyForecastCards(dailyData);
  }
}
