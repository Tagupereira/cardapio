const menu = document.getElementById("menu");
const listJson = "https://opensheet.elk.sh/1dUpN4a6PFuxnxCU1S_fTniiGmifhha8X3XfNYvszbjc/cardapio1";
const imgGoogle = "https://lh3.googleusercontent.com/d/";

fetch(listJson)
.then(res => res.json())
.then(produtos => {

    const title = document.getElementById("title")
    const menu = document.getElementById("menu")
    
    title.innerText = produtos[0].comercio;

    const categorias = {}

    produtos.forEach(prod => {

        if(!categorias[prod.categoria]){
            categorias[prod.categoria] = []
        }

        categorias[prod.categoria].push(prod)

    })

    Object.keys(categorias).forEach(nomeCategoria => {

        menu.innerHTML += `<div class="categoria">${nomeCategoria}</div>`

        categorias[nomeCategoria].forEach(item => {
           
            menu.innerHTML += `
            <div class="item">

            <img src="${imgGoogle+item.img}">

            <div class="info">
            <div class="nome">${item.nome}</div>
            <div class="preco">R$ ${item.preco}</div>
            </div>

            </div>
            `

        })

    })

})

// fetch("produtos.json")
// .then(res => res.json())
// .then(data => {

//     data.categorias.forEach(categoria => {

//         menu.innerHTML += `
//         <div class="categoria">
//             ${categoria.nome}
//         </div>
//         `

//         categoria.itens.forEach(item => {

//         menu.innerHTML += `
//         <div class="item">

//             <img src="${item.img}">

//             <div class="info">
//                 <div class="nome">${item.nome}</div>
//                 <div class="preco">R$ ${item.preco}</div>
//             </div>

//         </div>
//         `

//         })

//     })

// })