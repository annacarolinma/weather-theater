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
    res.sendFile(path.resolve('index.html'));
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

        //clearSky
        800 : {
            day: "icons/sunny.svg",
            night: "icons/clearSky-night.svg"
        },

        //clouds
        801: {
            day: "icons/partly_cloudy-day.svg",
            night: "icons/partly_cloudyNight.svg"
        },
        802: {
            day: "icons/scattered_clouds.svg",
            night: "icons/scattered_clouds.svg"
        },
        803: {
            day: "icons/brokenclouds.svg",
            night: "icons/brokenclouds.svg"
        },
        804: { 
            day: "icons/brokenclouds.svg",
            night: "icons/brokenclouds.svg"
        },


        //Rain
        500: {
            day: "icons/shower_rain.svg",
            night: "icons/shower_rain.svg"
        },
        501: {
            day: "icons/shower_rain.svg",
            night: "icons/shower_rain.svg"
        },
        502: {
            day: "icons/shower_rain.svg",
            night: "icons/shower_rain.svg"
        },
        504: {
            day: "icons/shower_rain.svg",
            night: "icons/shower_rain.svg"
        },
        511: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        520: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        521: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        522: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        531: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },



        //Thunderstorm
        200: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        201: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        202: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        210: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        211: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        212: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        221: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        230: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        231: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },
        232: {
            day: "icons/thunderstorm.svg",
            night: "icons/thunderstorm.svg"
        },


        //Drizzle
        300: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        301: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        302: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        310: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        311: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        312: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        313: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        314: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },
        321: {
            day: "icons/Rain-night.svg",
            night: "icons/rain-day.svg"
        },

        //Snow
        600: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        601: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        }, 
        602: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        611: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        612: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        613: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        615: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        616: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        620: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        621: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },
        622: {
            day: "icons/snow.svg",
            night: "icons/snow.svg"
        },


        //Atmosphere
        701: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        711: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        721: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        731: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        741: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        751: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        761: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        762: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        771: {
            day: "icons/mist.svg",
            night: "icons/mist.svg"
        },
        781: {
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
         const weatherId = weatherData.weather[0].id;
         const iconCode = weatherData.weather[0].icon;  // Exemplo: "01d", "01n"
         const isDay = iconCode.endsWith('d'); // Verifica se é dia (sufixo "d")

         //Mapear o meu icone de acordo com o clima
         let iconFile;
         if(WeatherIconMap[weatherId]) {
             if(isDay) {
                 iconFile = WeatherIconMap[weatherId].day;
             } else {
                 iconFile = WeatherIconMap[weatherId].night;
             }
         } else {
             iconFile = "Erro: icon not found";
         }

        // Filtrando as temperaturas das próximas horas
         const hourlyTemperatures = forecastData.list.map(hour => ({
            time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    hour12: true 
                }).toLowerCase(), //formata para receber apenas a hora
            temperature: `${Math.round(hour.main.temp)}°`,
            icon: iconFile // Adiciona o ícone correspondente
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