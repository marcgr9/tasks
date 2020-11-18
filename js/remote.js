function add_task() {
    txt = document.getElementById('task').value
    if (txt) {
        db.collection(user.uid).add({
            'text': txt,
            'completed': false,
            'zi': d.getDOY()
        })
        .then(function (docRef) {
            document.getElementById('task').value = ""
            tasks_g.push({
                'data': {
                    'text': txt,
                    'completed': false,
                    'zi': d.getDOY()
                },
                'id': docRef.id
            })
            show_tasks(tasks_g)
        })
        .catch(function(error) {
            console.log(error)
        })
    }
}

function show_tasks(tasks) {
    values = {
        true: {
            '{COMPLETED}': 'Gata',
            '{COLOR}': 'success'
        },
        false: {
            '{COMPLETED}': 'Nu e gata',
            '{COLOR}': 'warning'
        },
    }

    document.getElementById('taskuri').innerHTML = ""
    tasks.forEach(task => {
        html = template.replaceAll("{ID}", task.id)

        for (const [key, value] of Object.entries(values[task.data['completed']])) {
            html = html.replaceAll(key, value)
        }

        html = html.replaceAll("{TEXT}", task.data['text'])
            
        tasks_div.innerHTML += html
    });
        
    if (zi == d.getDOY()) {
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
                change_task_status(element)
            }
        });
    }

    document.getElementById('table').style.display = "block"
}


function change_task_status(element) {
    gata = (element.className.includes("btn-success"))?true:false
    db.collection(user.uid).doc(element.id).update({
        'completed': !gata
    }).then(function() {
        classes = "completed btn btn-{COLOR}"
        text = '{COMPLETED}'
        for (const [key, value] of Object.entries(values[!gata])) {
            classes = classes.replaceAll(key, value)
            text = text.replaceAll(key, value)
        }
        
        element.className = classes
        element.innerText = text

    })
}


function get_template() {
    return new Promise(function (resolve, reject) {
        xhttp = new XMLHttpRequest()
  
        xhttp.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            resolve(this.responseText)
          }
        }
      
        xhttp.open('GET', href + "/views/task.html", true)
        xhttp.send()
    })
    
}

function update_title(zi) {
    luna = [
        "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decebrie"
    ]
    elem = document.getElementById('titlu')
    txt = "Task-urile pentru "

    if (d.getDOY() == zi-1) txt += "maine"
    else if (d.getDOY() == zi) txt += "azi"
    else if (zi == d.getDOY() - 1) txt += "ieri"
    else {
        var date = new Date(2020, 0)
        day = new Date(date.setDate(zi))
        
        txt += day.getDate() + " " + luna[day.getMonth()] + " "
    }

    elem.innerText = txt
}


function get_tasks(day) {
    response = []

    return db.collection(user.uid)
    .where("zi", "==", day)
    .get()
    .then(function(querySnapshot) {
        tasks_div = document.getElementById("taskuri")
        querySnapshot.forEach(function(doc) {
            response.push({
                'data': doc.data(),
                'id': doc.id
            })
        });
        return response
    })
    .catch(function(err) {
        console.log(err)
    })
}