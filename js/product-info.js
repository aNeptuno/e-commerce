
let currentProductsRegistry = {};
let commentsArray = [];

document.addEventListener("DOMContentLoaded", function(e){

    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsRegistry = resultObj.data;
            showProduct();
            showRelatedProducts();
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            commentsArray = resultObj.data;
            showComments();
        }
    });
});


let urlToBD = 'https://636cd806ab4814f2b26fdde3.mockapi.io/cartArticles';

function addProdToCart(){
    let p = currentProductsRegistry;
    fetch(urlToBD, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "category": p.category,
            "unitCost": p.cost,
            "currency": p.currency,
            "description": p.description,
            "id": p.id,
            "images": p.images,
            "name": p.name,
            "relatedProducts": p.relatedProducts,
            "soldCount": p.soldCount 
        })
    })
    .then(response => {

        /* MOSTRAR ALERTA DE ÉXITO */
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

        const alert = (message, type) => {
            const wrapper = document.createElement('div')
            wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('')

            alertPlaceholder.append(wrapper)
        }

        if(response.ok){
            alert('Se ha añadido al carrito', 'success');
        }
    });

}


function showProduct(){

    let htmlContentToAppend = "";
    let p = currentProductsRegistry;
    
    htmlContentToAppend += `
    <div class="product-header">
        <h2 class="productTitle">${p.name}</h2>
        <button type="button" class="btn btn-success" 
        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: 1rem; height: 50%;" onclick="addProdToCart()">Comprar</button>
    </div>
    <hr>
    <ul>
        <li>
            <p>
               <b>Precio</b></br>
               ${p.currency} ${p.cost}
            </p>
        </li>
        <li>
            <p>
               <b>Descripción</b></br>
               ${p.description}
            </p>
        </li>
        <li>
            <p>
               <b>Categoría</b></br>
               ${p.category} 
            </p>
        </li>
        <li>
            <p>
               <b>Cantidad de vendidos</b></br>
               ${p.soldCount} 
            </p>
        </li>
        <li>
            <b>Imágenes ilustrativas</b>

            <div id="carouselProductImages" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselProductImages" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselProductImages" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselProductImages" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselProductImages" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active data-bs-interval="2000">
                <img src="${p.images[0]}" class="d-block w-100 img-thumbnail">
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                <img src="${p.images[1]}" class="d-block w-100 img-thumbnail">
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                <img src="${p.images[2]}" class="d-block w-100 img-thumbnail">
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                <img src="${p.images[3]}" class="d-block w-100 img-thumbnail">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselProductImages" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselProductImages" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
            </div>

            
        </li>
    </ul>
    `

    document.getElementById("product-container").innerHTML = htmlContentToAppend;
}

/* MOSTRAR COMENTARIOS */
function showComments(){
    let htmlContentToAppend = "";

    for(let c of commentsArray) {

        let black = 5-c.score;
        let htmlStars = `<span class="fa fa-star checked"></span>`;
        let htmlStarsBlack =`<span class="fa fa-star"></span>`;

        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
                <div class="col">
                    <div class="d-flex w-100">
                        <b>${c.user}</b><pre> </pre>
                        <span class="text-muted"> - ${c.dateTime} - </span>
                        <span>${htmlStars.repeat(c.score)}${htmlStarsBlack.repeat(black)}</span>
                    </div>
                    <small class="text-muted">${c.description}</small>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("comentary").innerHTML += htmlContentToAppend;

}

function setRelProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showRelatedProducts(){
    let arrayRelProd = currentProductsRegistry.relatedProducts;
    let htmlContentToAppend = "";

    htmlContentToAppend += `
                <div class="carousel-item active data-bs-interval="2000">
                    <img src="${arrayRelProd[0].image}" class="d-block w-100 img-thumbnail">
                    <div class="carousel-caption d-none d-md-block">
                        <span class="dark">${arrayRelProd[0].name}</span>
                    </div>
                </div>
        `

    for(let i=1; i< arrayRelProd.length; i++) {
        htmlContentToAppend += `
                <div class="carousel-item data-bs-interval="2000">
                    <img src="${arrayRelProd[i].image}" class="d-block w-100 img-thumbnail">
                    <div class="carousel-caption d-none d-md-block">
                        <span class="dark">${arrayRelProd[i].name}</span>
                    </div>
                </div>
        `
    }
    
    document.getElementById("carousel-inner-content").innerHTML += htmlContentToAppend;
}


/* AGREGAR COMENTARIOS */
let arrayComments = []; //arreglo para los comentarios agregados

document.getElementById("comBtn").addEventListener("click", function(e){
    e.preventDefault();

    let comentario = document.getElementById('prodReview').value;
    let puntuacion = document.getElementById('score').value;
    
    addCommentToArray(comentario,puntuacion);

    //setea los input en 0 nuevamente
    document.getElementById('prodReview').value = "";
    document.getElementById('score').value = "";
    
    
});

//comentario, puntuacion
function addCommentToArray(c,s){

    let score = parseInt(s);
    let usuario = localStorage.getItem("emailUsuario");
    let prodID = parseInt(localStorage.getItem('prodID'));
    
    var d = new Date,
    dformat = [d.getFullYear(),
               d.getMonth()+1,
               d.getDate()].join('-')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');


    let black = 5-score;
    let htmlStars = `<span class="fa fa-star checked"></span>`;
    let htmlStarsBlack =`<span class="fa fa-star"></span>`;

    let htmlContentToAppend = "";
    
        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
                <div class="col">
                    <div class="d-flex w-100">
                        <b>${usuario}</b><pre> </pre>
                        <span class="text-muted"> - ${dformat} - </span>
                        <span>${htmlStars.repeat(s)}${htmlStarsBlack.repeat(black)}</span>
                    </div>
                    <small class="text-muted">${c}</small>
                </div>
            </div>
        </div>
        `
       
        document.getElementById("comentary").innerHTML += htmlContentToAppend;       
} 
    
     
