import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import weatherRoutes from './src/routes/weatherRoutes.js';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const port = 3000;

// Corrigido: obter __dirname no contexto de ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Corrigido: usar __dirname correto
app.use(express.static(path.join(__dirname, 'public')));

// Servir o index.html corretamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas da API
app.use('/weather', weatherRoutes);

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
