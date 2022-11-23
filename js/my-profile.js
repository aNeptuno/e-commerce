/* REGISTRO */
let profileReg;

// {
//     nombre: String,
//     nombre2: String,
//     apellido: String,
//     apellido2: String,
//     phone: Number,
//     imagen: Base64,
//     email: String    //el email funciona como id porque es único por usuario
// }

/* In computer programming, Base64 is a group of binary-to-text encoding schemes that represent 
binary data (more specifically, a sequence of 8-bit bytes) 
in sequences of 24 bits that can be represented by four 6-bit Base64 digits. */


/* Imagen */

let userImg = document.getElementById("userImg");
let imgPreview = document.getElementById("img-preview");

userImg.addEventListener("change", function () {
    getImgData();
});
  
/* The getImgSrc() function uses the FileReader API to insert the 
image into the page using it’s base64 encoded data: */

function displayImg(img64){
    imgPreview.innerHTML = '<img src="' + img64 + '" class="profile-img"/>';
}

function getImgData() {
  let files = userImg.files[0];
  if (files) {
    /* Constructor de la API https://developer.mozilla.org/en-US/docs/Web/API/File_API */
    const fileReader = new FileReader();
    /* The readAsDataURL method is used to read the contents of the specified Blob or File. 
    When the read operation is finished, the readyState becomes DONE, and the loadend is triggered. 
    At that time, the result attribute contains the data as a data: URL representing the file's data as a base64 encoded string. */
    fileReader.readAsDataURL(files);
    /* The load event is fired when a file has been read successfully. */
    fileReader.addEventListener("load", function () {
      localStorage.setItem('img64',this.result);
      displayImg(this.result);
    });    
  }
}

/* Si no hay imagen en local storage, carga imagen default */
function displayDefaultImg(){
    let imgContainer = document.getElementById('img-default');
    imgContainer.classList.add('show');
    imgContainer.classList.remove('hide');
}



/* Función que toma los inputs del form y los guarda en el registro ProfileReg */
function getInputs() {
    let nombreInput = document.getElementById('userName').value;
    let nombre2Input = document.getElementById('userName2').value;
    let apellidoInput = document.getElementById('userSurname').value;
    let apellido2Input = document.getElementById('userSurname2').value;;
    let phoneInput = document.getElementById('userPhone').value;

    /* Modificar el email */
    let emailInput = document.getElementById('userEmail').value;
    localStorage.setItem('emailUsuario',emailInput);


    let profileImg = localStorage.getItem('img64');
  
    ProfileReg = {
        "nombre": nombreInput,
        "nombre2": nombre2Input,
        "apellido": apellidoInput,
        "apellido2": apellido2Input,
        "phone": phoneInput,
        "img": profileImg,
        "email": emailInput,
    }

    localStorage.removeItem('img64');
    localStorage.removeItem('ProfileReg');
    localStorage.setItem('ProfileReg', JSON.stringify(ProfileReg));
}

/* Función que muestra en el HTML los valores guardados en el Registro */
function displayProfileReg(){
    document.getElementById('userName').value = ProfileReg.nombre;
    document.getElementById('userName2').value = ProfileReg.nombre2;
    document.getElementById('userSurname').value = ProfileReg.apellido;
    document.getElementById('userSurname2').value = ProfileReg.apellido2;
    document.getElementById('userPhone').value = ProfileReg.phone;
    document.getElementById('userEmail').value = ProfileReg.email;

    /* CARGAR IMG */
    let img64Data = ProfileReg.img;
    if(img64Data){
        displayImg(img64Data);
    } else {
        displayDefaultImg();
    }
}


/* VALIDACIÓN */

let formPerfil = document.forms['form-profile'];

formPerfil.addEventListener('submit', function (e) {

    let validityUserName = formPerfil.userName.validity;
    let validityUserSurname = formPerfil.userSurname.validity;
    let validityUserPhone = formPerfil.userPhone.validity;

    let isFormValid = true;

    /* Nombre */
    if (validityUserName.valueMissing) {
        e.preventDefault();
        e.stopPropagation();
        isFormValid = false;
    }

    /* Apellido */
    if (validityUserSurname.valueMissing) {
        e.preventDefault();
        e.stopPropagation();
        isFormValid = false;
    }

    /* Número */
    if (validityUserPhone.valueMissing) {
        e.preventDefault();
        e.stopPropagation();
        isFormValid = false;
    }

    /* if (!formPerfil.checkValidity()) {
        e.preventDefault()
        e.stopPropagation()
    } */

    formPerfil.classList.add('was-validated')
    if (isFormValid) {
        getInputs();
    } 
});


/* DOM LOADED */

document.addEventListener('DOMContentLoaded', e=>{
    /* Borra del localsorage img64 porque solo se utiliza para actualizar la vista */
    localStorage.removeItem('img64');
    
    /* CARGAR REGISTRO */
    if (localStorage.getItem('ProfileReg') != null) {
        ProfileReg = JSON.parse(localStorage.getItem('ProfileReg'));
        displayProfileReg();
    } else {
        ProfileReg = {};
        displayDefaultImg()
    }  

    /* CARGAR EMAIL */
    let emailUser = localStorage.getItem('emailUsuario');
    document.getElementById('userEmail').value = emailUser;


});

