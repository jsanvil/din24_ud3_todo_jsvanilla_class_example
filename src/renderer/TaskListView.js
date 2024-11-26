'use strict'
// @ts-check

import TaskList from './TaskList.js'
import TaskView from './TaskView.js'
import TaskForm from './TaskForm.js'

/**
 * Vista de la lista de tareas
 */
class TaskListView {
  /**
   * Crea una instancia de TaskListView
   * @param {TaskList} taskList - Lista de tareas
   */
  constructor (taskList) {
    /**
     * Almacena la lista de tareas
     * @type {TaskList}
     */
    this.taskList = taskList || new TaskList()

    /**
     * Lista de tareas filtrada
     * @type {TaskList}
    */
    this.filteredTaskList = new TaskList()

    /**
     * Filtros de la lista de tareas
     * @type {Object}
     * @property {String} search - Título de la tarea a buscar
     * @property {Boolean} hideCompleted - Ocultar tareas completadas
     * @property {Boolean} orderByStatus - Ordenar por estado
     * @property {Boolean} orderByPriority - Ordenar por prioridad
     * @property {Boolean} orderByTitle - Ordenar por título
     */
    this.filters = {
      search: '',
      hideCompleted: false,
      orderByStatus: false,
      orderByPriority: false,
      orderByTitle: false
    }

    /**
     * Contenedor de la lista de tareas
     * @type {HTMLElement}
     */
    this.taskListContainer = document.querySelector('#task-list')

    // Evento de bootstrap.Modal
    // al cerrar el modal se actualiza la lista de tareas
    document.getElementById('modal').addEventListener('hidden.bs.modal', () => {
      this.updateFilteredList()
    })
  }

  /**
   * Guarda la lista de tareas
   * @returns {Promise<void>}
   */
  async saveList () {
    await this.taskList.save().then(() => {
      this.updateFilteredList()
    })
  }

  /**
   * Carga la lista de tareas
   * @returns {Promise<void>}
   */
  async loadList () {
    await this.taskList.load().then(() => {
      this.updateFilteredList()
    })
  }

  /**
   * Añade una tarea a la lista
   * @param {Task} task - Tarea a añadir
   */
  addTask (task) {
    this.taskList.push(task)
  }

  /**
   * Edita una tarea
   * @param {Task} taskToEdit - Tarea a editar
   */
  editTask (taskToEdit) {
    const taskForm = new TaskForm({
      task: taskToEdit,
      isNew: false,
      onSubmit: () => this.saveList()
    })
    taskForm.show()
  }

  /**
   * Elimina una tarea
   * @param {Task} taskToRemove - Tarea a eliminar
   * @returns {Promise<void>}
   */
  async removeTask (taskToRemove) {
    const confirmDelete = await window.bridge.confirmDeleteTask(taskToRemove)

    if (confirmDelete.response === 1) {
      this.taskList.splice(this.taskList.indexOf(taskToRemove), 1)
      this.saveList()
    }
  }

  /**
   * Renderiza la lista de tareas
   */
  renderTaskList () {
    this.taskListContainer.innerHTML = ''
    let taskListContents

    // si no hay tareas o no hay tareas que coincidan con los filtros
    if (this.taskList.length === 0 || this.filteredTaskList.length === 0) {
      this.taskListContainer.innerHTML = `
      <div class="fs-4 d-flex flex-column justify-content-center align-items-center">
      </div>
      `
      if (this.taskList.length === 0) {
        this.taskListContainer.firstElementChild.innerHTML = '<p class="align-self-end">👉</p><p class="fw-light fst-italic">Lista de tareas vacía</p>'
      } else {
        this.taskListContainer.firstElementChild.innerHTML = '<p class="fw-light fst-italic">No hay tareas que coincidan con los filtros</p>'
      }
    // si hay tareas que coinciden con los filtros
    } else {
      taskListContents = document.createElement('ul')
      taskListContents.classList.add('d-flex', 'flex-column', 'gap-2')

      this.filteredTaskList.forEach((task) => {
        const taskView = new TaskView(task, this)
        taskListContents.appendChild(taskView.createElement())
      })

      this.taskListContainer.appendChild(taskListContents)
    }
  }

  /**
   * Actualiza la lista de tareas filtrada
   */
  updateFilteredList () {
    // filteredTaskList será la nueva lista de tareas filtrada
    // utiliza Object.assign para crear una copia de la lista de tareas
    this.filteredTaskList = Object.assign(new TaskList(), this.taskList)

    // hide completed
    if (this.filters.hideCompleted) {
      this.filteredTaskList = this.filteredTaskList.filterByStatus(true)
    }

    // search by title
    if (this.filters.search && this.filters.search.trim().length > 0) {
      this.filteredTaskList = this.filteredTaskList.filterByTitle(this.filters.search)
    }

    // order by title
    if (this.filters.orderByTitle) {
      this.filteredTaskList = this.filteredTaskList.sortByTitle()
    }

    // order by priority
    if (this.filters.orderByPriority) {
      this.filteredTaskList = this.filteredTaskList.sortByPriority()
    }

    // order by status
    if (this.filters.orderByStatus) {
      this.filteredTaskList = this.filteredTaskList.sortByStatus()
    }

    this.renderTaskList()
  }
}

export default TaskListView
