function init_auth() {
    document.getElementById("register").onclick = reg
    document.getElementById("login").onclick = login
    document.getElementById("forgotPassword").onclick = function() {
      setError("nu avem inca")
    }
}

function init_tasks() {
    d = new Date()
    zi = d.getDOY()
    db = firebase.firestore()
    user = firebase.auth().currentUser

    document.getElementById('signout').onclick = function() {
        firebase.auth().signOut()
    }

    document.getElementById('plus').onclick = function() {
        setDay(zi+1)
    }

    document.getElementById('minus').onclick = function() {
        setDay(zi-1)
    }

    template = ""
    get_template().then(function(result) {
        template = result
        display_tasks()
    });

    document.getElementById('addTask').onclick = function() {
        if (zi == d.getDOY() || zi == d.getDOY()+6) add_task(zi)
        else {
            document.getElementById('err').innerText = "Poti adauga task-uri doar pentru azi sau zilele viitoare"
            promise = new Promise(function (resolve) {
                setTimeout(function() {
                    resolve('')
                }, 3000)
            })
            promise.then(function() {
                document.getElementById('err').innerText = ""
            })
        }
    }
}


function setDay(day) {
    if (day > 0 && day <= d.getDOY() + 6) {
        zi = day
        update_title(zi)
        display_tasks()
    }
}


function display_tasks() {
    tasks_g = []
    get_tasks(zi).then(function(tasks) {
        tasks_g = tasks
        show_tasks(tasks)
    })
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