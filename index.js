const taskListContainer = document.querySelector('#taskList ul')
const taskDescriptionInput = document.getElementById('taskDescription')
const newTaskForm = document.getElementById('newTaskForm')

class Task {
    #htmlElement

    constructor(title, done = false) {
        this.id = crypto.randomUUID()
        this.title  = title
        this.done = done
    }

    createElement() {
        if (this.#htmlElement) {
            return this.#htmlElement
        }

        const newTask = document.createElement('li')
        newTask.innerHTML = `
            <input type="checkbox">
            <span>${this.title}</span>
            <button title="Borrar">🗑</button>`
        
        // añadir eventos
        newTask.querySelector('button').addEventListener('click', e => {
            if (confirm(`¿Borrar ${this.title}?`)) {
                removeTask(this)
            }
        })

        newTask.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            this.done = e.target.checked
            // newTask.querySelector('span').style.textDecoration = this.done ? 'line-through' : 'auto'
            const taskTitle = newTask.querySelector('span')
            this.done ? taskTitle.classList.add('done') : taskTitle.classList.remove('done')
        })

        this.#htmlElement = newTask

        return this.#htmlElement
    }
}

// capturar el evento submit del formulario
newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const taskTitle = taskDescriptionInput.value
    taskList.push(new Task(taskTitle))
    renderTaskList()
})

let taskList = []

taskList.push(new Task('Comprar desayuno'))
taskList.push(new Task('Lavar la ropa'))
taskList.push(new Task('Estudiar'))

renderTaskList()

function renderTaskList() {
    taskListContainer.innerHTML = ''
    taskList.forEach(task => {
        taskListContainer.appendChild(task.createElement())
    })
}

function removeTask(taskToRemove) {
    taskList = taskList.filter(task => task.id !== taskToRemove.id )

    renderTaskList()
}
