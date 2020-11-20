const d = new Date()
let selected_day = d.getDOY()
let tasks_list = []

init_tasks = async () => {
    firestore_repo = new FirestoreRepo(firebase.firestore(), firebase.auth().currentUser)
    dom_manipulation = new DomManipulation()

    document.getElementById('signout').onclick = () => {
        firebase.auth().signOut()
    }

    document.getElementById('plus').onclick = () => {
        setDay(selected_day+1)
    }

    document.getElementById('minus').onclick = () => {
        setDay(selected_day-1)
    }

    console.time("task template")
    template = await get_template()
    console.timeEnd("task template")

    firestore_repo.fetch_tasks(selected_day).then((tasks) => {
        tasks_list = tasks
        show_tasks(tasks_list)
    })

    document.getElementById('addTask').onclick = () => {
        add_task()
    }

}

const setError = (err) => {
    document.getElementById('err').innerText = err
    promise = new Promise(function (resolve) {
        setTimeout(function() {
            resolve('')
        }, 3000)
    })
    promise.then(function() {
        document.getElementById('err').innerText = ""
    })
}

const get_template = () => {
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

const setDay = (day) => {
    if (day > 0 && day <= d.getDOY() + 6) {
        selected_day = day
        update_title(selected_day)
        firestore_repo.fetch_tasks(selected_day).then((tasks) => {
            tasks_list = tasks
            show_tasks(tasks_list)
        })
    }
}

const add_task = () => {
    txt = document.getElementById('task').value
    task = new Task(txt, selected_day)
    try {
        task.validate()
    } catch (err) {
        setError(err)
        return
    }

    firestore_repo.add_tasks_to_db(task).then((docRef) => {
        tasks_list.push({
            'data': task,
            'id': docRef.id
        })
        show_tasks(tasks_list)
    })
}


const show_tasks = (tasks) => {
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

    tasks_div = document.getElementById('taskuri')
    document.getElementById('taskuri').innerHTML = ""
    tasks.forEach(task => {
        html = template.replaceAll("{ID}", task.id)

        for (const [key, value] of Object.entries(values[task.data['completed']])) {
            html = html.replaceAll(key, value)
        }

        html = html.replaceAll("{TEXT}", task.data['text'])
            
        tasks_div.innerHTML += html
    });
        
    docs = document.getElementsByClassName("del")
    Array.from(docs).forEach(element => {
        element.onclick = function() {
            (selected_day == d.getDOY())?remove_task(element.id):setError('Nu poti face asta pentru zile trecute')
        }
    });

    docs = document.getElementsByClassName("completed")
    Array.from(docs).forEach(element => {
        element.onclick = function() {
            (selected_day == d.getDOY())?change_task_status(element):setError('Nu poti face asta pentru zile trecute')
        }
    });

    document.getElementById('table').style.display = "block"
}

const remove_task = (id) => {
    firestore_repo.delete_task(id).then(() => {
        document.getElementById('div' + id).remove()
    })
}


const change_task_status = (element) => {
    gata = (element.className.includes("btn-success"))?true:false
    firestore_repo.change_task_status_in_db(element.id).then(function() {
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

const update_title = (zi) => {
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


class FirestoreRepo {
    constructor(db_ref, user) {
        this.db = db_ref
        this.user = user
    }

    fetch_tasks = (day) => {
        let response = []

        return this.db.collection(this.user.uid)
            .where("day", "==", day)
            .get()
            .then(function(querySnapshots) {
                querySnapshots.forEach(function(doc) {
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

    add_tasks_to_db = (task, day) => {
        return this.db.collection(this.user.uid).add(task.str)
            .then(function (docRef) {
                return docRef
            })
            .catch(function(error) {
                console.log(error)
            })
    }

    change_task_status_in_db = (doc_id) => {
        return this.db.collection(this.user.uid).doc(doc_id).update({
            'completed': !this.completed
        }).then(() => {
            this.completed = !this.completed
            return true
        })
    }

    delete_task = (id) => {
        return this.db.collection(this.user.uid).doc(id).delete()
            .then(() => {
                return true
            })
    }
}

class DomManipulation {
    constructor() {}    
}


class Task {
    constructor(text, day, completed = false) {
        if (arguments.length == 1) {
            this.text = arguments[0]['text']
            this.day = arguments[0]['day']
            this.completed = arguments[0]['completed']
        } else {
            this.text = text
            this.day = day
            this.completed = completed
        }
    }

    validate = () => {
        if (!(this.text.length > 0 && 0 <= this.day && this.day <= d.getDOY() + 6))
            throw 'Task invalid'
    }

    get str() {
        return {
            'text': this.text,
            'day': this.day,
            'completed': this.completed
        }
    }
}