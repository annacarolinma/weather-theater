//Efeito dno botao de epesquisa de cidades, pais, estados 

const button = document.getElementById('search-city-button');
const input = document.getElementById('city');

button.addEventListener('click', () =>{
    button.classList.add('hidden');
    input.classList.remove('hidden'); // Mostra o campo de input
    input.classList.add('show'); // Inicia a transição de deslizamento
    textInput.focus();
});