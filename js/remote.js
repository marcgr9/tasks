function add_task() {
    txt = document.getElementById('task').value
    if (txt) {
        db.collection(user.uid).add({
            'text': txt,
            'completed': false,
            'zi': d.getDOY()
        })
        .then(function () {
            document.getElementById('task').value = ""
            get_template()
        })
        .catch(function(error) {
            console.log(error)
        })
    }
}


function show_tasks(template) {
    document.getElementById('taskuri').innerHTML = ""
    db.collection(user.uid)
    .get()
    .then(function(querySnapshot) {
        tasks_div = document.getElementById("taskuri")
        querySnapshot.forEach(function(doc) {
            copy = template
            markup = template.replaceAll("{ID}", doc.id)
            col = "warning"
            done = "Nu e gata"
            if (doc.data()['completed'] == true) {
                col = "success"
                done = "Gata"
            }
            markup = markup.replace("{COLOR}", col)
            markup = markup.replace("{DONE}", done)
            markup = markup.replaceAll("{TEXT}", doc.data()['text'])
            
            tasks_div.innerHTML += markup
        });
        

        docs = document.getElementsByClassName("del")
        Array.from(docs).forEach(element => {
            element.onclick = function() {
                db.collection(user.uid).doc(element.id).delete()
                document.getElementById('div' + element.id).remove()
            }
        });

        docs = document.getElementsByClassName("completed")
        Array.from(docs).forEach(element => {
            element.onclick = function() {
                done = (element.innerHTML == "Gata")?false:true
                db.collection(user.uid).doc(element.id).update({
                    'completed': done
                }).then(get_template)
            }
        });

    })
    .catch(function(error) {
        console.log("eroare ", error)
    })
}


function get_template() {
    xhttp = new XMLHttpRequest()
  
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        show_tasks(String(this.responseText))
      }
    }
  
    xhttp.open('GET', "/views/task.html", true)
    xhttp.send()
}