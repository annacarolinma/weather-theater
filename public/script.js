document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city');
    const tempElement = document.getElementById('temp');
    const feelsElement = document.getElementById('feel');
    const weatherIconElement = document.getElementById('weatherIcon');
    const placeElement = document.getElementById('city-temp');
    const searchCityButton = document.getElementById('search-city');
    const date = document.getElementById('dateelem');
    const hour = document.getElementById('hour');
    const forecastcontainer = document.getElementById('hourly-container');
    const dailyContainer = document.querySelector('.temp-next-days');


    // Atualizador de Hora
    function updateTimeHour() {
        moment.locale('en');
        date.textContent = moment().format("dddd, MMMM Do YYYY");
        hour.textContent = moment().format("h:mm");
    }

    // UI Updater 
    const UIUpdater = {
        updateCurrentWeather(tempData) {
            if (tempData.icon) weatherIconElement.src = tempData.icon;
            if (tempData.temperature) tempElement.innerHTML = `${tempData.temperature}`;
            if (tempData.feels_like) feelsElement.innerHTML = `feels like ${tempData.feels_like}`;
            if (tempData.city) placeElement.innerHTML = `${tempData.city}`;
        },

        updateForecast(forecastData) {
            forecastcontainer.innerHTML = '';
            if (!forecastData || forecastData.length === 0) {
                forecastcontainer.innerHTML = 'Previsões não disponíveis';
                return;
            }

            forecastData.forEach(({ time, temperature, icon }) => {
                const item = document.createElement('div');
                item.classList.add('forecast-item');

                item.innerHTML = `
                    <img class="forecast-icon" src="${icon}">
                    <span class="forecast-time">${time}</span>
                    <span class="forecast-temp">${temperature}</span>
                `;

                forecastcontainer.appendChild(item);
            });
        },

        // Corrigido: sintaxe de método sem "function"
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
                // coloque os tipos que quiser
            };

            // Pega só os 5 primeiros dias
            const limitedData = dailyData.slice(0, 5);

            limitedData.forEach((dayData, index) => {
            const imageSrc = weatherTypeToImage[dayData.weatherType.toLowerCase()];   

            // Formata o nome do dia (já deve vir capitalizado do moment, mas garantimos)
            const dayName = moment(dayData.date).format('dddd');
            const formattedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();

            // Formata o tipo de clima (ex: "broken clouds" → "Broken clouds")
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

        updateDailyForecastItem(index, dayData) {
            const weatherTitle = document.getElementById(`weather-title-${index}`);
            const temp = document.getElementById(`tempera-${index}`);
            const rainyPercent = document.getElementById(`rainy-percent-${index}`);
            const weatherImage = document.getElementById(`weatherImage-${index}`);
            const weatherIconCard = document.getElementById(`weatherIcon-Card-${index}`);

            if (weatherTitle) weatherTitle.textContent = dayData.weatherType || '';
            if (temp) temp.textContent = `Min: ${dayData.min} - Max: ${dayData.max}`;
            if (rainyPercent) rainyPercent.textContent = dayData.rainyPercent || '';
            if (weatherImage) weatherImage.src = dayData.icon || '';
            if (weatherIconCard) weatherIconCard.src = dayData.icon || '';
        },

        // Método para atualizar todos os cards do forecast diário (chama createDailyForecastCards)
        updateDailyForecast(dailyData) {
            if (!dailyData || dailyData.length === 0) {
                dailyContainer.innerHTML = 'Previsões diárias não disponíveis';
                return;
            }
            this.createDailyForecastCards(dailyData);
        }
    };

    // Estratégias de Busca 
    const WeatherService = {
        async fetchByCity(city) {
            const response = await fetch(`/weather?city=${city}`);
            return await response.json();
        },

        async fetchByGeo() {
            try {
                const position = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
                const { latitude: lat, longitude: lon } = position.coords;
                const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
                return await response.json();
            } catch (error) {
                alert("Não foi possível acessar sua localização.");
                throw error;
            }
        }
    };

    // Controlador Principal 
    async function loadWeather(city = '') {
        try {
            const data = city
                ? await WeatherService.fetchByCity(city)
                : await WeatherService.fetchByGeo();

            console.log("Dados recebidos:", data);
            UIUpdater.updateCurrentWeather(data.temp);
            UIUpdater.updateForecast(data.forecast);
            UIUpdater.updateDailyForecast(data.dailyForecast);

        } catch (error) {
            console.error("Erro ao obter clima:", error);
        }
    }

    // Inicialização 
    updateTimeHour();
    setInterval(updateTimeHour, 1000);
    loadWeather();
    setInterval(() => loadWeather(), 600000); // 10 minutos

    cityInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) loadWeather(city);
            else alert("Por favor, insira o nome de uma cidade.");
        }
    });

    searchCityButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) loadWeather(city);
        else alert("Por favor, insira o nome de uma cidade.");
    });
});
