'use strict'
// @ts-check

import Task from './Task.js'

/**
 * Componente para crear y editar tareas
 */
class TaskForm {
  isEditing = false

  /**
   * Crea una instancia de TaskForm
   * @param {Task} task - Tarea a crear o editar
   * @param {TaskListView} taskListView - Lista de tareas a la que pertenece
   */
  constructor (props) {
    this.task = props.task || new Task()
    this.isEditing = !props.isNew
    this.onSubmit = props.onSubmit || (() => {})
    this.modalElement = props.modalRootElement || document.getElementById('modal')
  }

  /**
   * Obtiene la instancia de bootstrap.Modal
   * @returns {bootstrap.Modal}
   */
  getModal () {
    if (!this.modal) {
      // eslint-disable-next-line no-undef
      this.modal = new bootstrap.Modal(this.modalElement, {
        focus: true,
        keyboard: false,
        backdrop: 'static'
      })
    }
    return this.modal
  }

  /**
   * Muestra el formulario
   */
  show () {
    this.createTaskForm(this.modalElement)
    this.getModal().show()
  }

  /**
   * Oculta el formulario
   */
  hide () {
    this.getModal().hide()
    this.modalElement.querySelector('.modal-body').innerHTML = ''
  }

  /**
   * Crea el formulario para añadir o editar una tarea
   * @param {HTMLElement} parentModalElement - Elemento padre del modal
   */
  createTaskForm (parentModalElement) {
    // Crea la estructura básica del modal (cabecera, cuerpo y pie)
    parentModalElement.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-truncate">${
              this.isEditing ? 'Editar tarea "' + this.task.title + '"' : 'Nueva tarea'
            }
            </h5>
          </div>
          <div class="modal-body">
          </div>
          <div class="modal-footer">
            <button type="button" id="cancel-task-form" class="btn btn-secondary"
              data-bs-dismiss="modal">Cancelar</button>
            <button type="button" id="submit-task-form" class="btn btn-primary"
              id="modal-action-button">${this.isEditing ? 'Guardar' : 'Crear'}</button>
          </div>
        </div>
      </div>`

    // Crear el formulario de la tarea con los campos necesarios dentro de "modal-body"
    const modalBody = parentModalElement.querySelector('.modal-body')

    const titlePattern = '.*\\S.*' // Patrón utilizado para validar el título, al menos un carácter sin espacios

    modalBody.innerHTML = `
    <form id="task-form" class="needs-validation" novalidate>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label" for="task-title">Título</label>
        <div class="col-sm-9">
          <input class="form-control" id="task-title" type="text" name="title" placeholder="título" pattern="${titlePattern}"
            value="${this.task.title.trim()}" required>
          <span class="invalid-feedback">El título es necesario</span>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-form-label col-sm-3"></div>
        <div class="col-sm-9">
          <div class="form-check">
            <input class="form-check-input" id="task-status" type="checkbox" name="status" ${
              this.task.status ? 'checked' : ''
            }>
            <label class="form-check-label" for="task-status">Completada</label>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label" for="task-priority">Prioridad</label>
        <div class="col-sm-9">
          <select class="form-select" name="priority" id="task-priority">
            <option value="low" ${this.task.priority === 0 ? 'selected' : ''}>Baja</option>
            <option value="medium" ${this.task.priority === 1 ? 'selected' : ''}>Media</option>
            <option value="high" ${this.task.priority === 2 ? 'selected' : ''}>Alta</option>
          </select>
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label" for="task-description">Descripción</label>
        <div class="col-sm-9">
          <textarea class="form-control" id="task-description" name="description" placeholder="descripción"
            value="${this.task.description}"></textarea>
        </div>
      </div>
    <form>
    `

    this.taskForm = modalBody.querySelector('#task-form')
    this.title = modalBody.querySelector('#task-title')
    this.status = modalBody.querySelector('#task-status')
    this.priority = modalBody.querySelector('#task-priority')
    this.description = modalBody.querySelector('#task-description')
    this.btnSave = parentModalElement.querySelector('#submit-task-form')
    this.btnClose = parentModalElement.querySelector('#cancel-task-form')

    // Seleccionar el título al abrir el formulario
    // (utiliza setTimeout para asegurar de que el elemento esté cargado en el DOM)
    setTimeout(() => {
      this.title.focus()
      this.title.select()
    }, 0)

    this.btnSave.addEventListener('click', (e) => {
      e.preventDefault()

      this.taskForm.classList.add('was-validated')

      // validar título
      if (this.title.value.trim() === '') {
        this.title.focus()
        return
      }

      // guardar tarea
      this.task.title = this.title.value.trim()
      this.task.status = this.status.checked
      this.task.priority = this.priority.selectedIndex
      this.task.description = this.description.value.trim()

      this.onSubmit(this.task)

      this.hide()
    })

    this.btnClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.hide()
    })
  }
}

export default TaskForm
