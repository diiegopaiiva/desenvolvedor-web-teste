document.addEventListener('DOMContentLoaded', function() {
    // Adiciona um ouvinte de evento para o formulário de pesquisa
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        // Impede o comportamento padrão do formulário (recarregar a página)
        event.preventDefault();

        // Obtém o valor do campo de entrada de texto
        var termoBusca = document.getElementById('searchInput').value;
        // Verifica se o campo de pesquisa não está vazio
        if (termoBusca.trim() !== '') {
            // Chama a função para pesquisar a bebida
            buscarCoquetel(termoBusca);
        }
    });

    // Define a função para pesquisar a bebida
    function buscarCoquetel(termoBusca) {
        // Monta a URL para fazer a solicitação à API TheCocktailDB
        var url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + termoBusca;
        
        // Faz a solicitação à API usando a função fetch
        fetch(url)
            // Converte a resposta em formato JSON
            .then(resposta => resposta.json())
            // Manipula os dados retornados pela API
            .then(dados => {
                // Verifica se há resultados de bebida
                if (dados.drinks) {
                    // Obtém a primeira bebida da lista
                    var bebida = dados.drinks[0];
                    // Monta a informação da bebida em HTML
                    var infoBebida = `
                    <div id="drinkDetails" class="drink-details">
                    <h2>${bebida.strDrink}</h2>
                        <div class="drink-description">
                            <p>Categoria: ${bebida.strCategory}</p>
                            <p>Tipo de copo: ${bebida.strGlass}</p>
                            <p>Instruções: ${bebida.strInstructions}</p>
                        </div>
                    </div>
                    <div id="drinkImage" class="drink-image">
                        <img src="${bebida.strDrinkThumb}" alt="${bebida.strDrink}" width="300">
                    </div>
                    `;
                    // Exibe as informações da bebida na página
                    document.getElementById('drinkInfo').innerHTML = infoBebida;
                } else {
                    // Exibe uma mensagem se a bebida não for encontrada
                    document.getElementById('drinkInfo').innerHTML = '<p>Bebida não encontrada.</p>';
                }
            })
            // Captura e trata erros de solicitação
            .catch(erro => {
                console.error('Erro na solicitação:', erro);
                // Exibe uma mensagem de erro na página
                document.getElementById('drinkInfo').innerHTML = '<p>Ocorreu um erro ao buscar a bebida.</p>';
            });
    }

    // Adiciona opções ao seletor de bebidas ao carregar a página
    mostrarListaGeral();
});

// Função para exibir a lista geral de bebidas e preencher o seletor de bebidas
function mostrarListaGeral() {
    // Faz uma solicitação à API para obter a lista de bebidas
    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a')
        .then(response => response.json())
        .then(data => {
            // Obtém o elemento select
            const drinkSelect = document.getElementById('drinkSelect');

            // Obtém a lista de bebidas do objeto de resposta
            const drinks = data.drinks;

            // Verifica se há bebidas disponíveis
            if (drinks) {
                // Itera sobre cada bebida e adiciona à lista de seleção
                drinks.forEach(drink => {
                    const drinkName = drink.strDrink;
                    const option = document.createElement('option');
                    option.textContent = drinkName;
                    option.value = drinkName; // Define o valor da opção como o nome da bebida
                    drinkSelect.appendChild(option);
                });
            } else {
                // Exibe uma mensagem se nenhuma bebida for encontrada
                console.log('Nenhuma bebida encontrada.');
            }
        })
        // Captura e trata erros de solicitação
        .catch(error => {
            console.error('Erro ao obter lista de bebidas:', error);
            // Exibe uma mensagem de erro se houver problemas com a solicitação
            console.log('Erro ao obter lista de bebidas.');
        });
}
