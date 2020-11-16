function init_auth() {
    document.getElementById("register").onclick = reg
    document.getElementById("login").onclick = login
    document.getElementById("forgotPassword").onclick = function() {
      setError("nu avem inca")
    }
}

function init_tasks() {
    d = new Date()
    db = firebase.firestore()
    user = firebase.auth().currentUser

    document.getElementById('text').innerHTML += user.email
    document.getElementById('signout').onclick = function() {
        firebase.auth().signOut()
    }

    get_template()

    document.getElementById('buton').onclick = add_task

}