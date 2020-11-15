window.onload = function() {
  console.log("starting app")
  load("/login.html", start)
}

function start() {
  document.getElementById("register").onclick = reg
  document.getElementById("login").onclick = login

  user = firebase.auth().currentUser
  if (user) {
    console.log('e ;logat')
    loadPage('/test.html', numeste)
  }
}

function reg() {
  mail = document.getElementById("mail").value
  pass = document.getElementById("pass").value

  firebase.auth().createUserWithEmailAndPassword(mail, pass)
    .then(function () {
      load("/test.html", numeste)
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      setError(errorMessage)
    })

}

function login() {
  mail = document.getElementById("mail").value
  pass = document.getElementById("pass").value

  firebase.auth().signInWithEmailAndPassword(mail, pass)
    .then(function () {
      load("/test.html", numeste)
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      setError(errorMessage)
    })
}


function load(name, then_function) {
  my_div = document.getElementById("app")
  next_url = name
  xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      my_div.innerHTML = this.responseText
      then_function() 
    }
  }

  xhttp.open('GET', next_url, true)
  xhttp.send()
}

function setError(err) {
  document.getElementById('err').innerHTML = "ceva nu i bine frate"
}

function numeste() {
  document.getElementById('text').innerHTML += firebase.auth().currentUser.email
}