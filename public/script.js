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
