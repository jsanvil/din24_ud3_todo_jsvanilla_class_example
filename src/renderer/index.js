import Task from './Task.js'
import TaskForm from './TaskForm.js'
import TaskListView from './TaskListView.js'

const taskListView = new TaskListView()

// cargar la lista de tareas guardadas
taskListView.loadList().then(() => {
  addTaskOptions.addEventListener('click', (e) => {
    const newTask = new Task({ title: taskTitleInput.value })
    const taskForm = new TaskForm(newTask, taskListView)
    taskForm.show()
    taskTitleInput.value = ''
  })
})

// ELEMENTOS DEL DOM

const taskTitleInput = document.getElementById('create-task-input')
const newTaskForm = document.getElementById('create-task-form')
const addTaskOptions = document.getElementById('add-task-options')
const filterSearchInput = document.getElementById('filter-search')
const filterHideCompletedInput = document.getElementById('filter-hide-completed')
const filterResetButton = document.getElementById('filter-reset-button')
const filterSortByStatusInput = document.getElementById('filter-sort-status')
const filterSortByPriority = document.getElementById('filter-sort-priority')
const filterSortByTitle = document.getElementById('filter-sort-title')

// EVENTOS

// capturar el evento submit del formulario
newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault()
  e.stopPropagation()

  if (!newTaskForm.checkValidity()) {
    return
  }

  const taskTitle = taskTitleInput.value
  taskListView.addTask(new Task({ title: taskTitle }))

  // usabilidad: limpiar el input y poner el foco en él para seguir añadiendo tareas
  taskTitleInput.value = ''
  taskTitleInput.focus()

  taskListView.saveList()
}, false)

filterResetButton.addEventListener('click', () => {
  taskListView.filters = {
    search: '',
    hideCompleted: false,
    orderByTitle: false,
    orderByStatus: false
  }
  taskListView.updateFilteredList()
})

// evento del filtro de búsqueda
filterSearchInput.addEventListener('input', (e) => {
  const searchText = e.target.value
  taskListView.filters.search = searchText.trim()
  taskListView.updateFilteredList()
})

// evento del filtro de tareas completadas
filterHideCompletedInput.addEventListener('change', (e) => {
  taskListView.filters.hideCompleted = e.target.checked
  taskListView.updateFilteredList()
})

// evento del filtro de ordenar por estado
filterSortByStatusInput.addEventListener('change', (e) => {
  taskListView.filters.orderByStatus = !!e.target.checked
  taskListView.updateFilteredList()
})

// evento del filtro de ordenar por prioridad
filterSortByPriority.addEventListener('change', (e) => {
  taskListView.filters.orderByPriority = !!e.target.checked
  taskListView.updateFilteredList()
})

// evento del filtro de ordenar por título
filterSortByTitle.addEventListener('change', (e) => {
  taskListView.filters.orderByTitle = !!e.target.checked
  taskListView.updateFilteredList()
})

// EVENTOS DE IPC

window.bridge.onUpdateTheme((event, theme) => {
  document.documentElement.setAttribute('data-bs-theme', theme)
})
