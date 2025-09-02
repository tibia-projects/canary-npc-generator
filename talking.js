// Função para mostrar/esconder o campo de sell message baseado no checkbox de sell items
function updateSellMessageVisibility() {
    const sellItemsCheckbox = document.getElementById('canSellItems');
    const sellMessageGroup = document.getElementById('sell-message-group');
    
    if (sellItemsCheckbox && sellMessageGroup) {
        if (sellItemsCheckbox.checked) {
            sellMessageGroup.style.display = 'flex';
        } else {
            sellMessageGroup.style.display = 'none';
        }
    }
}

// Função para observar mudanças no checkbox de sell items
function observeSellItemsCheckbox() {
    const sellItemsCheckbox = document.getElementById('canSellItems');
    
    if (sellItemsCheckbox) {
        // Verificar estado inicial
        updateSellMessageVisibility();
        
        // Adicionar listener para mudanças
        sellItemsCheckbox.addEventListener('change', updateSellMessageVisibility);
    }
}

// Função para obter todas as mensagens de talking
window.getTalkingMessages = function() {
    return {
        greets: document.getElementById('greets-message')?.value || '',
        bye: document.getElementById('bye-message')?.value || '',
        walkaway: document.getElementById('walkaway-message')?.value || '',
        sell: document.getElementById('sell-message')?.value || ''
    };
};

// Função para definir mensagens de talking
window.setTalkingMessages = function(messages) {
    if (messages.greets) {
        const greetsInput = document.getElementById('greets-message');
        if (greetsInput) greetsInput.value = messages.greets;
    }
    
    if (messages.bye) {
        const byeInput = document.getElementById('bye-message');
        if (byeInput) byeInput.value = messages.bye;
    }
    
    if (messages.walkaway) {
        const walkawayInput = document.getElementById('walkaway-message');
        if (walkawayInput) walkawayInput.value = messages.walkaway;
    }
    
    if (messages.sell) {
        const sellInput = document.getElementById('sell-message');
        if (sellInput) sellInput.value = messages.sell;
    }
};

// Inicialização quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os elementos estejam carregados
    setTimeout(() => {
        observeSellItemsCheckbox();
    }, 100);
});

// Exportar funções para uso global
window.updateSellMessageVisibility = updateSellMessageVisibility;
window.observeSellItemsCheckbox = observeSellItemsCheckbox; 