const celsius = document.getElementById('celsius');
const fahrenheit = document.getElementById('fahrenheit');

// Função para alternar a classe ativa
function toggleActive(event) {
  celsius.classList.remove('active');
  fahrenheit.classList.remove('active');
  event.target.classList.add('active');
}

// Adicionar evento de clique
celsius.addEventListener('click', toggleActive);
fahrenheit.addEventListener('click', toggleActive);