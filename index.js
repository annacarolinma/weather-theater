import dotenv from 'dotenv';
import express from 'express';
import path from 'path';  // Importando path para lidar com caminhos

import fetch from 'node-fetch';  // Importação ESM

// Configurar variáveis de ambiente
dotenv.config();


const app = express();
const port = 3000;

console.log('oi');

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
    console.log('Rota /weather acessada');
    let city = req.query.city ? req.query.city.trim() : ''; // Usar let para permitir reatribuição
    let lat = req.query.lat;  // Usar let aqui também
    let lon = req.query.lon;  // Usar let aqui também
    
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
        console.error('Chave da API não encontrada');
        return res.status(500).json({ error: 'Chave da API não configurada' });
    }

    // Mapeia as descrições do clima para cada ícone que eu desenvolvi, com objetos que diferenciam se o clima é dia ou noite 
    const WeatherIconMap = {
        "clear sky" : {
            day: "icons/sunny.svg",
            night: "icons/clearSky-night.svg"
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
        let url = '';
        let weatherData = {}; //armazena os dados buscados
        
        if (city) {
            // Se a cidade for fornecida, obtem suas cordenadas 
            const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
            const geoResponse = await fetch(geocodeUrl);
            const geoData = await geoResponse.json();
            console.log(geocodeUrl);
            if (geoData.cod !== 200) {
                return res.status(404).json({ error: 'Cidade não encontrada.' });
            }

            lat = geoData.coord.lat;
            lon = geoData.coord.lon;
            console.log('Coordenadas geocodificadas:', lat, lon);
        }

        // Se a cidade/coordenadas forem fornecidas, faz a requisição do clima
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            const response = await fetch(url);
            weatherData = await response.json();
            console.log(url);


            if (weatherData.cod !== 200) {
                return res.status(404).json({ error: weatherData.message });
            }

        } else {
            return res.status(400).json({ error: 'Cidade ou coordenadas não fornecidas corretamente.' });
        }

        //obter previsao horaria
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (forecastData.cod !== "200") {
            return res.status(404).json({ error: 'Erro ao obter a previsão.' });
        }

         //Receber a descricao referente ao tempo, o icone e verificar o sufixo
         const weather_description = weatherData.weather[0].description;
         const iconCode = weatherData.weather[0].icon;  // Exemplo: "01d", "01n"
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

        // Filtrando as temperaturas das próximas horas
         const hourlyTemperatures = forecastData.list.map(hour => ({
            time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    hour12: false 
                }), //formata para receber apenas a hora
            temperature: `${Math.round(hour.main.temp)}°C`
        }));

        // Processa os dados do clima e retorna os valores (e faz arredondamento da temperatura)
        res.json({
            temp: {
                city: weatherData.name,
                country: weatherData.sys.country,
                temperature: `${Math.round(weatherData.main.temp)}°`,
                feels_like: `${Math.round(weatherData.main.feels_like)}°`,
                weather: weatherData.weather[0].description,
                icon: iconFile

            }, 
            forecast: hourlyTemperatures
            
           
        });
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do clima.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});