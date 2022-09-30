const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";

//Agrega constantes
const PRODUCT_URL = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem("catID")}.json`;
const PRODUCT_INFO_URL = `https://japceibal.github.io/emercado-api/products/${localStorage.getItem("prodID")}.json`;
const PRODUCT_INFO_COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${localStorage.getItem("prodID")}.json`;

const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function logout(){
  localStorage.removeItem("emailUsuario");
  window.location = "login.html"
}

document.addEventListener("DOMContentLoaded", function(){
  let email = localStorage.getItem('emailUsuario');
  let htmlContentToAppend = `
  <div class="dropdown nav-link">
    <button class="dropbtn">${email}
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a href="sell.html">Mi carrito</a>
      <a href="my-profile.html">Mi perfil</a>
      <a href="#" onclick="logout()">Cerrar sesión</a>
    </div>
  </div> 
</div>
  `;
  document.getElementById("usuarioMail").innerHTML = htmlContentToAppend;
});
