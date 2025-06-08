import dotenv from 'dotenv';
dotenv.config();

class Config {
    constructor() {
        if (Config.instance) return Config.instance;

        this.apiKey = process.env.OPENWEATHER_API_KEY;
        if (!this.apiKey) throw new Error('Chave da API não configurada');

        Config.instance = this;
    }

    getApiKey() {
        return this.apiKey;
    }
}

export default Config;
