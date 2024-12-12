// Variáveis globais para controle das cores
window.currentHeadColor = 0;
window.currentPrimaryColor = 0;
window.currentSecondaryColor = 0;
window.currentDetailColor = 0;
window.currentBodyPart = 1;
window.currentLooktype = 136; // Começando com Female Citizen
window.currentMount = 0; // Começando sem montaria

// Função para atualizar a imagem do personagem
window.updateCharacterImage = function() {
    const characterImg = document.querySelector('.character');
    const baseUrl = 'https://outfit-images-oracle.ots.me/latest_walk/animoutfit.php';
    const url = `${baseUrl}?id=${window.currentLooktype}&addons=3&head=${window.currentHeadColor}&body=${window.currentPrimaryColor}&legs=${window.currentSecondaryColor}&feet=${window.currentDetailColor}&mount=${window.currentMount}&direction=3`;
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

// Inicializar quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.updateCharacterImage();
    window.createOutfitSelector();
    window.createMountSelector();
});
