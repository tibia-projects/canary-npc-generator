// Funcionalidade para criar novo NPC

// Função para mostrar modal de confirmação
window.showNewConfirmModal = function() {
    document.getElementById('new-confirm-modal').style.display = 'block';
};

// Função para fechar modal de confirmação
window.closeNewConfirmModal = function() {
    document.getElementById('new-confirm-modal').style.display = 'none';
};

// Função para confirmar criação de novo NPC
window.confirmNewNPC = function() {
    resetAllData();
    closeNewConfirmModal();
};

// Função para resetar todos os dados ao padrão
function resetAllData() {
    // Reset dados básicos
    resetBasicData();
    
    // Reset aparência
    resetAppearanceData();
    
    // Reset shop
    resetShopData();
    
    // Reset talking
    resetTalkingData();
    
    // Reset keywords
    resetKeywordsData();
    
    // Atualizar imagem do personagem
    window.updateCharacterImage();
    
    // Voltar para aba Basic
    resetToBasicTab();
    
    console.log('Todos os dados foram resetados ao padrão');
}

// Reset dados básicos
function resetBasicData() {
    document.getElementById('npc-name').value = '';
    document.getElementById('npc-max-health').value = '100';
    document.getElementById('npc-health-now').value = '100';
    document.getElementById('npc-walk-interval').value = '1500';
    document.getElementById('npc-walk-radius').value = '2';
    document.getElementById('npc-speed').value = '100';
    document.getElementById('floorChangeSelector').value = 'false';
}

// Reset aparência
function resetAppearanceData() {
    // Reset variáveis globais
    window.currentHeadColor = 0;
    window.currentPrimaryColor = 0;
    window.currentSecondaryColor = 0;
    window.currentDetailColor = 0;
    window.currentBodyPart = 1;
    window.currentLooktype = 136;
    window.currentMount = 0;
    window.currentAddons = 0;
    window.mountEnabled = false;
    window.selectedMountId = 0;
    
    // Reset seletor de gênero
    document.getElementById('genderSelector').value = 'female';
    
    // Reset checkboxes de addon e mount
    const addon1 = document.querySelector('input[name="addon1"]');
    const addon2 = document.querySelector('input[name="addon2"]');
    const mountCheck = document.querySelector('input[name="mount"]');
    
    if (addon1) addon1.checked = false;
    if (addon2) addon2.checked = false;
    if (mountCheck) mountCheck.checked = false;
    
    // Reset botão ativo de body part
    document.querySelectorAll('#npc-body button').forEach(btn => btn.classList.remove('active'));
    const firstBodyBtn = document.querySelector('#npc-body button');
    if (firstBodyBtn) firstBodyBtn.classList.add('active');
    
    // Recarregar outfits e mounts
    if (window.loadOutfits) {
        window.loadOutfits('female');
    }
    if (window.loadMount) {
        window.loadMount();
    }
}

// Reset shop
function resetShopData() {
    // Reset checkboxes
    const canSell = document.getElementById('canSellItems');
    const canBuy = document.getElementById('canBuyItems');
    
    if (canSell) {
        canSell.checked = false;
        document.getElementById('sell-items-container').style.display = 'none';
    }
    
    if (canBuy) {
        canBuy.checked = false;
        document.getElementById('buy-items-container').style.display = 'none';
    }
    
    // Reset arrays globais
    window.sellItems = [];
    window.buyItems = [];
    
    // Reset campos de input
    const sellItemInput = document.getElementById('sell-item-name-input');
    const sellGoldInput = document.getElementById('sell-gold-coins-input');
    const buyItemInput = document.getElementById('buy-item-name-input');
    const buyGoldInput = document.getElementById('buy-gold-coins-input');
    
    if (sellItemInput) sellItemInput.value = '';
    if (sellGoldInput) sellGoldInput.value = '';
    if (buyItemInput) buyItemInput.value = '';
    if (buyGoldInput) buyGoldInput.value = '';
    
    // Atualizar tabelas
    if (window.updateSellItemsTable) window.updateSellItemsTable();
    if (window.updateBuyItemsTable) window.updateBuyItemsTable();
    
    // Voltar para sub-aba Sell
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.sub-tab-btn').classList.add('active');
    document.querySelectorAll('.sub-content').forEach(content => content.classList.remove('active'));
    document.getElementById('sell-tab').classList.add('active');
}

// Reset talking
function resetTalkingData() {
    document.getElementById('greets-message').value = 'Hello |PLAYERNAME|, you need more info about {canary}?';
    document.getElementById('bye-message').value = 'Yeah, good bye and don\'t come again!';
    document.getElementById('walkaway-message').value = 'You not have education?';
    document.getElementById('sell-message').value = 'Sold %ix %s for %i gold.';
    
    // Esconder sell message group
    document.getElementById('sell-message-group').style.display = 'none';
}

// Reset keywords
function resetKeywordsData() {
    // Reset checkbox
    const usesKeywords = document.getElementById('usesKeywords');
    if (usesKeywords) {
        usesKeywords.checked = false;
        document.getElementById('keywords-container').style.display = 'none';
    }
    
    // Reset array global
    window.npcKeywords = [];
    
    // Reset campos de input
    const keywordInput = document.getElementById('keyword-input');
    const responseInput = document.getElementById('response-input');
    
    if (keywordInput) keywordInput.value = '';
    if (responseInput) responseInput.value = '';
    
    // Atualizar tabela
    if (window.updateKeywordsTable) window.updateKeywordsTable();
}

// Voltar para aba Basic
function resetToBasicTab() {
    // Reset abas principais
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-btn[content-id="basic"]').classList.add('active');
    
    document.querySelectorAll('.content').forEach(content => content.classList.remove('show'));
    document.getElementById('basic').classList.add('show');
}

// Event listeners para fechar modal ao clicar fora
document.addEventListener('DOMContentLoaded', function() {
    const confirmModal = document.getElementById('new-confirm-modal');
    
    window.addEventListener('click', function(event) {
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && confirmModal.style.display === 'block') {
            confirmModal.style.display = 'none';
        }
    });
}); 