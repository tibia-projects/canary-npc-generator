// Variável global para gerenciar keywords
window.npcKeywords = [];

// Função para toggle da seção de keywords
window.toggleKeywords = function() {
    const checkbox = document.getElementById('usesKeywords');
    const container = document.getElementById('keywords-container');
    
    if (checkbox.checked) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        // Limpar a lista de keywords quando desabilitar
        window.npcKeywords = [];
        updateKeywordsTable();
    }
};

// Função para adicionar uma keyword
window.addKeyword = function() {
    const keywordInput = document.getElementById('keyword-input');
    const responseInput = document.getElementById('response-input');
    
    const keyword = keywordInput.value.trim().toLowerCase();
    const response = responseInput.value.trim();
    
    if (!keyword) {
        alert('Por favor, insira uma keyword');
        return;
    }
    
    if (!response) {
        alert('Por favor, insira uma resposta');
        return;
    }
    
    // Verificar se a keyword já existe
    if (window.npcKeywords.some(item => item.keyword === keyword)) {
        alert('Esta keyword já existe na lista');
        return;
    }
    
    // Adicionar a keyword à lista
    window.npcKeywords.push({
        keyword: keyword,
        response: response
    });
    
    // Limpar os campos
    keywordInput.value = '';
    responseInput.value = '';
    
    // Atualizar a tabela
    updateKeywordsTable();
    
    // Focar no campo de keyword para facilitar adição de múltiplas keywords
    keywordInput.focus();
};

// Função para atualizar a tabela de keywords
function updateKeywordsTable() {
    const tbody = document.getElementById('keywords-tbody');
    
    tbody.innerHTML = window.npcKeywords.map((item, index) => 
        `<tr>
            <td>${item.keyword}</td>
            <td>${item.response}</td>
            <td>
                <button class="action-btn edit" onclick="editKeyword(${index})" title="Editar">✏️</button>
                <button class="action-btn delete" onclick="deleteKeyword(${index})" title="Excluir">❌</button>
            </td>
        </tr>`
    ).join('');
}

// Função para excluir uma keyword
window.deleteKeyword = function(index) {
    if (confirm('Tem certeza que deseja excluir esta keyword?')) {
        window.npcKeywords.splice(index, 1);
        updateKeywordsTable();
    }
};

// Função para editar uma keyword
window.editKeyword = function(index) {
    const item = window.npcKeywords[index];
    
    // Criar um modal simples para edição
    const newKeyword = prompt('Editar keyword:', item.keyword);
    if (newKeyword === null) return; // Usuário cancelou
    
    const newResponse = prompt('Editar resposta:', item.response);
    if (newResponse === null) return; // Usuário cancelou
    
    const trimmedKeyword = newKeyword.trim().toLowerCase();
    const trimmedResponse = newResponse.trim();
    
    if (!trimmedKeyword) {
        alert('A keyword não pode estar vazia');
        return;
    }
    
    if (!trimmedResponse) {
        alert('A resposta não pode estar vazia');
        return;
    }
    
    // Verificar se a nova keyword já existe (excluindo a atual)
    if (window.npcKeywords.some((item, idx) => idx !== index && item.keyword === trimmedKeyword)) {
        alert('Esta keyword já existe na lista');
        return;
    }
    
    // Atualizar a keyword
    window.npcKeywords[index] = {
        keyword: trimmedKeyword,
        response: trimmedResponse
    };
    
    updateKeywordsTable();
};

// Event listeners para a funcionalidade de keywords
document.addEventListener('DOMContentLoaded', function() {
    const keywordInput = document.getElementById('keyword-input');
    const responseInput = document.getElementById('response-input');
    
    if (keywordInput && responseInput) {
        // Event listener para Enter no campo de keyword
        keywordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                responseInput.focus();
            }
        });
        
        // Event listener para Enter no campo de response
        responseInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword();
            }
        });
        
        // Converter keyword para lowercase automaticamente
        keywordInput.addEventListener('input', function() {
            this.value = this.value.toLowerCase();
        });
    }
}); 