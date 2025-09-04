// Variáveis globais para gerenciar itens de venda
window.sellItems = [];
window.itemsData = [];

// Função para ler o XML de itens
async function readItemsXml() {
    try {
        const response = await fetch('xml/items.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const items = xmlDoc.getElementsByTagName('item');
        const itemsList = [];

        for (let item of items) {
            const id = item.getAttribute('id');
            const name = item.getAttribute('name');
            
            if (id && name) {
                itemsList.push({ 
                    id: parseInt(id), 
                    name: name 
                });
            }
        }

        return itemsList;
    } catch (error) {
        console.error('Erro ao ler o arquivo XML de itens:', error);
        return [];
    }
}

// Função para carregar os itens na inicialização
async function loadItemsData() {
    window.itemsData = await readItemsXml();
    console.log(`Carregados ${window.itemsData.length} itens`);
}

// Função para filtrar itens baseado no input do usuário
function filterItems(searchTerm) {
    if (!searchTerm) return [];
    
    const term = searchTerm.toLowerCase();
    return window.itemsData.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.id.toString().includes(term)
    ).slice(0, 10); // Limitar a 10 sugestões
}

// Função para mostrar sugestões de itens
function showSellItemSuggestions(filteredItems) {
    const suggestionsDiv = document.getElementById('sell-item-suggestions');
    
    if (filteredItems.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    suggestionsDiv.innerHTML = filteredItems.map(item => 
        `<div class="suggestion-item" onclick="selectSellItem(${item.id}, '${item.name.replace(/'/g, "\\'")}')">
            ${item.name} - ${item.id}
        </div>`
    ).join('');
    
    suggestionsDiv.style.display = 'block';
}

// Função para selecionar um item da lista de sugestões
window.selectSellItem = function(itemId, itemName) {
    document.getElementById('sell-item-name-input').value = `${itemName} - ${itemId}`;
    document.getElementById('sell-item-suggestions').style.display = 'none';
    
    // Focar no campo de gold coins
    document.getElementById('sell-gold-coins-input').focus();
};

// Função para toggle da seção de venda de itens
window.toggleSellItems = function() {
    const checkbox = document.getElementById('canSellItems');
    const container = document.getElementById('sell-items-container');
    
    if (checkbox.checked) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        // Limpar a lista de itens quando desabilitar
        window.sellItems = [];
        window.updateSellItemsTable();
    }
    
    // Atualizar visibilidade do campo sell message na aba Talking
    if (window.updateSellMessageVisibility) {
        window.updateSellMessageVisibility();
    }
};

// Função para adicionar um item à lista de venda
window.addSellItem = function() {
    const itemInput = document.getElementById('sell-item-name-input');
    const goldInput = document.getElementById('sell-gold-coins-input');
    
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
    if (window.sellItems.some(item => item.id === itemId)) {
        alert('Este item já está na lista de venda');
        return;
    }
    
    // Adicionar o item à lista
    window.sellItems.push({
        id: itemId,
        name: itemName,
        gold: goldValue
    });
    
    // Limpar os campos
    itemInput.value = '';
    goldInput.value = '';
    document.getElementById('sell-item-suggestions').style.display = 'none';
    
    // Atualizar a tabela
    window.updateSellItemsTable();
};

// Função para atualizar a tabela de itens de venda
window.updateSellItemsTable = function() {
    const tbody = document.getElementById('sell-items-tbody');
    
    tbody.innerHTML = window.sellItems.map((item, index) => 
        `<tr>
            <td>${item.name}</td>
            <td>${item.id}</td>
            <td>${item.gold}</td>
            <td>
                <button class="action-btn edit" onclick="editSellItem(${index})" title="Editar">✏️</button>
                <button class="action-btn delete" onclick="deleteSellItem(${index})" title="Excluir">❌</button>
            </td>
        </tr>`
    ).join('');
}

// Função para excluir um item da lista
window.deleteSellItem = function(index) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        window.sellItems.splice(index, 1);
        window.updateSellItemsTable();
    }
};

// Função para editar o valor de gold de um item
window.editSellItem = function(index) {
    const item = window.sellItems[index];
    const newGold = prompt(`Editar valor de gold para "${item.name}":`, item.gold);
    
    if (newGold !== null) {
        const goldValue = parseInt(newGold);
        if (goldValue && goldValue > 0) {
            window.sellItems[index].gold = goldValue;
            window.updateSellItemsTable();
        } else {
            alert('Por favor, insira um valor válido de gold coins');
        }
    }
};

// Event listeners para o input de busca de itens
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados dos itens
    loadItemsData();
    
    const itemInput = document.getElementById('sell-item-name-input');
    
    if (itemInput) {
        // Event listener para busca em tempo real
        itemInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            const filteredItems = filterItems(searchTerm);
            showSellItemSuggestions(filteredItems);
        });
        
        // Event listener para esconder sugestões quando clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#sell-item-name-input') && !e.target.closest('#sell-item-suggestions')) {
                document.getElementById('sell-item-suggestions').style.display = 'none';
            }
        });
        
        // Event listener para Enter no campo de item
        itemInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('sell-gold-coins-input').focus();
            }
        });
        
        // Event listener para Enter no campo de gold
        document.getElementById('sell-gold-coins-input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSellItem();
            }
        });
    }
}); 