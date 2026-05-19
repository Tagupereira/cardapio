const sheetID = "1dUpN4a6PFuxnxCU1S_fTniiGmifhha8X3XfNYvszbjc";
const configSheet = "config";
const menuSheet = "cardapio1";
const imgGoogle = "https://lh3.googleusercontent.com/d/";

const elements = {
    hero: document.getElementById('hero'),
    logo: document.getElementById('logo'),
    comercioName: document.getElementById('comercio-name'),
    menuContainer: document.getElementById('menu-container'),
    loading: document.getElementById('loading')
};

// Fetch Config
async function loadConfig() {
    try {
        const response = await fetch(`https://opensheet.elk.sh/${sheetID}/${configSheet}`);
        const data = await response.json();
        const config = data[0];

        elements.comercioName.innerText = config.comercio || "Pizzaria";
        elements.logo.src = config.logourl || (imgGoogle + config.logodrive);

        const bg = config.backgroundurl || (config.backgrounddrive ? (imgGoogle + config.backgrounddrive) : "");
        if (bg) elements.hero.style.backgroundImage = `url(${bg})`;

        if (config.subtitulo) document.getElementById('subtitle').innerText = config.subtitulo;

    } catch (error) {
        console.error("Erro ao carregar configurações:", error);
    }
}

// Fetch Menu
async function loadMenu() {
    try {
        const response = await fetch(`https://opensheet.elk.sh/${sheetID}/${menuSheet}`);
        const products = await response.json();

        const categoriesMap = {};
        products.forEach(prod => {
            if (prod.estado === "off") return;
            if (!categoriesMap[prod.categoria]) categoriesMap[prod.categoria] = [];
            categoriesMap[prod.categoria].push(prod);
        });

        renderMenu(categoriesMap);
        elements.loading.style.display = 'none';
    } catch (error) {
        console.error("Erro ao carregar menu:", error);
        elements.loading.innerHTML = "<p>Erro ao carregar cardápio. Tente novamente.</p>";
    }
}

function renderMenu(categoriesMap) {
    elements.menuContainer.innerHTML = '';
    let globalIndex = 1;

    Object.keys(categoriesMap).forEach(catName => {
        const section = document.createElement('details');
        section.className = 'category-group';

        section.innerHTML = `
                    <summary class="category-header">
                        <h2 class="category-title">${catName}</h2>
                    </summary>
                    <div class="products-grid">
                        ${categoriesMap[catName].map(item => {
            const num = String(globalIndex++).padStart(2, '0');
            const prices = parsePrices(item.preco);

            return `
                            <div class="product-card">
                                <div class="product-image-container">
                                    <div class="product-number">${num}</div>
                                    
                                    <img class="product-img" src="${imgGoogle + item.img}" alt="${item.nome}" onerror="this.src='https://via.placeholder.com/150/222/e2b04a?text=Pizza'">
                                </div>
                                <div class="product-info">
                                    <h3>${item.nome}</h3>
                                    <p class="product-desc" title="${item.descricao || ''}">${item.descricao || ''}</p>
                                    <div class="price-container">
                                        ${prices.map(p => `
                                            <div class="price-item">
                                                <div class="price-value">R$ ${p.value}</div>
                                                <div class="price-label">${p.label}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            `;
        }).join('')}
                    </div>
                `;
        elements.menuContainer.appendChild(section);
    });
}

function parsePrices(priceStr) {
    if (!priceStr) return [{ value: '?', label: '-' }];

    const parts = String(priceStr).split(/-|\//);
    if (parts.length === 3) {
        return [
            { value: parts[0].trim(), label: '4 ped' },
            { value: parts[1].trim(), label: '8 ped' },
            { value: parts[2].trim(), label: '12 ped' }
        ];
    }
    if (parts.length === 2) {
        return [
            { value: parts[0].trim(), label: 'Port' },
            { value: parts[1].trim(), label: 'Grande' }
        ];
    }
    return [{ value: priceStr.trim(), label: '' }];
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadMenu();
});



elements.menuContainer.addEventListener('toggle', (e) => {

    if (e.target.tagName !== "DETAILS") return;

    const all = document.querySelectorAll('.category-group');

    // se abriu uma categoria
    if (e.target.open) {

        all.forEach(detail => {
            if (detail !== e.target) detail.open = false;
        });

        setTimeout(() => {
            window.scrollTo({
                top: e.target.offsetTop,
                behavior: "smooth"
            });
        }, 200);

        return;
    }

    // 🔥 se fechou tudo
    const nenhumAberto = [...all].every(d => !d.open);

    if (nenhumAberto) {

        const primeira = all[0];

        if (primeira) {
            setTimeout(() => {
                window.scrollTo({
                    //top: primeira.getBoundingClientRect().top,
                    top: primeira.offsetTop,
                    behavior: "smooth"
                });
            }, 100);
        }
    }

}, true);