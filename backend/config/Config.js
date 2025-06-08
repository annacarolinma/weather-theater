import dotenv from 'dotenv';
dotenv.config();

/**
 * Classe singleton para gerenciar a configuração da aplicação.
 * Carrega a chave da API do OpenWeather a partir das variáveis de ambiente.
 */
class Config {
    constructor() {
        // Retorna a instância existente para garantir singleton
        if (Config.instance) return Config.instance;

        // Obtém a chave da API do ambiente
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        
        // Valida se a chave está configurada
        if (!this.apiKey) throw new Error('Chave da API não configurada');

        // Armazena a instância para chamadas futuras
        Config.instance = this;
    }

    /**
     * Retorna a chave da API do OpenWeather.
     * @returns {string} API key
     */
    getApiKey() {
        return this.apiKey;
    }
}

export default Config;
