'use strict'
// @ts-check

/**
 * @fileoverview Punto de entrada del proceso renderizado de Electron
 *
 * Gestiona la lógica de la interfaz de usuario.
 */

import Task from './Task.js'
import TaskForm from './TaskForm.js'
import TaskListView from './TaskListView.js'

// EVENTOS DE IPC

// Escuchar el evento de cambio de tema
window.bridge.onUpdateTheme((event, theme) => {
  document.documentElement.setAttribute('data-bs-theme', theme)
})

// CARGA INICIAL DE TAREAS

const taskListView = new TaskListView()

// cargar la lista de tareas guardadas
taskListView.loadList().then(() => {
  addTaskOptions.addEventListener('click', (e) => {
    const newTask = new Task({ title: taskTitleInput.value })
    const taskForm = new TaskForm({
      task: newTask,
      idNew: true,
      onSubmit: (task) => {
        taskListView.addTask(task)
        taskListView.saveList()
      },
      modalElement: modalRootElement
    })

    taskForm.show()
    taskTitleInput.value = ''
  })
})

// FORMULARIO DE CREACIÓN DE TAREAS

const taskTitleInput = document.getElementById('create-task-input')
const newTaskForm = document.getElementById('create-task-form')
const addTaskOptions = document.getElementById('add-task-options')

// Capturar el evento submit del formulario
// validar el input y añadir la tarea a la lista
// previene el envío del formulario y la recarga de la página
newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (!taskTitleInput.checkValidity()) {
    newTaskForm.classList.add('was-validated')
    taskTitleInput.parentElement.classList.add('is-invalid')
    return
  }
  newTaskForm.classList.remove('was-validated')
  taskTitleInput.parentElement.classList.remove('is-invalid')

  const taskTitle = taskTitleInput.value.trim()
  taskListView.addTask(new Task({ title: taskTitle }))

  // usabilidad: limpiar el input y poner el foco en él para seguir añadiendo tareas
  taskTitleInput.value = ''
  taskTitleInput.focus()

  taskListView.saveList()
}, false)

// FILTROS

const filterSearchForm = document.getElementById('filter-tasks-form')
const filterSearchInput = document.getElementById('filter-search')
const filterHideCompletedInput = document.getElementById('filter-hide-completed')
const filterResetButton = document.getElementById('filter-reset-button')
const filterSortByStatusInput = document.getElementById('filter-sort-status')
const filterSortByPriority = document.getElementById('filter-sort-priority')
const filterSortByTitle = document.getElementById('filter-sort-title')

// evento del botón de restablecer filtros
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

// prevenir el envío del formulario de búsqueda
// de no hacerlo, recargaría la página
filterSearchForm.addEventListener('submit', (e) => {
  e.preventDefault()

  filterSearchInput.parentElement.classList.remove('is-invalid')
  if (!filterSearchInput.checkValidity()) {
    filterSearchInput.parentElement.classList.add('is-invalid')
  }
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

// EVENTOS DE USABILIDAD

// al cambiar el foco, limpiar el input si el contenido no es inválido
taskTitleInput.addEventListener('blur', () => {
  if (!taskTitleInput.checkValidity()) {
    taskTitleInput.value = ''
  }
})

filterSearchInput.addEventListener('blur', () => {
  if (!filterSearchInput.checkValidity()) {
    filterSearchInput.value = ''
  }
})

// BARRA LATERAL

const sidebar = document.getElementById('side-nav')
const btnOpenSidebar = document.getElementById('btn-open-sidebar')
const btnCloseSidebar = document.getElementById('btn-close-sidebar')
const modalRootElement = document.getElementById('modal')

// abrir la barra lateral
btnOpenSidebar.addEventListener('click', () => {
  sidebar.classList.add('active')
})

// cerrar la barra lateral
btnCloseSidebar.addEventListener('click', () => {
  sidebar.classList.remove('active')
})

// ATAJOS DE TECLADO

window.addEventListener('keydown', (e) => {
  // Ctrl + F pone el foco en el input de búsqueda
  if (e.ctrlKey && e.key === 'f') {
    filterSearchInput.focus()
  }

  // Ctrl + N pone el foco en el input de título de tarea
  if (e.ctrlKey && e.key === 'n') {
    taskTitleInput.focus()
  }

  // Esc quita el foco de los inputs
  if (e.key === 'Escape') {
    document.activeElement.blur()
  }
})
