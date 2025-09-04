// Funcionalidade para modal de Help

// Função para mostrar modal de help
window.showHelpModal = function() {
    document.getElementById('help-modal').style.display = 'block';
};

// Função para fechar modal de help
window.closeHelpModal = function() {
    document.getElementById('help-modal').style.display = 'none';
};

// Event listeners para o modal de help
document.addEventListener('DOMContentLoaded', function() {
    const helpModal = document.getElementById('help-modal');
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && helpModal.style.display === 'block') {
            helpModal.style.display = 'none';
        }
    });
}); 