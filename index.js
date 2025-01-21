const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const port = 3000;

// Endpoint para buscar dados do clima
app.get('/weather', async (req, res) => {
    const city = req.query.city || 'London'; // Cidade padrão
    const apiKey = process.env.OPENWEATHER_API_KEY; //usa a variavel de ambiente para atribuir a api key a nossa constante

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();

        res.json(data); // Retorna os dados do clima em JSON
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados do clima.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
