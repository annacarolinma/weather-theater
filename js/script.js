document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city'); // input da cidade
    const tempElement = document.getElementById('temp');
    const feelsElement = document.getElementById('feel');
    const weatherIconElement = document.getElementById('weatherIcon');
    const placeElement = document.getElementById('city-temp');
    const searchCityButton = document.getElementById('search-city');

    async function getWeatherLocal(city = '') {
        let url = ''; // Inicializa a variável url

        if (city) {  // Se uma cidade for fornecida
            console.log("Requisição usando cidade:", city);
            url = `weather?city=${city}`; // Se uma cidade for passada, monta a URL
        } else {
            // Caso contrário, obtém a geolocalização e monta a URL com as coordenadas
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                url = `weather?lat=${lat}&lon=${lon}`; // URL com as coordenadas
                console.log("Requisição usando latitude e longitude:", lat, lon);
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
            if (data.icon) {
                weatherIconElement.src = data.icon; // Usando o ícone que vem do backend
            }

            if (data.temperature) {
                tempElement.innerHTML = `${data.temperature}`; // Temperatura
            }

            if (data.feels_like) {
                feelsElement.innerHTML = `Feels like ${data.feels_like}`; // Sensação térmica
            }

            if (data.city) {
                placeElement.innerHTML = `${data.city}`; // Cidade e país
            }

        } catch (error) {
            console.error('Clima não encontrado:', error);
        }
    }

    // Chama a função para pegar o clima da localização ou cidade padrão
    getWeatherLocal();

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
});
