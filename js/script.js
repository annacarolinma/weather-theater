document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city'); // input da cidade
    const tempElement = document.getElementById('temp');
    const feelsElement = document.getElementById('feel');
    const weatherIconElement = document.getElementById('weatherIcon');
    const placeElement = document.getElementById('city-temp');
    const searchCityButton = document.getElementById('search-city');
    const date = document.getElementById('dateelem');
    const hour = document.getElementById('hour');
    const forecastcontainer = document.getElementById('hourly-container');

    function updateTimeHour() {
        moment.locale('en');

        const dateUpdate = moment().format("dddd, MMMM Do YYYY");
        const hourUpdate = moment().format("h:mm");

        date.textContent = dateUpdate;
        hour.textContent = hourUpdate;
    }


    

    async function getWeatherLocal(city = '') {
       
        let url = ''; // Inicializa a variável url


        if (city) {  // Se uma cidade for fornecida
            console.log("Requisição usando cidade:", city);
            url = `/weather?city=${city}`; // Se uma cidade for passada, monta a URL
            console.log('url:', url);
        } else {
            // Caso contrário, obtém a geolocalização e monta a URL com as coordenadas
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                url = `/weather?lat=${lat}&lon=${lon}`; // URL com as coordenadas
                console.log("Requisição usando latitude e longitude:", lat, lon);
                console.log('url:', url);
            } catch (error) {
                console.error("Erro ao obter localização:", error);
                alert("Não foi possível acessar sua localização. Tente novamente.");
                return;  // Se der erro, a função não continua
            }
        }

        // Faz a requisição
        const response = await fetch(url);
        const data = await response.json(); // Armazena os dados recebidos
        
        console.log(data); // Verifique a resposta do backend
        WeatherFetch(data); // Passa os dados para a função de atualização
    }

    // Função para atualizar a interface com os dados do clima
    function WeatherFetch(data) {
        try {

            const tempdata = data.temp;
            if (tempdata.icon) {
                weatherIconElement.src = tempdata.icon; // Usando o ícone que vem do backend
            }

            if (tempdata.temperature) {
                tempElement.innerHTML = `${tempdata.temperature}`; // Temperatura
            }

            if (tempdata.feels_like) {
                feelsElement.innerHTML = `feels like ${tempdata.feels_like}`; // Sensação térmica
            }

            if (tempdata.city) {
                placeElement.innerHTML = `${tempdata.city}`; // Cidade e país
            }
            const forecastData = data.forecast;
            forecastcontainer.innerHTML = '';

            // Se o forecastData existir e não estiver vazio, percorre as previsões
        if (forecastData && forecastData.length > 0) {
            forecastData.forEach(hourlyData => {
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                
                const forecastTime = document.createElement('span');
                forecastTime.classList.add('forecast-time');
                forecastTime.textContent = hourlyData.time; // Hora da previsão
                
                const forecastTemp = document.createElement('span');
                forecastTemp.classList.add('forecast-temp');
                forecastTemp.textContent = `${hourlyData.temperature}`; // Temperatura da previsão

                const forecastIcon = document.createElement('img');
                forecastIcon.classList.add('forecast-icon');
                forecastIcon.src = hourlyData.icon; // Ícone da previsão

                forecastItem.appendChild(forecastIcon);
                forecastItem.appendChild(forecastTime);
                forecastItem.appendChild(forecastTemp);
                forecastcontainer.appendChild(forecastItem);
            });
        } else {
            forecastElement.innerHTML = 'Previsões não disponíveis';
        }
        

        } catch (error) {
            console.error('Clima não encontrado:', error);
        }
    }

    // Chama a função para pegar o clima da localização ou cidade padrão
    getWeatherLocal();

    //chama a funcao de data e hora para atualizacao
    updateTimeHour();
    setInterval(updateTimeHour, 1000);

    // Atualiza o clima a cada 10 minutos
    setInterval(() => getWeatherLocal(), 600000);

    // Evento para pressionar Enter no campo de entrada
    cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { // Verifica se a tecla pressionada é 'Enter'
            const city = cityInput.value.trim(); // Obtém a cidade digitada
            if (city) {
                getWeatherLocal(city); // Chama a função para buscar o clima
            } else {
                alert("Por favor, insira o nome de uma cidade.");
            }
        }
    });

    //Evento ao clicar na seta de localizacao 
    searchCityButton.addEventListener('click', function() {
        const city = cityInput.value.trim(); // Obtém a cidade digitada
        if (city) {
            getWeatherLocal(city); // Chama a função para buscar o clima
        } else {
            alert("Por favor, insira o nome de uma cidade.");
        }
    });
});
