document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city');
    const tempElement = document.getElementById('temp');
    const feelsElement = document.getElementById('feel');
    const weatherIconElement = document.getElementById('weatherIcon');
    const placeElement = document.getElementById('city-temp');
    const searchCityButton = document.getElementById('search-city');

    async function WeatherFetch(city) {
        try {
            console.log("Buscando dados para a cidade:", city);
            const response = await fetch(`http://localhost:3000/weather?city=${city}`);
            const data = await response.json(); // Armazena os dados recebidos na variável data
            console.log(data); // Verifique a resposta do backend

            if (data.icon) {
                // Atualizando o ícone do clima
                weatherIconElement.src = data.icon;
            }

            if (data.temperature) {
                tempElement.innerHTML = `Temperatura: ${data.temperature}°`;
            }

            if (data.feels_like) {
                feelsElement.innerHTML = `Sensação térmica: ${data.feels_like}°`;
            }

            if (data.city) {
                placeElement.innerHTML = `Cidade: ${data.city}`;
            }

        } catch (error) {
            console.error('Clima não encontrado:', error);
        }
    }

    // Evento de clique no ícone de busca
    searchCityButton.addEventListener('click', () => {
        const city = cityInput.value.trim(); // Obtém a cidade digitada
        if (city) {
            WeatherFetch(city); // Chama a função para buscar o clima
        } else {
            alert("Por favor, insira o nome de uma cidade.");
        }
    });
});
