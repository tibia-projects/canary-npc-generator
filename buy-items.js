// Variáveis globais para gerenciar itens de compra
window.buyItems = [];

// Função para alternar entre as sub-abas Buy/Sell
window.switchBuySellTab = function(tabName) {
    // Atualizar botões das sub-abas
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Atualizar conteúdo das sub-abas
    document.querySelectorAll('.sub-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
};

// Função para toggle da seção de compra de itens
window.toggleBuyItems = function() {
    const checkbox = document.getElementById('canBuyItems');
    const container = document.getElementById('buy-items-container');
    
    if (checkbox.checked) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        // Limpar a lista de itens quando desabilitar
        window.buyItems = [];
        updateBuyItemsTable();
    }
};

// Função para mostrar sugestões de itens para buy
function showBuyItemSuggestions(filteredItems) {
    const suggestionsDiv = document.getElementById('buy-item-suggestions');
    
    if (filteredItems.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    suggestionsDiv.innerHTML = filteredItems.map(item => 
        `<div class="suggestion-item" onclick="selectBuyItem(${item.id}, '${item.name.replace(/'/g, "\\'")}')">
            ${item.name} - ${item.id}
        </div>`
    ).join('');
    
    suggestionsDiv.style.display = 'block';
}

// Função para selecionar um item da lista de sugestões para buy
window.selectBuyItem = function(itemId, itemName) {
    document.getElementById('buy-item-name-input').value = `${itemName} - ${itemId}`;
    document.getElementById('buy-item-suggestions').style.display = 'none';
    
    // Focar no campo de gold coins
    document.getElementById('buy-gold-coins-input').focus();
};

// Função para adicionar um item à lista de compra
window.addBuyItem = function() {
    const itemInput = document.getElementById('buy-item-name-input');
    const goldInput = document.getElementById('buy-gold-coins-input');
    
    const itemText = itemInput.value.trim();
    const goldValue = parseInt(goldInput.value);
    
    if (!itemText) {
        alert('Por favor, selecione um item');
        return;
    }
    
    if (!goldValue || goldValue < 1) {
        alert('Por favor, insira um valor válido de gold coins');
        return;
    }
    
    // Extrair ID e nome do texto selecionado
    const match = itemText.match(/^(.+) - (\d+)$/);
    if (!match) {
        alert('Por favor, selecione um item válido da lista de sugestões');
        return;
    }
    
    const itemName = match[1];
    const itemId = parseInt(match[2]);
    
    // Verificar se o item já existe na lista
    if (window.buyItems.some(item => item.id === itemId)) {
        alert('Este item já está na lista de compra');
        return;
    }
    
    // Adicionar o item à lista
    window.buyItems.push({
        id: itemId,
        name: itemName,
        gold: goldValue
    });
    
    // Limpar os campos
    itemInput.value = '';
    goldInput.value = '';
    document.getElementById('buy-item-suggestions').style.display = 'none';
    
    // Atualizar a tabela
    updateBuyItemsTable();
};

// Função para atualizar a tabela de itens de compra
function updateBuyItemsTable() {
    const tbody = document.getElementById('buy-items-tbody');
    
    tbody.innerHTML = window.buyItems.map((item, index) => 
        `<tr>
            <td>${item.name}</td>
            <td>${item.id}</td>
            <td>${item.gold}</td>
            <td>
                <button class="action-btn edit" onclick="editBuyItem(${index})" title="Editar">✏️</button>
                <button class="action-btn delete" onclick="deleteBuyItem(${index})" title="Excluir">❌</button>
            </td>
        </tr>`
    ).join('');
}

// Função para excluir um item da lista de compra
window.deleteBuyItem = function(index) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        window.buyItems.splice(index, 1);
        updateBuyItemsTable();
    }
};

// Função para editar o valor de gold de um item de compra
window.editBuyItem = function(index) {
    const item = window.buyItems[index];
    const newGold = prompt(`Editar valor de gold para "${item.name}":`, item.gold);
    
    if (newGold !== null) {
        const goldValue = parseInt(newGold);
        if (goldValue && goldValue > 0) {
            window.buyItems[index].gold = goldValue;
            updateBuyItemsTable();
        } else {
            alert('Por favor, insira um valor válido de gold coins');
        }
    }
};

// Event listeners para a funcionalidade de buy items
document.addEventListener('DOMContentLoaded', function() {
    const buyItemInput = document.getElementById('buy-item-name-input');
    
    if (buyItemInput) {
        // Event listener para busca em tempo real
        buyItemInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            const filteredItems = filterItems(searchTerm); // Reutilizar função do sell-items.js
            showBuyItemSuggestions(filteredItems);
        });
        
        // Event listener para esconder sugestões quando clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#buy-item-name-input') && !e.target.closest('#buy-item-suggestions')) {
                document.getElementById('buy-item-suggestions').style.display = 'none';
            }
        });
        
        // Event listener para Enter no campo de item
        buyItemInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('buy-gold-coins-input').focus();
            }
        });
        
        // Event listener para Enter no campo de gold
        document.getElementById('buy-gold-coins-input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addBuyItem();
            }
        });
    }
}); 