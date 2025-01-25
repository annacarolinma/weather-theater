
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';  // Importando path para lidar com caminhos

import fetch from 'node-fetch';  // Importação ESM

// Configurar variáveis de ambiente
dotenv.config();


const app = express();
const port = 3000;


// Serve arquivos estáticos da pasta atual (onde o index.js está)
app.use(express.static(path.resolve()));

// Servindo arquivos da pasta 'icons'
app.use('/icons', express.static(path.resolve('icons')));

// Rota para a página principal
app.get('/', (req, res) => {
    // Garantindo que o caminho correto seja usado para o index.html
    res.sendFile(path.resolve('Index.html'));
});

// Endpoint para buscar dados do clima
app.get('/weather', async (req, res) => {
    const city = req.query.city || 'London'; // Cidade padrão
    const apiKey = process.env.OPENWEATHER_API_KEY; //usa a variavel de ambiente para atribuir a api key a nossa constante
   

    // Mapeia as descrições do clima para cada ícone que eu desenvolvi, com objetos que diferenciam se o clima é dia ou noite 
    const WeatherIconMap = {
        "clear sky" : {
            day: "icons/sunny.svg",
            nigth: "icons/clearSky-night.svg"
        },
        "few clouds": {
            day: "icons/partly_cloudy-day.svg",
            night: "icons/partly_cloudyNight.svg"
        },
        "scattered clouds": {
            day: "icons/scattered_clouds.svg",
            night: "icons/scattered_clouds.svg"
        },
        "broken clouds": {
            day: "icons/brokenclouds.svg",
            night: "icons/brokenclouds.svg"
        },
        "shower rain": {
            day: "icons/shower_rain.svg",
            night: "icons/shower_rain.svg"
        },
        "rain": {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        "thunderstorm": {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        "snow": {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        "overcast clouds": {  // Se for o nome exato da descrição
            day: "icons/brokenclouds.svg",
            night: "icons/brokenclouds.svg"
        },
        "mist": {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        }
    };

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

        const data = await response.json();
        console.log(data);

        if (data.cod === 200) { // Código 200 indica sucesso na API OpenWeather

            //Receber a descricao referente ao tempo, o icone e verificar o sufixo
            const weather_description = data.weather[0].description;
            const iconCode = data.weather[0].icon;  // Exemplo: "01d", "01n"
            const isDay = iconCode.endsWith('d'); // Verifica se é dia (sufixo "d")

            //Mapear o meu icone de acordo com o clima
            let iconFile;
            if(WeatherIconMap[weather_description]) {
                if(isDay) {
                    iconFile = WeatherIconMap[weather_description].day;
                } else {
                    iconFile = WeatherIconMap[weather_description].night;
                }
            } else {
                iconFile = "Erro: icon not found";
            }

            res.json({
                city: data.name,
                country: data.sys.country,
                temperature: `${data.main.temp}°C`,
                feels_like: `${data.main.feels_like}°C`,
                weather: weather_description,
                icon: iconFile
            });
           
        } else {
            console.log("Erro ao buscar dados:", data);
            res.status(404).json({ error: data.message });
        }
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do clima.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
