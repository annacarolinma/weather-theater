document.addEventListener('DOMContentLoaded', () => {
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

    const MESSAGES = {
        emptyCity: "Por favor, insira o nome de uma cidade.",
        locationError: "Não foi possível acessar sua localização.",
        noHourlyForecast: "Previsões não disponíveis",
        noDailyForecast: "Previsões diárias não disponíveis"
    };

    // Atualizador de Hora
    function updateTimeHour() {
        moment.locale('en');
        const now = moment();
        dateElement.textContent = now.format("dddd, MMMM Do YYYY");
        hourElement.textContent = now.format("h:mm");
    }

    // UI Updater 
    const UIUpdater = {
        updateCurrentWeather(tempData) {
            if (tempData.icon) weatherIconElement.src = tempData.icon;
            if (tempData.temperature) tempElement.textContent = tempData.temperature;
            if (tempData.feels_like) feelsElement.textContent = `feels like ${tempData.feels_like}`;
            if (tempData.city) placeElement.textContent = tempData.city;
        },

        updateForecast(forecastData) {
            hourlyForecastContainer.innerHTML = '';
            if (!forecastData || forecastData.length === 0) {
                hourlyForecastContainer.textContent = MESSAGES.noHourlyForecast;
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
                hourlyForecastContainer.appendChild(item);
            });
        },

        createDailyForecastCards(dailyData) {
            dailyContainer.innerHTML = ''; // limpa container

            const weatherTypeToImage = {
                clear: 'assets/images/sunny.png',
                clouds: 'assets/images/clouds.png',
                rain: 'assets/images/rainy.png',
                snow: 'assets/images/snow.png',
                thunderstorm: 'assets/images/Thunderstorm.png',
                drizzle: 'assets/images/partlycloudy.png',
                mist: 'assets/images/mist.png',
            };

            const limitedData = dailyData.slice(0, 5);

            limitedData.forEach((dayData, index) => {
                const imageSrc = weatherTypeToImage[dayData.weatherType.toLowerCase()] || '';
                const dayName = moment(dayData.date).format('dddd');
                const formattedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
                const formattedWeatherType = dayData.weatherType.charAt(0).toUpperCase() +
                    dayData.weatherType.slice(1).toLowerCase();

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

                dailyContainer.appendChild(card);
            });
        },

        updateDailyForecast(dailyData) {
            if (!dailyData || dailyData.length === 0) {
                dailyContainer.textContent = MESSAGES.noDailyForecast;
                return;
            }
            this.createDailyForecastCards(dailyData);
        }
    };

    // Estratégias de Busca 
    const WeatherService = {
        async fetchByCity(city) {
            const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
            return await response.json();
        },

        async fetchByGeo() {
            try {
                const position = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
                const { latitude: lat, longitude: lon } = position.coords;
                const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
                return await response.json();
            } catch (error) {
                alert(MESSAGES.locationError);
                throw error;
            }
        }
    };

    // Controlador Principal 
    async function loadWeather(city = '', service = WeatherService, ui = UIUpdater) {
        try {
            const data = city ? await service.fetchByCity(city) : await service.fetchByGeo();

            console.log("Dados recebidos:", data);
            ui.updateCurrentWeather(data.temp);
            ui.updateForecast(data.forecast);
            ui.updateDailyForecast(data.dailyForecast);

        } catch (error) {
            console.error("Erro ao obter clima:", error);
        }
    }

    function handleCitySearch() {
        const city = cityInput.value.trim();
        if (city) {
            loadWeather(city);
        } else {
            alert(MESSAGES.emptyCity);
        }
    }

    // Inicialização 
    updateTimeHour();
    setInterval(updateTimeHour, 1000);
    loadWeather();

    setTimeout(function refreshWeather() {
        loadWeather();
        setTimeout(refreshWeather, 600000); // 10 minutos
    }, 600000);

    cityInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleCitySearch();
    });

    searchCityButton.addEventListener('click', handleCitySearch);
});
