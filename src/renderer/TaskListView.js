import TaskList from './TaskList.js'
import TaskView from './TaskView.js'
import TaskForm from './TaskForm.js'

class TaskListView {
  #htmlElement

  constructor (taskList) {
    this.taskList = taskList || new TaskList()
    this.taskListContainer = document.querySelector('#task-list')

    this.filteredTaskList = []

    this.filters = {
      search: '',
      hideCompleted: false,
      orderByStatus: false,
      orderByPriority: false,
      orderByTitle: false
    }

    document.getElementById('modal').addEventListener('hidden.bs.modal', () => {
      this.updateFilteredList()
    })
  }

  createElement () {
    if (this.#htmlElement) {
      return this.#htmlElement
    }

    const newTaskList = document.createElement('ul')
    newTaskList.id = 'task-list'

    this.#htmlElement = newTaskList

    return this.#htmlElement
  }

  async saveList () {
    await this.taskList.save().then(() => {
      this.updateFilteredList()
    })
  }

  async loadList () {
    await this.taskList.load().then(() => {
      this.updateFilteredList()
    })
  }

  addTask (task) {
    this.taskList.push(task)
  }

  editTask (taskToEdit) {
    const taskForm = new TaskForm(taskToEdit, this)
    taskForm.show()
  }

  async removeTask (taskToRemove) {
    const confirmDelete = await window.bridge.confirmDeleteTask(taskToRemove)

    if (confirmDelete.response === 1) {
      this.taskList.splice(this.taskList.indexOf(taskToRemove), 1)
      this.saveList()
    }
  }

  renderTaskList () {
    this.taskListContainer.innerHTML = ''
    let taskListContents
    if (this.taskList.length === 0 || this.filteredTaskList.length === 0) {
      taskListContents = document.createElement('p')
      taskListContents.classList.add('text-muted')
      if (this.taskList.length === 0) {
        taskListContents.textContent = 'No hay tareas'
      } else {
        taskListContents.textContent = 'No hay tareas que coincidan con la búsqueda'
      }
    } else {
      taskListContents = document.createElement('ul')
      taskListContents.classList.add('d-flex', 'flex-column', 'gap-2')
      this.filteredTaskList.forEach((task) => {
        const taskView = new TaskView(task, this)
        taskListContents.appendChild(taskView.createElement())
      })
    }
    this.taskListContainer.appendChild(taskListContents)
  }

  updateFilteredList () {
    this.filteredTaskList = [...this.taskList]

    // hide completed
    if (this.filters.hideCompleted) {
      this.filteredTaskList = []
      this.taskList.forEach((task) => {
        if (task.done) {
          return
        }
        this.filteredTaskList.push(task)
      })
    }

    // search
    this.filteredTaskList = this.filteredTaskList.filter((task) =>
      task.title.toLowerCase().includes(this.filters.search.toLowerCase())
    )

    // order by title
    if (this.filters.orderByTitle) {
      this.filteredTaskList = this.filteredTaskList.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
    }

    // order by priority
    if (this.filters.orderByPriority) {
      this.filteredTaskList = this.filteredTaskList.sort((a, b) => b.priority - a.priority)
    }

    // order by status
    if (this.filters.orderByStatus) {
      this.filteredTaskList = this.filteredTaskList.sort((a, b) => a.done - b.done)
    }

    this.renderTaskList()
  }
}

export default TaskListView
