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
        if (zi <= d.getDOY()) {
            zi++
            update_title(zi)
            get_template()
        }
    }

    document.getElementById('minus').onclick = function() {
        if (zi > 0) {
            zi--;
            update_title(zi)
            get_template()
        }
    }

    get_template()
    document.getElementById('addTask').onclick = add_task

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