// Variáveis globais para controle das cores e addons
window.currentHeadColor = 0;
window.currentPrimaryColor = 0;
window.currentSecondaryColor = 0;
window.currentDetailColor = 0;
window.currentBodyPart = 1;
window.currentLooktype = 136; // Começando com Female Citizen
window.currentMount = 0; // Começando sem montaria
window.currentAddons = 0; // Começando sem addons
window.mountEnabled = false; // Mount desabilitado por padrão
window.selectedMountId = 0; // ID da montaria selecionada

// Função para atualizar a imagem do personagem
window.updateCharacterImage = function() {
    const characterImg = document.querySelector('.character');
    const baseUrl = 'https://outfit-images-oracle.ots.me/latest_walk/animoutfit.php';
    const mountValue = window.mountEnabled ? window.selectedMountId : 0;
    const url = `${baseUrl}?id=${window.currentLooktype}&addons=${window.currentAddons}&head=${window.currentHeadColor}&body=${window.currentPrimaryColor}&legs=${window.currentSecondaryColor}&feet=${window.currentDetailColor}&mount=${mountValue}&direction=3`;
    characterImg.src = url;
    console.log('URL atualizada:', url);
};

// Função para definir a cor do NPC
window.setNpcColor = function(color) {
    switch(window.currentBodyPart) {
        case 1:
            window.currentHeadColor = color;
            break;
        case 2:
            window.currentPrimaryColor = color;
            break;
        case 3:
            window.currentSecondaryColor = color;
            break;
        case 4:
            window.currentDetailColor = color;
            break;
    }
    window.updateCharacterImage();
};

// Função para definir a parte do corpo
window.setBodypart = function(part) {
    window.currentBodyPart = part;
    document.querySelectorAll('#npc-body button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

// Função para atualizar addons baseado nos checkboxes
window.updateAddons = function() {
    const addon1 = document.querySelector('input[name="addon1"]')?.checked || false;
    const addon2 = document.querySelector('input[name="addon2"]')?.checked || false;
    
    window.currentAddons = 0;
    if (addon1) window.currentAddons += 1;
    if (addon2) window.currentAddons += 2;
    
    window.updateCharacterImage();
};

// Função para atualizar mount baseado no checkbox
window.updateMount = function() {
    const mountCheckbox = document.querySelector('input[name="mount"]');
    window.mountEnabled = mountCheckbox?.checked || false;
    
    // Se mount foi desabilitado, zerar o valor
    if (!window.mountEnabled) {
        window.currentMount = 0;
    } else {
        // Se mount foi habilitado, usar o ID da montaria selecionada
        window.currentMount = window.selectedMountId;
    }
    
    window.updateCharacterImage();
};

// Função para gerar cores aleatórias para todas as partes do corpo
window.setNpcColorRandom = function() {
    // Gerar cores aleatórias para cada parte do corpo
    // Range de cores válidas: 0-131 (baseado na paleta de cores disponível)
    const getRandomColor = () => Math.floor(Math.random() * 132);
    
    window.currentHeadColor = getRandomColor();
    window.currentPrimaryColor = getRandomColor();
    window.currentSecondaryColor = getRandomColor();
    window.currentDetailColor = getRandomColor();
    
    // Atualizar a imagem do personagem
    window.updateCharacterImage();
    
    console.log('Cores aleatórias aplicadas:', {
        head: window.currentHeadColor,
        primary: window.currentPrimaryColor,
        secondary: window.currentSecondaryColor,
        detail: window.currentDetailColor
    });
};

// Inicializar quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.updateCharacterImage();
    window.createOutfitSelector();
    window.createMountSelector();
});
