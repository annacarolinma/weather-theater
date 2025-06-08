/**
 * Classe responsável por gerenciar eventos da interface relacionados à busca do clima.
 */
export default class EventHandler {
  /**
   * Inicializa a instância do EventHandler.
   * 
   * @param {HTMLElement} cityInput - Campo de entrada para nome da cidade.
   * @param {HTMLElement} searchBtn - Botão para disparar a busca do clima.
   * @param {Object} weatherController - Controlador que gerencia a lógica de busca e atualização do clima.
   * @param {Object} messages - Objeto contendo mensagens de alerta para o usuário.
   */
  constructor(cityInput, searchBtn, weatherController, messages) {
    this.cityInput = cityInput;
    this.searchBtn = searchBtn;
    this.weatherController = weatherController;
    this.messages = messages;
  }

  /**
   * Inicializa os event listeners para os elementos da interface.
   * - Clique no botão de busca
   * - Pressionar 'Enter' no campo de entrada
   */
  init() {
    this.searchBtn.addEventListener('click', () => this.handleCitySearch());
    this.cityInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.handleCitySearch();
    });
  }

  /**
   * Trata a ação de busca do clima pela cidade digitada.
   * Se o campo estiver vazio, exibe alerta.
   */
  handleCitySearch() {
    const city = this.cityInput.value.trim();
    if (city) {
      this.weatherController.loadWeather(city);
    } else {
      alert(this.messages.emptyCity);
    }
  }
}
