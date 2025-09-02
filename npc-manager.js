// NPC Manager - Gerencia todas as funcionalidades das seções
class NPCManager {
    constructor() {
        this.buyItems = [];
        this.sellItems = [];
        this.greetingMessages = [];
        this.farewellMessages = [];
        this.defaultMessages = [];
        this.keywords = [];
        this.init();
    }

    init() {
        this.initBuySell();
        this.initTalking();
        this.initKeywords();
        this.initGenerate();
        this.loadFromLocalStorage();
    }

    // ===== BUY/SELL SECTION =====
    initBuySell() {
        // Tabs functionality
        const buySellTabs = document.querySelectorAll('.buy-sell-tab');
        buySellTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                buySellTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabPanels = document.querySelectorAll('.tab-panel');
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                const targetPanel = document.getElementById(tab.dataset.tab + '-tab');
                targetPanel.classList.add('active');
            });
        });

        // Add buy item
        document.getElementById('add-buy-item').addEventListener('click', () => {
            this.addItemEntry('buy-items-list');
        });

        // Add sell item
        document.getElementById('add-sell-item').addEventListener('click', () => {
            this.addItemEntry('sell-items-list');
        });

        // Remove item functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                e.target.closest('.item-entry').remove();
            }
        });
    }

    addItemEntry(containerId) {
        const container = document.getElementById(containerId);
        const newEntry = document.createElement('div');
        newEntry.className = 'item-entry';
        newEntry.innerHTML = `
            <input type="text" placeholder="Item ID" class="item-id">
            <input type="text" placeholder="Item Name" class="item-name">
            <input type="number" placeholder="Price" class="item-price" min="0">
            <button class="remove-item">Remove</button>
        `;
        container.appendChild(newEntry);
    }

    // ===== TALKING SECTION =====
    initTalking() {
        // Add message buttons
        document.querySelectorAll('.add-message').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.addMessageEntry(type);
            });
        });

        // Remove message functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-message')) {
                e.target.closest('.message-entry').remove();
            }
        });
    }

    addMessageEntry(type) {
        const container = document.getElementById(type + '-messages');
        const newEntry = document.createElement('div');
        newEntry.className = 'message-entry';
        newEntry.innerHTML = `
            <textarea placeholder="Enter ${type} message..." class="message-text"></textarea>
            <button class="remove-message">Remove</button>
        `;
        container.appendChild(newEntry);
    }

    // ===== KEYWORDS SECTION =====
    initKeywords() {
        // Add keyword button
        document.getElementById('add-keyword-btn').addEventListener('click', () => {
            this.addKeywordEntry();
        });

        // Remove keyword functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-keyword')) {
                e.target.closest('.keyword-entry').remove();
            }
        });
    }

    addKeywordEntry() {
        const container = document.getElementById('keywords-list');
        const newEntry = document.createElement('div');
        newEntry.className = 'keyword-entry';
        newEntry.innerHTML = `
            <div class="keyword-inputs">
                <input type="text" placeholder="Keyword or phrase" class="keyword-text">
                <textarea placeholder="Response to this keyword..." class="keyword-response"></textarea>
            </div>
            <div class="keyword-actions">
                <button class="remove-keyword">Remove</button>
            </div>
        `;
        container.appendChild(newEntry);
    }

    // ===== GENERATE SECTION =====
    initGenerate() {
        document.getElementById('generate-config').addEventListener('click', () => {
            this.generateConfiguration();
        });

        document.getElementById('download-config').addEventListener('click', () => {
            this.downloadConfiguration();
        });

        document.getElementById('copy-config').addEventListener('click', () => {
            this.copyToClipboard();
        });
    }

    generateConfiguration() {
        const config = {
            basic: this.getBasicConfig(),
            buySell: this.getBuySellConfig(),
            talking: this.getTalkingConfig(),
            keywords: this.getKeywordsConfig()
        };

        const includeBasic = document.getElementById('include-basic').checked;
        const includeBuySell = document.getElementById('include-buy-sell').checked;
        const includeTalking = document.getElementById('include-talking').checked;
        const includeKeywords = document.getElementById('include-keywords').checked;

        let output = '-- NPC Configuration Generated by Canary NPC Creator\n\n';

        if (includeBasic) {
            output += this.formatBasicConfig(config.basic);
        }

        if (includeBuySell) {
            output += this.formatBuySellConfig(config.buySell);
        }

        if (includeTalking) {
            output += this.formatTalkingConfig(config.talking);
        }

        if (includeKeywords) {
            output += this.formatKeywordsConfig(config.keywords);
        }

        document.getElementById('config-output').value = output;
    }

    getBasicConfig() {
        return {
            name: document.getElementById('npc-name').value || 'NPC',
            maxHealth: document.getElementById('npc-max-health').value || 100,
            healthNow: document.getElementById('npc-health-now').value || 100,
            walkInterval: document.getElementById('npc-walk-interval').value || 1500,
            walkRadius: document.getElementById('npc-walk-radius').value || 2,
            speed: document.getElementById('npc-speed').value || 100,
            floorChange: document.querySelector('#basic-data select').value || 'false',
            looktype: window.currentLooktype || 136,
            mount: window.currentMount || 0,
            headColor: window.currentHeadColor || 0,
            primaryColor: window.currentPrimaryColor || 0,
            secondaryColor: window.currentSecondaryColor || 0,
            detailColor: window.currentDetailColor || 0
        };
    }

    getBuySellConfig() {
        const buyItems = [];
        const sellItems = [];

        // Collect buy items
        document.querySelectorAll('#buy-items-list .item-entry').forEach(entry => {
            const id = entry.querySelector('.item-id').value;
            const name = entry.querySelector('.item-name').value;
            const price = entry.querySelector('.item-price').value;
            
            if (id && name && price) {
                buyItems.push({ id, name, price });
            }
        });

        // Collect sell items
        document.querySelectorAll('#sell-items-list .item-entry').forEach(entry => {
            const id = entry.querySelector('.item-id').value;
            const name = entry.querySelector('.item-name').value;
            const price = entry.querySelector('.item-price').value;
            
            if (id && name && price) {
                sellItems.push({ id, name, price });
            }
        });

        return { buyItems, sellItems };
    }

    getTalkingConfig() {
        const greetingMessages = [];
        const farewellMessages = [];
        const defaultMessages = [];

        // Collect greeting messages
        document.querySelectorAll('#greeting-messages .message-text').forEach(textarea => {
            if (textarea.value.trim()) {
                greetingMessages.push(textarea.value.trim());
            }
        });

        // Collect farewell messages
        document.querySelectorAll('#farewell-messages .message-text').forEach(textarea => {
            if (textarea.value.trim()) {
                farewellMessages.push(textarea.value.trim());
            }
        });

        // Collect default messages
        document.querySelectorAll('#default-messages .message-text').forEach(textarea => {
            if (textarea.value.trim()) {
                defaultMessages.push(textarea.value.trim());
            }
        });

        return { greetingMessages, farewellMessages, defaultMessages };
    }

    getKeywordsConfig() {
        const keywords = [];

        document.querySelectorAll('.keyword-entry').forEach(entry => {
            const keyword = entry.querySelector('.keyword-text').value.trim();
            const response = entry.querySelector('.keyword-response').value.trim();
            
            if (keyword && response) {
                keywords.push({ keyword, response });
            }
        });

        return keywords;
    }

    formatBasicConfig(config) {
        return `-- Basic Configuration
npc_name = "${config.name}"
max_health = ${config.maxHealth}
health_now = ${config.healthNow}
walk_interval = ${config.walkInterval}
walk_radius = ${config.walkRadius}
speed = ${config.speed}
floor_change = ${config.floorChange}

-- Appearance
looktype = ${config.looktype}
mount = ${config.mount}
head_color = ${config.headColor}
primary_color = ${config.primaryColor}
secondary_color = ${config.secondaryColor}
detail_color = ${config.detailColor}

\n`;
    }

    formatBuySellConfig(config) {
        let output = '-- Buy/Sell Configuration\n\n';

        if (config.buyItems.length > 0) {
            output += '-- Items NPC can buy\n';
            config.buyItems.forEach(item => {
                output += `buy_item(${item.id}, "${item.name}", ${item.price})\n`;
            });
            output += '\n';
        }

        if (config.sellItems.length > 0) {
            output += '-- Items NPC can sell\n';
            config.sellItems.forEach(item => {
                output += `sell_item(${item.id}, "${item.name}", ${item.price})\n`;
            });
            output += '\n';
        }

        return output;
    }

    formatTalkingConfig(config) {
        let output = '-- Dialogue Configuration\n\n';

        if (config.greetingMessages.length > 0) {
            output += '-- Greeting messages\n';
            config.greetingMessages.forEach(msg => {
                output += `greeting_message("${msg.replace(/"/g, '\\"')}")\n`;
            });
            output += '\n';
        }

        if (config.farewellMessages.length > 0) {
            output += '-- Farewell messages\n';
            config.farewellMessages.forEach(msg => {
                output += `farewell_message("${msg.replace(/"/g, '\\"')}")\n`;
            });
            output += '\n';
        }

        if (config.defaultMessages.length > 0) {
            output += '-- Default responses\n';
            config.defaultMessages.forEach(msg => {
                output += `default_message("${msg.replace(/"/g, '\\"')}")\n`;
            });
            output += '\n';
        }

        return output;
    }

    formatKeywordsConfig(config) {
        if (config.length === 0) return '';

        let output = '-- Keyword Responses\n\n';
        config.forEach(item => {
            output += `keyword_response("${item.keyword.replace(/"/g, '\\"')}", "${item.response.replace(/"/g, '\\"')}")\n`;
        });
        output += '\n';

        return output;
    }

    downloadConfiguration() {
        const content = document.getElementById('config-output').value;
        if (!content) {
            alert('Please generate configuration first!');
            return;
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'npc_config.lua';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    copyToClipboard() {
        const content = document.getElementById('config-output').value;
        if (!content) {
            alert('Please generate configuration first!');
            return;
        }

        navigator.clipboard.writeText(content).then(() => {
            alert('Configuration copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please copy manually.');
        });
    }

    // ===== LOCAL STORAGE =====
    saveToLocalStorage() {
        const data = {
            buyItems: this.getBuySellConfig().buyItems,
            sellItems: this.getBuySellConfig().sellItems,
            talking: this.getTalkingConfig(),
            keywords: this.getKeywordsConfig()
        };
        localStorage.setItem('npcCreatorData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('npcCreatorData');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.loadBuySellData(parsed.buyItems, parsed.sellItems);
                this.loadTalkingData(parsed.talking);
                this.loadKeywordsData(parsed.keywords);
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }
    }

    loadBuySellData(buyItems, sellItems) {
        // Clear existing entries
        document.getElementById('buy-items-list').innerHTML = '';
        document.getElementById('sell-items-list').innerHTML = '';

        // Load buy items
        buyItems.forEach(item => {
            this.addItemEntry('buy-items-list');
            const entries = document.querySelectorAll('#buy-items-list .item-entry');
            const lastEntry = entries[entries.length - 1];
            lastEntry.querySelector('.item-id').value = item.id;
            lastEntry.querySelector('.item-name').value = item.name;
            lastEntry.querySelector('.item-price').value = item.price;
        });

        // Load sell items
        sellItems.forEach(item => {
            this.addItemEntry('sell-items-list');
            const entries = document.querySelectorAll('#sell-items-list .item-entry');
            const lastEntry = entries[entries.length - 1];
            lastEntry.querySelector('.item-id').value = item.id;
            lastEntry.querySelector('.item-name').value = item.name;
            lastEntry.querySelector('.item-price').value = item.price;
        });
    }

    loadTalkingData(talking) {
        // Clear existing messages
        document.getElementById('greeting-messages').innerHTML = '';
        document.getElementById('farewell-messages').innerHTML = '';
        document.getElementById('default-messages').innerHTML = '';

        // Load greeting messages
        talking.greetingMessages.forEach(msg => {
            this.addMessageEntry('greeting');
            const entries = document.querySelectorAll('#greeting-messages .message-entry');
            const lastEntry = entries[entries.length - 1];
            lastEntry.querySelector('.message-text').value = msg;
        });

        // Load farewell messages
        talking.farewellMessages.forEach(msg => {
            this.addMessageEntry('farewell');
            const entries = document.querySelectorAll('#farewell-messages .message-entry');
            const lastEntry = entries[entries.length - 1];
            lastEntry.querySelector('.message-text').value = msg;
        });

        // Load default messages
        talking.defaultMessages.forEach(msg => {
            this.addMessageEntry('default');
            const entries = document.querySelectorAll('#default-messages .message-entry');
            const lastEntry = entries[entries.length - 1];
            lastEntry.querySelector('.message-text').value = msg;
        });
    }

    loadKeywordsData(keywords) {
        // Clear existing keywords
        document.getElementById('keywords-list').innerHTML = '';

        // Load keywords
        keywords.forEach(item => {
            this.addKeywordEntry();
            const entries = document.querySelectorAll('.keyword-entry');
            const lastEntry = entries[entries.length - 1];
            lastEntry.querySelector('.keyword-text').value = item.keyword;
            lastEntry.querySelector('.keyword-response').value = item.response;
        });
    }
}

// Auto-save functionality
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            setTimeout(() => {
                if (window.npcManager) {
                    window.npcManager.saveToLocalStorage();
                }
            }, 1000);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.npcManager = new NPCManager();
    setupAutoSave();
}); 