pages = {}

window.onload = function() {
  console.log("starting app")

  pages = {
    'auth': ["/views/auth.html", init_auth],
    'home': ["/views/test.html", init_tasks]
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      load('home')
    } else load('auth')
  })
}

function start() {
  document.getElementById("register").onclick = reg
  document.getElementById("login").onclick = login
  document.getElementById("forgotPassword").onclick = function() {
    setError("nu avem inca")
  }
}

function reg() {
  mail = document.getElementById("mail").value
  pass = document.getElementById("pass").value

  firebase.auth().createUserWithEmailAndPassword(mail, pass)
    .then(function () {
      load('home')
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      setError()
    })

}

function login() {
  mail = document.getElementById("mail").value
  pass = document.getElementById("pass").value

  firebase.auth().signInWithEmailAndPassword(mail, pass)
    .then(function () {
      load('home')
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      setError()
    })
}


function load(name) {
  app = document.getElementById("app")
  xhttp = new XMLHttpRequest()

  next_url = pages[name][0]
  then_function = pages[name][1]
  console.log(next_url)

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      app.innerHTML = this.responseText
      then_function()
    }
  }

  xhttp.open('GET', next_url, true)
  xhttp.send()
}

function setError(err) {
  if (!err) err = "cv nu i bine frate"
  document.getElementById('err').innerHTML = err
}

Date.prototype.isLeapYear = function() {
  var year = this.getFullYear();
  if((year & 3) != 0) return false;
  return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.getDOY = function() {
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = this.getMonth();
  var dn = this.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if(mn > 1 && this.isLeapYear()) dayOfYear++;
  return dayOfYear;
};

Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}