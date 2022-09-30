

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

let producto = localStorage.getItem("prodID");


function showProduct(){

    let htmlContentToAppend = "";
    let p = currentProductsRegistry;
    
    htmlContentToAppend += `
    <h2 class="productTitle">${p.name}</h2>
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
            <div class="imagenes col-3">
               <img src="${p.images[0]}"  class="img-thumbnail"></img>
               <img src="${p.images[1]}" class="img-thumbnail"></img>
               <img src="${p.images[2]}"  class="img-thumbnail"></img>
               <img src="${p.images[3]}"  class="img-thumbnail"></img>
            </div>
        </li>
    </ul>
    `

    document.getElementById("product-container").innerHTML = htmlContentToAppend;
}

function showComments(){
    let htmlContentToAppend = "";

    for(let i=0; i < commentsArray.length; i++) {
        let c = commentsArray[i];
        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
                <div class="col">
                    <div class="d-flex w-100">
                        <b>${c.user}</b><pre> </pre>
                        <span class="text-muted"> - ${c.dateTime} - </span>
                        <span id="com${i}"></span>
                    </div>
                    <small class="text-muted">${c.description}</small>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("comentary").innerHTML += htmlContentToAppend;

    // AGREGAR SCORE
    for(let i=0; i < commentsArray.length; i++) {
        let htmlContentToAppend = "";
        let c = commentsArray[i];
        let s = c.score;
        let r = 5-s;

        for(let i=0; i<s; i++){
            htmlContentToAppend += `
            <span class="fa fa-star checked"></span>
            `
        }

        for(let i=0; i<r; i++){
            htmlContentToAppend += `
            <span class="fa fa-star"></span>
            `
        }
        document.getElementById(`com${i}`).innerHTML += htmlContentToAppend; 
    } 
}

function setRelProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showRelatedProducts(){
    let arrayRelProd = currentProductsRegistry.relatedProducts;
    let htmlContentToAppend = "";

    for(let p of arrayRelProd) {
        htmlContentToAppend += `
        <li onclick="setRelProdID(${p.id})" class="imagenes col-3">
            <img src="${p.image}"  class="img-relProd"></img>
            <p>${p.name}</p>
        </li>
        `
    }
    
    document.getElementById("relProdList").innerHTML += htmlContentToAppend;
}

let cont = 0; //contador de los comentarios agregados
let arrayComments = []; //arreglo para los comentarios agregados

document.getElementById("comBtn").addEventListener("click", function(e){
    e.preventDefault();

    let comentario = document.getElementById('prodReview').value;
    let puntuacion = document.getElementById('score').value;
    
    addComment(comentario,puntuacion);

    document.getElementById('prodReview').value = "";
    document.getElementById('score').value = "";
    
    
});

function addComment(c,s){

    let usuario = localStorage.getItem("emailUsuario");
    
    var d = new Date,
    dformat = [d.getFullYear(),
               d.getMonth()+1,
               d.getDate()].join('-')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');

    cont ++; //agrega un comentario

    let htmlContentToAppend = "";

    
        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
                <div class="col">
                    <div class="d-flex w-100">
                        <b>${usuario}</b><pre> </pre>
                        <span class="text-muted"> - ${dformat} - </span>
                        <span id="com_${cont}"></span>
                    </div>
                    <small class="text-muted">${c}</small>
                </div>
            </div>
        </div>
        `
       
        document.getElementById("comentary").innerHTML += htmlContentToAppend;

        let htmlContentToAppend2 = "";
        let r = 5-s;

        for(let i=0; i<s; i++){
            htmlContentToAppend2 += `
            <span class="fa fa-star checked"></span>
            `
        }

        for(let i=0; i<r; i++){
            htmlContentToAppend2 += `
            <span class="fa fa-star"></span>
            `
        }

        document.getElementById(`com_${cont}`).innerHTML += htmlContentToAppend2; 
        
} 
    
     
