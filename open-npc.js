// Funcionalidade para abrir e carregar arquivos NPC

// Função para abrir seletor de arquivo
window.openNPCFile = function() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
};

// Função para fechar modal de erro
window.closeErrorModal = function() {
    document.getElementById('error-modal').style.display = 'none';
};

// Função para mostrar modal de erro
function showErrorModal() {
    document.getElementById('error-modal').style.display = 'block';
}

// Event listener para quando um arquivo é selecionado
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            loadNPCFile(file);
        }
        // Limpar o input para permitir recarregar o mesmo arquivo
        fileInput.value = '';
    });
    
    // Event listeners para modal de erro
    const errorModal = document.getElementById('error-modal');
    
    window.addEventListener('click', function(event) {
        if (event.target === errorModal) {
            errorModal.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && errorModal.style.display === 'block') {
            errorModal.style.display = 'none';
        }
    });
});

// Função para carregar e processar arquivo NPC
function loadNPCFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        
        try {
            const npcData = parseNPCFile(content);
            populateFieldsWithData(npcData);
            console.log('Arquivo NPC carregado com sucesso:', npcData);
        } catch (error) {
            console.error('Erro ao processar arquivo NPC:', error);
            showErrorModal();
        }
    };
    
    reader.onerror = function() {
        console.error('Erro ao ler arquivo');
        showErrorModal();
    };
    
    reader.readAsText(file);
}

// Função para fazer parse do arquivo NPC Lua
function parseNPCFile(content) {
    const npcData = {
        basic: {},
        outfit: {},
        talking: {},
        shop: { sellItems: [], buyItems: [] },
        keywords: []
    };
    
    try {
        // Parse nome do NPC
        const nameMatch = content.match(/local npcName = ["']([^"']+)["']/);
        if (nameMatch) {
            npcData.basic.name = nameMatch[1];
        }
        
        // Parse configurações básicas
        const healthMatch = content.match(/npcConfig\.health = (\d+)/);
        if (healthMatch) npcData.basic.health = parseInt(healthMatch[1]);
        
        const maxHealthMatch = content.match(/npcConfig\.maxHealth = (\d+)/);
        if (maxHealthMatch) npcData.basic.maxHealth = parseInt(maxHealthMatch[1]);
        
        const walkIntervalMatch = content.match(/npcConfig\.walkInterval = (\d+)/);
        if (walkIntervalMatch) npcData.basic.walkInterval = parseInt(walkIntervalMatch[1]);
        
        const walkRadiusMatch = content.match(/npcConfig\.walkRadius = (\d+)/);
        if (walkRadiusMatch) npcData.basic.walkRadius = parseInt(walkRadiusMatch[1]);
        
        // Parse floor change
        const floorChangeMatch = content.match(/floorchange = (true|false)/);
        if (floorChangeMatch) npcData.basic.floorChange = floorChangeMatch[1] === 'true';
        
        // Parse outfit
        const outfitSection = content.match(/npcConfig\.outfit = \{([^}]+)\}/s);
        if (outfitSection) {
            const outfitContent = outfitSection[1];
            
            const lookTypeMatch = outfitContent.match(/lookType = (\d+)/);
            if (lookTypeMatch) npcData.outfit.lookType = parseInt(lookTypeMatch[1]);
            
            const lookHeadMatch = outfitContent.match(/lookHead = (\d+)/);
            if (lookHeadMatch) npcData.outfit.lookHead = parseInt(lookHeadMatch[1]);
            
            const lookBodyMatch = outfitContent.match(/lookBody = (\d+)/);
            if (lookBodyMatch) npcData.outfit.lookBody = parseInt(lookBodyMatch[1]);
            
            const lookLegsMatch = outfitContent.match(/lookLegs = (\d+)/);
            if (lookLegsMatch) npcData.outfit.lookLegs = parseInt(lookLegsMatch[1]);
            
            const lookFeetMatch = outfitContent.match(/lookFeet = (\d+)/);
            if (lookFeetMatch) npcData.outfit.lookFeet = parseInt(lookFeetMatch[1]);
            
            const lookAddonsMatch = outfitContent.match(/lookAddons = (\d+)/);
            if (lookAddonsMatch) npcData.outfit.lookAddons = parseInt(lookAddonsMatch[1]);
            
            const lookMountMatch = outfitContent.match(/lookMount = (\d+)/);
            if (lookMountMatch) npcData.outfit.lookMount = parseInt(lookMountMatch[1]);
        }
        
        // Parse mensagens
        const greetMatch = content.match(/MESSAGE_GREET, ["']([^"']+)["']/);
        if (greetMatch) npcData.talking.greets = greetMatch[1];
        
        const byeMatch = content.match(/MESSAGE_FAREWELL, ["']([^"']+)["']/);
        if (byeMatch) npcData.talking.bye = byeMatch[1];
        
        const walkawayMatch = content.match(/MESSAGE_WALKAWAY, ["']([^"']+)["']/);
        if (walkawayMatch) npcData.talking.walkaway = walkawayMatch[1];
        
        // Parse shop - Método mais robusto
        const shopStartIndex = content.indexOf('npcConfig.shop = {');
        if (shopStartIndex !== -1) {
            // Encontrar o fechamento correto da seção shop
            let braceCount = 0;
            let shopEndIndex = shopStartIndex + 'npcConfig.shop = {'.length;
            
            for (let i = shopEndIndex; i < content.length; i++) {
                if (content[i] === '{') braceCount++;
                if (content[i] === '}') {
                    if (braceCount === 0) {
                        shopEndIndex = i;
                        break;
                    }
                    braceCount--;
                }
            }
            
            const shopFullSection = content.substring(shopStartIndex, shopEndIndex + 1);
            const shopContent = shopFullSection.substring(shopFullSection.indexOf('{') + 1, shopFullSection.lastIndexOf('}'));
            
            console.log('Shop content encontrado (completo):', shopContent);
            console.log('Tamanho do shop content:', shopContent.length);
            
            // Regex para capturar cada item completo, incluindo quebras de linha
            const itemPattern = /\{\s*itemName\s*=\s*["']([^"']+)["']\s*,\s*clientId\s*=\s*(\d+)\s*,\s*([^}]*?)\s*\}/g;
            let match;
            
            while ((match = itemPattern.exec(shopContent)) !== null) {
                const itemName = match[1];
                const itemId = parseInt(match[2]);
                const itemProperties = match[3];
                
                console.log(`Processando item: ${itemName} (${itemId})`);
                console.log('Propriedades:', itemProperties);
                
                // Buscar buy e sell nas propriedades do item
                const buyMatch = itemProperties.match(/buy\s*=\s*(\d+)/);
                const sellMatch = itemProperties.match(/sell\s*=\s*(\d+)/);
                
                // Se tem 'buy', significa que o NPC vende este item para o player
                if (buyMatch) {
                    const sellItem = {
                        id: itemId,
                        name: itemName,
                        gold: parseInt(buyMatch[1])
                    };
                    npcData.shop.sellItems.push(sellItem);
                    console.log('Item de venda adicionado:', sellItem);
                }
                
                // Se tem 'sell', significa que o NPC compra este item do player
                if (sellMatch) {
                    const buyItem = {
                        id: itemId,
                        name: itemName,
                        gold: parseInt(sellMatch[1])
                    };
                    npcData.shop.buyItems.push(buyItem);
                    console.log('Item de compra adicionado:', buyItem);
                }
            }
            
            console.log('Itens de venda encontrados:', npcData.shop.sellItems.length);
            console.log('Itens de compra encontrados:', npcData.shop.buyItems.length);
        }
        
        // Parse keywords customizadas
        const keywordMatches = content.match(/keywordHandler:addKeyword\(\{ ["']([^"']+)["'] \}, StdModule\.say, \{[^}]*text = ["']([^"']+)["'][^}]*\}/g);
        if (keywordMatches) {
            keywordMatches.forEach(keywordMatch => {
                const keywordNameMatch = keywordMatch.match(/\{ ["']([^"']+)["'] \}/);
                const responseMatch = keywordMatch.match(/text = ["']([^"']+)["']/);
                
                if (keywordNameMatch && responseMatch) {
                    npcData.keywords.push({
                        keyword: keywordNameMatch[1],
                        response: responseMatch[1]
                    });
                }
            });
        }
        
        return npcData;
        
    } catch (error) {
        throw new Error('Arquivo NPC inválido ou corrompido');
    }
}

// Função para popular campos com dados carregados
function populateFieldsWithData(npcData) {
    // Popular dados básicos
    if (npcData.basic.name) {
        document.getElementById('npc-name').value = npcData.basic.name;
    }
    if (npcData.basic.health) {
        document.getElementById('npc-health-now').value = npcData.basic.health;
    }
    if (npcData.basic.maxHealth) {
        document.getElementById('npc-max-health').value = npcData.basic.maxHealth;
    }
    if (npcData.basic.walkInterval) {
        document.getElementById('npc-walk-interval').value = npcData.basic.walkInterval;
    }
    if (npcData.basic.walkRadius) {
        document.getElementById('npc-walk-radius').value = npcData.basic.walkRadius;
    }
    if (npcData.basic.floorChange !== undefined) {
        document.getElementById('floorChangeSelector').value = npcData.basic.floorChange ? 'true' : 'false';
    }
    
    // Popular aparência
    if (npcData.outfit.lookType) {
        window.currentLooktype = npcData.outfit.lookType;
        
        // Determinar gênero baseado no looktype (simplificado)
        const isFemale = npcData.outfit.lookType <= 150 || npcData.outfit.lookType % 2 === 0;
        const gender = isFemale ? 'female' : 'male';
        document.getElementById('genderSelector').value = gender;
        
        // Recarregar outfits para o gênero correto
        setTimeout(() => {
            if (window.loadOutfits) {
                window.loadOutfits(gender);
            }
        }, 100);
    }
    
    // Popular cores
    if (npcData.outfit.lookHead !== undefined) window.currentHeadColor = npcData.outfit.lookHead;
    if (npcData.outfit.lookBody !== undefined) window.currentPrimaryColor = npcData.outfit.lookBody;
    if (npcData.outfit.lookLegs !== undefined) window.currentSecondaryColor = npcData.outfit.lookLegs;
    if (npcData.outfit.lookFeet !== undefined) window.currentDetailColor = npcData.outfit.lookFeet;
    
    // Popular addons
    if (npcData.outfit.lookAddons !== undefined) {
        window.currentAddons = npcData.outfit.lookAddons;
        const addon1 = document.querySelector('input[name="addon1"]');
        const addon2 = document.querySelector('input[name="addon2"]');
        
        if (addon1) addon1.checked = (npcData.outfit.lookAddons & 1) !== 0;
        if (addon2) addon2.checked = (npcData.outfit.lookAddons & 2) !== 0;
    }
    
    // Popular mount
    if (npcData.outfit.lookMount && npcData.outfit.lookMount > 0) {
        window.mountEnabled = true;
        window.selectedMountId = npcData.outfit.lookMount;
        window.currentMount = npcData.outfit.lookMount;
        
        const mountCheckbox = document.querySelector('input[name="mount"]');
        if (mountCheckbox) mountCheckbox.checked = true;
    }
    
    // Popular mensagens
    if (npcData.talking.greets) {
        document.getElementById('greets-message').value = npcData.talking.greets;
    }
    if (npcData.talking.bye) {
        document.getElementById('bye-message').value = npcData.talking.bye;
    }
    if (npcData.talking.walkaway) {
        document.getElementById('walkaway-message').value = npcData.talking.walkaway;
    }
    
    // Popular shop - Resetar primeiro
    window.sellItems = [];
    window.buyItems = [];
    document.getElementById('canSellItems').checked = false;
    document.getElementById('canBuyItems').checked = false;
    document.getElementById('sell-items-container').style.display = 'none';
    document.getElementById('buy-items-container').style.display = 'none';
    document.getElementById('sell-message-group').style.display = 'none';
    
    // Popular itens de venda (NPC vende para player - buy no arquivo)
    if (npcData.shop.sellItems && npcData.shop.sellItems.length > 0) {
        console.log('Carregando itens de venda:', npcData.shop.sellItems);
        window.sellItems = npcData.shop.sellItems;
        document.getElementById('canSellItems').checked = true;
        document.getElementById('sell-items-container').style.display = 'block';
        document.getElementById('sell-message-group').style.display = 'flex';
        
        setTimeout(() => {
            if (window.updateSellItemsTable) {
                window.updateSellItemsTable();
                console.log('Tabela de sell items atualizada');
            }
        }, 100);
    }
    
    // Popular itens de compra (NPC compra do player - sell no arquivo)
    if (npcData.shop.buyItems && npcData.shop.buyItems.length > 0) {
        console.log('Carregando itens de compra:', npcData.shop.buyItems);
        window.buyItems = npcData.shop.buyItems;
        document.getElementById('canBuyItems').checked = true;
        document.getElementById('buy-items-container').style.display = 'block';
        
        setTimeout(() => {
            if (window.updateBuyItemsTable) {
                window.updateBuyItemsTable();
                console.log('Tabela de buy items atualizada');
            }
        }, 100);
    }
    
    // Popular keywords
    if (npcData.keywords && npcData.keywords.length > 0) {
        window.npcKeywords = npcData.keywords;
        document.getElementById('usesKeywords').checked = true;
        document.getElementById('keywords-container').style.display = 'block';
        if (window.updateKeywordsTable) window.updateKeywordsTable();
    }
    
    // Atualizar imagem do personagem
    setTimeout(() => {
        window.updateCharacterImage();
    }, 200);
    
    console.log('Arquivo NPC carregado com sucesso:', npcData);
} 