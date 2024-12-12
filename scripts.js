async function readOutfitsXml() {
    try {
        const response = await fetch('xml/outfits.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const outfits = xmlDoc.getElementsByTagName('outfit');
        const femaleOutfits = [];
        const maleOutfits = [];

        for (let outfit of outfits) {
            const type = outfit.getAttribute('type');
            const looktype = outfit.getAttribute('looktype');
            const name = outfit.getAttribute('name');

            if (type === '0') {
                femaleOutfits.push({ looktype, name });
            } else {
                maleOutfits.push({ looktype, name });
            }
        }

        return { femaleOutfits, maleOutfits };
    } catch (error) {
        console.error('Erro ao ler o arquivo XML:', error);
        return { femaleOutfits: [], maleOutfits: [] };
    }
}

async function readMountsXml() {
    try {
        const response = await fetch('xml/mounts.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const mounts = xmlDoc.getElementsByTagName('mount');
        const mountsList = [];

        for (let mount of mounts) {
            const clientid = mount.getAttribute('clientid');
            const name = mount.getAttribute('name');
            const type = mount.getAttribute('type');
            
            mountsList.push({ 
                clientid, 
                name,
                type
            });
        }

        return mountsList;
    } catch (error) {
        console.error('Erro ao ler o arquivo XML de montarias:', error);
        return [];
    }
}

async function loadOutfits(gender) {
    const { femaleOutfits, maleOutfits } = await readOutfitsXml();
    const outfits = gender === 'female' ? femaleOutfits : maleOutfits;
    const outfitList = document.getElementById('outfitList');
    
    outfitList.innerHTML = outfits.map(outfit => `
        <li data-looktype="${outfit.looktype}">
            ${outfit.looktype} - ${outfit.name}
        </li>
    `).join('');

    // Atualizar o looktype atual com o primeiro da lista se existir
    if (outfits.length > 0) {
        window.currentLooktype = outfits[0].looktype;
        window.updateCharacterImage();
    }
}

async function loadMount() {
    const mountList = document.getElementById('mountList');
    const mounts = await readMountsXml();
    
    mountList.innerHTML = mounts.map(mount => `
        <li data-clientid="${mount.clientid}">
            ${mount.clientid} - ${mount.name}
        </li>
    `).join('');

    // Atualizar o mount atual com o primeiro da lista se existir
    if (mounts.length > 0) {
        window.currentMount = mounts[0].clientid;
        window.updateCharacterImage();
    }
}

function createOutfitSelector() {
    const genderSelector = document.getElementById('genderSelector');
    const outfitList = document.getElementById('outfitList');

    // Carregar outfits iniciais
    loadOutfits('female');

    // Adicionar evento de mudança no seletor de gênero
    genderSelector.addEventListener('change', (e) => {
        loadOutfits(e.target.value);
    });

    // Adicionar evento de clique para os itens da lista
    outfitList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li) {
            const looktype = li.getAttribute('data-looktype');
            if (looktype) {
                window.currentLooktype = looktype;
                window.updateCharacterImage();

                // Remover seleção anterior e selecionar o novo item
                outfitList.querySelectorAll('li').forEach(item => {
                    item.style.background = '';
                });
                li.style.background = 'hsla(0, 0%, 0%, 0.349)';
            }
        }
    });
}

function createMountSelector() {
    const mountList = document.getElementById('mountList');

    // Carregar montarias iniciais
    loadMount();

    // Adicionar evento de clique para os itens da lista
    mountList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li) {
            const clientid = li.getAttribute('data-clientid');
            if (clientid) {
                window.currentMount = clientid;
                window.updateCharacterImage();

                // Remover seleção anterior e selecionar o novo item
                mountList.querySelectorAll('li').forEach(item => {
                    item.style.background = '';
                });
                li.style.background = 'hsla(0, 0%, 0%, 0.349)';
            }
        }
    });
}

// Exportar funções para uso global
window.readOutfitsXml = readOutfitsXml;
window.loadOutfits = loadOutfits;
window.createOutfitSelector = createOutfitSelector;
window.createMountSelector = createMountSelector;
