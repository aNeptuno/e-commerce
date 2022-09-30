
let formLogin = document.getElementById('formLogin');

formLogin.addEventListener('submit', function(evento) {
    evento.preventDefault();
    let email = document.getElementById('floatingInput').value;
    localStorage.setItem('emailUsuario', email);
    window.location.href = 'index.html';
});

/* login google */
  function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    console.log('Email: ' + googleUser.getBasicProfile().getEmail());
  }
  function onFailure(error) {
    console.log(error);
    console.log('Email: ' + googleUser.getBasicProfile().getEmail());
  }
  function renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'light',
      'onsuccess': onSuccess,
      'onfailure': onFailure
    });
  }

