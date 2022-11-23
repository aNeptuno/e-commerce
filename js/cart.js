
let MONEY_SYMBOL = "$";
let DOLLAR_SYMBOL = "USD ";
const CambioUYtoUSD = 0.025;
const CambioUSDtoUY = 39.56;

let tbody = document.getElementById("tbody");

let currentArticlesArray = [];
let subtotalArray = [];
let currencyArray = [];
let paymentMetodSelected = '';
let deliveryTypeMetod = 0;



function deleteArticle(idBD) {
    let urlToBD = 'https://636cd806ab4814f2b26fdde3.mockapi.io/cartArticles/';
    fetch(urlToBD + idBD, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            fetch(urlToBD)
            .then(respuesta => respuesta.json())
            .then(datos => {
                currentArticlesArray = datos;
                showArticles()
            });
        } else {
            throw new Error(response.status);
        }
    })

}

function showPeugeot(){
    currentArticlesArray[0] = {
        "category": "Autos",
        "currency": "USD",
        "description": "El modelo de auto que se sigue renovando y manteniendo su prestigio en comodidad.",
        "id": 50924,
        "idBD": "1",
        "images": ["img/prod50924_1.jpg","img/prod50924_2.jpg","img/prod50924_3.jpg","img/prod50924_4.jpg"],
        "name": "Peugeot 208",
        "relatedProducts": [{id: 50921, name: "Chevrolet Onix Joy", image: "img/prod50921_1.jpg"},{id: 50923, name: "Suzuki Celerio", image: "img/prod50923_1.jpg"}],
        "soldCount": 17,
        "unitCost": 15200
    }
    loadSubtotalAndCurrency();
}

function showArticles() {

    let htmlContentToAppend = "";

    if (currentArticlesArray.length == 0) {
        document.getElementById("tbody").innerHTML = "";
        showPeugeot();
    }


    for (let i = 0; i < currentArticlesArray.length; i++) {

        let a = currentArticlesArray[i];
        let cost = a.unitCost;
        let currency = a.currency;

        let subtotal = subtotalArray[i];

        htmlContentToAppend += `
        <tr>
            <td><img src="${a.images[0]}" class="cart-img"></img></td>
            <td>${a.name}</td>
            <td>${currency} ${cost}</td>
            <td><input type="number" name="articleCountInput" class="form-control cart-count" required value="1"
            min="1"></td>
            <td>
                <b class="subtotal-display">${currency} ${subtotal}</b>
            </td>
            <td>
            <button type="button" class="btn deleteArticleBtn" onclick="deleteArticle(${a.idBD})">
                <span id="boot-icon" class="bi bi-trash" style="font-size: 30px; color: rgb(210, 20, 20); opacity: 0.9; -webkit-text-stroke-width: 0.1px;"></span>
            </button>
            </td>
            
        </tr>
        `

        document.getElementById("tbody").innerHTML = htmlContentToAppend;


    }

}


/* Sumatoria del array subtotal */
function calcSubtotal() {
    let acumulador = 0;
    for (let i = 0; i < subtotalArray.length; i++) {
        
        acumulador += subtotalArray[i];
    }
    return acumulador;
}

function updateTotalCosts() {
    let unitproductSubtotalHTML = document.getElementById("productSubtotalText");
    let deliveryCostHTML = document.getElementById("deliveryText");
    let totalCostHTML = document.getElementById("totalCostText");

    let subtotal = calcSubtotal();

    let delivery = Math.round(subtotal * deliveryTypeMetod / 100);
    let total = subtotal + Math.round((subtotal * deliveryTypeMetod) / 100);

    let unitSubtotalToShow = DOLLAR_SYMBOL + subtotal;
    let deliveryToShow = DOLLAR_SYMBOL + delivery;
    let totalCostToShow = DOLLAR_SYMBOL + total;

    unitproductSubtotalHTML.innerHTML = unitSubtotalToShow;
    deliveryCostHTML.innerHTML = deliveryToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}



function updateCostHTML() {
    let arrayInputs = Array.from(document.getElementsByClassName('cart-count'));
    let textSubtotalHTML = document.getElementsByClassName('subtotal-display');

    function calculoSubtotal(){ 
        let subtotalTemp = [];  

        for (var i = 0; i < arrayInputs.length; i++){
            let input = arrayInputs[i];

            if(currentArticlesArray[i].currency === 'UYU'){
                subtotalUnit = Math.floor((currentArticlesArray[i].unitCost) * CambioUYtoUSD * input.value); //Los subtotales todos en dolares
            } else {
                subtotalUnit = Math.floor(currentArticlesArray[i].unitCost * input.value);
            }

            //subtotalUnit = currentArticlesArray[i].unitCost * input.value;
            subtotalTemp.push(subtotalUnit);
        }
        return subtotalTemp;
    }

    arrayInputs.forEach(function(element){
        element.addEventListener("change", function () {
            subtotalArray = calculoSubtotal();

            /* Para actualizarlo en la vista */
            let i = arrayInputs.indexOf(element);
            let curr = currencyArray[i];
            let subt = subtotalArray[i];

            if(curr==='UYU') {
                //Lo pasa a uruguayos
                subt = Math.floor(subt * CambioUSDtoUY);
            }
            textSubtotalHTML[i].innerHTML = `${curr} ${subt}`;

            updateTotalCosts();
        });
    });
}
    



/* TIPO DE ENVIO */

let premiumRadio = document.getElementById('premiumradio');
let expressRadio = document.getElementById('expressradio');
let standardRadio = document.getElementById('standardradio');

premiumRadio.addEventListener('click', function (e) {
    deliveryTypeMetod = premiumRadio.value;
    updateTotalCosts();
});

expressRadio.addEventListener('click', function (e) {
    deliveryTypeMetod = expressRadio.value;
    updateTotalCosts();
});

standardRadio.addEventListener('click', function (e) {
    deliveryTypeMetod = standardRadio.value;
    updateTotalCosts();
});

//Carga el subtotal cuando carga el DOM
function loadSubtotalAndCurrency() {
    for(let i = 0; i < currentArticlesArray.length; i++) {
        subtotalArray[i] = currentArticlesArray[i].unitCost;
        currencyArray[i] = currentArticlesArray[i].currency;
    }
}

/* DOM CONTENT LOADED */

document.addEventListener("DOMContentLoaded", () => {

    let urlToBD = 'https://636cd806ab4814f2b26fdde3.mockapi.io/cartArticles/';
    fetch(urlToBD)
        .then(respuesta => respuesta.json())
        .then(datos => {
            currentArticlesArray = datos;
            loadSubtotalAndCurrency();
            showArticles();
            updateCostHTML();

        }) //fetch

});


/* VALIDACIÓN */
let esModalValido = false;

let formModal = document.forms['form-modal'];
formModal.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();
    let formularioValido = true;
    /* Checkea que inputs del modal no estén vacios */
    let cardNumValidity = document.getElementById('cardNum').validity;
    let cardCodeValidity = document.getElementById('cardCode').validity;
    let cardExpireValidity = document.getElementById('cardExpire').validity;
    let acountNumValidity = document.getElementById('acountNum').validity;

    let paymentFeedback = document.getElementById('validationPaymentMetodModal');
    if (paymentMetodSelected == '') {
        e.preventDefault();
        e.stopPropagation();
        paymentFeedback.classList.add('show');
        paymentFeedback.classList.remove('hide');
        formularioValido = false;
    } else {
        paymentFeedback.classList.add('hide');
        paymentFeedback.classList.remove('show');
    }

    if (paymentMetodSelected == 'credito') {
        if (cardNumValidity.valueMissing) {
            e.preventDefault();
            e.stopPropagation();
            formularioValido = false;
        }
        if (cardCodeValidity.valueMissing) {
            e.preventDefault();
            e.stopPropagation();
            formularioValido = false;
        }
        if (cardExpireValidity.valueMissing) {
            e.preventDefault();
            e.stopPropagation();
            formularioValido = false;
        }

        document.getElementById('acountNum').required = false;
    }

    if (paymentMetodSelected == 'transf') {
        if (acountNumValidity.valueMissing) {
            e.preventDefault();
            e.stopPropagation();
            acountNumValidity = false;
        }

        document.getElementById('cardNum').required = false;
        document.getElementById('cardCode').required = false;
        document.getElementById('cardExpire').required = false;
    }


    formModal.classList.add('was-validated');

    if (formularioValido) {
        esModalValido = true;
        $('#paymentModal').modal('hide');
    }

});

let formCompra = document.forms['form-compra'];

formCompra.addEventListener('submit', function (e) {

    let formularioValido = true;

    let validityStateStreet = formCompra.userStreet.validity;
    let validityStateStreetNum = formCompra.userStreetNum.validity;
    let validityStateStreetEsq = formCompra.userStreetEsq.validity;

    /* Calle */
    if (validityStateStreet.valueMissing) {
        e.preventDefault();
        e.stopPropagation();
        formularioValido = false;
    }

    /* Numero */
    if (validityStateStreetNum.valueMissing) {
        e.preventDefault();
        e.stopPropagation();
        formularioValido = false;
    }

    /* Esquina */
    if (validityStateStreetEsq.valueMissing) {
        e.preventDefault();
        e.stopPropagation();
        formularioValido = false;
    }

    /* Tipo de envío */
    if (deliveryTypeMetod == 0) {
        e.preventDefault();
        e.stopPropagation();
        formularioValido = false;
    }


    /* Método de pago */
    let paymentFeedback = document.getElementById('validationPaymentMetod');
    if (paymentMetodSelected == '') {
        e.preventDefault();
        e.stopPropagation();
        paymentFeedback.classList.add('show');
        paymentFeedback.classList.remove('hide');
        formularioValido = false;
    } else {
        paymentFeedback.classList.add('hide');
        paymentFeedback.classList.remove('show');
    }


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

    formCompra.classList.add('was-validated');
    if (formularioValido && esModalValido) {
        alert('¡Has comprado con éxito!', 'success');
        e.stopPropagation();
        e.preventDefault();
    }
});

/* MODAL */

let creditoInput = document.getElementById('credito');
let transfInput = document.getElementById('transf');

let cardNum = document.getElementById('cardNum');
let cardCode = document.getElementById('cardCode');
let cardExpire = document.getElementById('cardExpire');
let acountNum = document.getElementById('acountNum');

let paymentText = document.getElementById('payment-metod-text');
let paymentFeedback = document.getElementById('validationPaymentMetod');

creditoInput.addEventListener('click', function (e) {
    acountNum.disabled = true;
    cardNum.disabled = false;
    cardCode.disabled = false;
    cardExpire.disabled = false;
    paymentText.innerHTML = 'Tarjeta de crédito';
    paymentMetodSelected = 'credito';
    paymentFeedback.classList.add('hide');
});

transfInput.addEventListener('click', function (e) {
    acountNum.disabled = false;
    cardNum.disabled = true;
    cardCode.disabled = true;
    cardExpire.disabled = true;
    paymentText.innerHTML = 'Transferencia bancaria';
    paymentMetodSelected = 'transf';
    paymentFeedback.classList.add('hide');
});