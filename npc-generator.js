// Gerador de scripts NPC para Canary
window.generatedNPCCode = '';

// Função principal para gerar o NPC
window.generateNPC = function() {
    try {
        const npcData = collectNPCData();
        const generatedCode = generateNPCScript(npcData);
        
        document.getElementById('generated-code').value = generatedCode;
        document.getElementById('generate-modal').style.display = 'block';
        window.generatedNPCCode = generatedCode;
    } catch (error) {
        console.error('Erro ao gerar NPC:', error);
        alert('Erro ao gerar o script do NPC. Verifique se todos os campos obrigatórios estão preenchidos.');
    }
};

// Função para fechar o modal
window.closeGenerateModal = function() {
    document.getElementById('generate-modal').style.display = 'none';
};

// Função para download do script
window.downloadNPCScript = function() {
    if (!window.generatedNPCCode) {
        alert('Nenhum código foi gerado ainda.');
        return;
    }
    
    const npcName = document.getElementById('npc-name').value || 'Unnamed_NPC';
    const fileName = `${npcName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.lua`;
    
    // Criar elemento de download
    const element = document.createElement('a');
    const file = new Blob([window.generatedNPCCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Limpar URL do objeto
    URL.revokeObjectURL(element.href);
};

// Função para coletar dados do NPC da interface
function collectNPCData() {
    // Dados básicos
    const basicData = {
        name: document.getElementById('npc-name').value || 'Unnamed NPC',
        maxHealth: parseInt(document.getElementById('npc-max-health').value) || 100,
        health: parseInt(document.getElementById('npc-health-now').value) || 100,
        walkInterval: parseInt(document.getElementById('npc-walk-interval').value) || 1500,
        walkRadius: parseInt(document.getElementById('npc-walk-radius').value) || 2,
        speed: parseInt(document.getElementById('npc-speed').value) || 100,
        floorChange: document.getElementById('floorChangeSelector').value === 'true'
    };
    
    // Dados de aparência
    const outfitData = {
        lookType: parseInt(window.currentLooktype) || 136,
        lookHead: parseInt(window.currentHeadColor) || 0,
        lookBody: parseInt(window.currentPrimaryColor) || 0,
        lookLegs: parseInt(window.currentSecondaryColor) || 0,
        lookFeet: parseInt(window.currentDetailColor) || 0,
        lookAddons: getAddonsValue(),
        lookMount: parseInt(window.currentMount) || 0
    };
    
    // Dados de mensagens
    const talkingData = {
        greets: document.getElementById('greets-message').value || 'Hello |PLAYERNAME|!',
        bye: document.getElementById('bye-message').value || 'Good bye!',
        walkaway: document.getElementById('walkaway-message').value || 'Hey, come back!',
        sell: document.getElementById('sell-message').value || 'Sold %ix %s for %i gold.'
    };
    
    // Dados de loja
    const shopData = {
        canSell: document.getElementById('canSellItems')?.checked || false,
        canBuy: document.getElementById('canBuyItems')?.checked || false,
        sellItems: window.sellItems || [],
        buyItems: window.buyItems || []
    };
    
    // Dados de keywords
    const keywordsData = {
        useKeywords: document.getElementById('usesKeywords')?.checked || false,
        keywords: window.npcKeywords || []
    };
    
    return {
        basic: basicData,
        outfit: outfitData,
        talking: talkingData,
        shop: shopData,
        keywords: keywordsData
    };
}

// Função para obter valor dos addons
function getAddonsValue() {
    let addons = 0;
    const addon1 = document.querySelector('input[name="addon1"]')?.checked;
    const addon2 = document.querySelector('input[name="addon2"]')?.checked;
    
    if (addon1) addons += 1;
    if (addon2) addons += 2;
    
    return addons;
}

// Função principal para gerar o script do NPC
function generateNPCScript(data) {
    const { basic, outfit, talking, shop, keywords } = data;
    
    let script = '';
    
    // Cabeçalho
    script += `local npcName = "${basic.name}"\n\n`;
    script += `local npcType = Game.createNpcType(npcName)\n`;
    script += `local npcConfig = {}\n\n`;
    
    // Configurações básicas
    script += `npcConfig.name = npcName\n`;
    script += `npcConfig.description = npcName\n\n`;
    
    script += `npcConfig.health = ${basic.health}\n`;
    script += `npcConfig.maxHealth = ${basic.maxHealth}\n`;
    script += `npcConfig.walkInterval = ${basic.walkInterval}\n`;
    script += `npcConfig.walkRadius = ${basic.walkRadius}\n\n`;
    
    // Configurações de aparência
    script += `npcConfig.outfit = {\n`;
    script += `\tlookType = ${outfit.lookType},\n`;
    script += `\tlookHead = ${outfit.lookHead},\n`;
    script += `\tlookBody = ${outfit.lookBody},\n`;
    script += `\tlookLegs = ${outfit.lookLegs},\n`;
    script += `\tlookFeet = ${outfit.lookFeet},\n`;
    script += `\tlookAddons = ${outfit.lookAddons},\n`;
    if (outfit.lookMount > 0) {
        script += `\tlookMount = ${outfit.lookMount},\n`;
    }
    script += `}\n\n`;
    
    // Flags
    script += `npcConfig.flags = {\n`;
    script += `\tfloorchange = ${basic.floorChange},\n`;
    script += `}\n\n`;
    
    // Shop (se houver itens)
    if (shop.canSell || shop.canBuy) {
        script += generateShopSection(shop);
    }
    
    // Handlers
    script += `-- Create keywordHandler and npcHandler\n`;
    script += `local keywordHandler = KeywordHandler:new()\n`;
    script += `local npcHandler = NpcHandler:new(keywordHandler)\n\n`;
    
    // Event handlers
    script += generateEventHandlers();
    
    // Keywords personalizadas
    if (keywords.useKeywords && keywords.keywords.length > 0) {
        script += generateKeywordsSection(keywords.keywords);
    }
    
    // Callback de saudação
    script += generateGreetCallback(talking.greets);
    
    // Callback de mensagens personalizadas
    if (keywords.useKeywords && keywords.keywords.length > 0) {
        script += generateMessageCallback(keywords.keywords);
    }
    
    // Configuração final
    script += `-- Set callbacks\n`;
    script += `npcHandler:setCallback(CALLBACK_GREET, greetCallback)\n`;
    if (keywords.useKeywords && keywords.keywords.length > 0) {
        script += `npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)\n`;
    }
    script += `\n`;
    
    // Mensagens finais
    script += `-- Messages\n`;
    script += `npcHandler:setMessage(MESSAGE_FAREWELL, "${talking.bye}")\n`;
    script += `npcHandler:setMessage(MESSAGE_WALKAWAY, "${talking.walkaway}")\n\n`;
    
    script += `npcHandler:addModule(FocusModule:new(), npcConfig.name, true, true, true)\n\n`;
    
    // Registro
    script += `-- Register npc\n`;
    script += `npcType:register(npcConfig)\n`;
    
    return script;
}

// Função para gerar seção da loja
function generateShopSection(shop) {
    let script = `-- Npc shop\n`;
    script += `npcConfig.shop = {\n`;
    
    const allItems = [];
    
    // Adicionar itens de venda
    if (shop.canSell && shop.sellItems.length > 0) {
        shop.sellItems.forEach(item => {
            allItems.push(`\t{ itemName = "${item.name}", clientId = ${item.id}, buy = ${item.gold} }`);
        });
    }
    
    // Adicionar itens de compra
    if (shop.canBuy && shop.buyItems.length > 0) {
        shop.buyItems.forEach(item => {
            allItems.push(`\t{ itemName = "${item.name}", clientId = ${item.id}, sell = ${item.gold} }`);
        });
    }
    
    script += allItems.join(',\n') + '\n';
    script += `}\n\n`;
    
    return script;
}

// Função para gerar event handlers
function generateEventHandlers() {
    return `-- onThink
npcType.onThink = function(npc, interval)
\tnpcHandler:onThink(npc, interval)
end

-- onAppear
npcType.onAppear = function(npc, creature)
\tnpcHandler:onAppear(npc, creature)
end

-- onDisappear
npcType.onDisappear = function(npc, creature)
\tnpcHandler:onDisappear(npc, creature)
end

-- onMove
npcType.onMove = function(npc, creature, fromPosition, toPosition)
\tnpcHandler:onMove(npc, creature, fromPosition, toPosition)
end

-- onSay
npcType.onSay = function(npc, creature, type, message)
\tnpcHandler:onSay(npc, creature, type, message)
end

-- onPlayerCloseChannel
npcType.onCloseChannel = function(npc, player)
\tnpcHandler:onCloseChannel(npc, player)
end

-- On buy npc shop message
npcType.onBuyItem = function(npc, player, itemId, subType, amount, ignore, inBackpacks, totalCost)
\tnpc:sellItem(player, itemId, amount, subType, 0, ignore, inBackpacks)
end

-- On sell npc shop message
npcType.onSellItem = function(npc, player, itemId, subtype, amount, ignore, name, totalCost)
\tplayer:sendTextMessage(MESSAGE_TRADE, string.format("Sold %ix %s for %i gold.", amount, name, totalCost))
end

-- On check npc shop message (look item)
npcType.onCheckItem = function(npc, player, clientId, subType) end

`;
}

// Função para gerar seção de keywords
function generateKeywordsSection(keywords) {
    let script = `-- Custom keywords\n`;
    
    keywords.forEach((keyword, index) => {
        script += `local node${index + 1} = keywordHandler:addKeyword({ "${keyword.keyword}" }, StdModule.say, {\n`;
        script += `\tnpcHandler = npcHandler,\n`;
        script += `\tonlyFocus = true,\n`;
        script += `\ttext = "${keyword.response}",\n`;
        script += `})\n\n`;
    });
    
    return script;
}

// Função para gerar callback de saudação
function generateGreetCallback(greetMessage) {
    return `-- Function called by the callback "npcHandler:setCallback(CALLBACK_GREET, greetCallback)"
local function greetCallback(npc, player)
\tnpcHandler:setMessage(MESSAGE_GREET, "${greetMessage}")
\treturn true
end

`;
}

// Função para gerar callback de mensagens personalizadas
function generateMessageCallback(keywords) {
    let script = `-- On creature say callback
local function creatureSayCallback(npc, player, type, msg)
\tlocal playerId = player:getId()
\tif not npcHandler:checkInteraction(npc, player) then
\t\treturn false
\tend

`;
    
    keywords.forEach((keyword, index) => {
        const condition = index === 0 ? 'if' : 'elseif';
        script += `\t${condition} MsgContains(msg, "${keyword.keyword}") then\n`;
        script += `\t\tnpcHandler:say("${keyword.response}", npc, player)\n`;
    });
    
    script += `\tend\n`;
    script += `\treturn true\n`;
    script += `end\n\n`;
    
    return script;
}

// Fechar modal ao clicar fora dele
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('generate-modal');
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}); 