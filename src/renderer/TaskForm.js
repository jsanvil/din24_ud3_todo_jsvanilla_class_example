class TaskForm {
  isEditing = false

  constructor (task, taskListView) {
    if (taskListView.taskList.includes(task)) {
      this.isEditing = true
    }
    this.task = task
    this.taskListView = taskListView
    this.modalRootElement = document.getElementById('modal')
  }

  getModal () {
    if (!this.modal) {
      // eslint-disable-next-line no-undef
      this.modal = new bootstrap.Modal(this.modalRootElement, {
        focus: true,
        keyboard: false,
        backdrop: 'static'
      })
    }
    return this.modal
  }

  show () {
    this.createTaskForm(this.modalRootElement)
    this.getModal().show()
  }

  hide () {
    this.getModal().hide()
    this.modalRootElement.querySelector('.modal-body').innerHTML = ''
  }

  createTaskForm (parentModalElement) {
    parentModalElement.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-truncate">${this.isEditing ? 'Editar tarea "' + this.task.title + '"' : 'Nueva tarea'}
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

    const modalBody = parentModalElement.querySelector('.modal-body')

    modalBody.innerHTML = `
      <div class="row mb-3">
        <label class="col-sm-3 col-form-label" for="task-title">Título</label>
        <div class="col-sm-9">
          <input class="form-control" id="task-title" type="text" name="title" placeholder="título"
            value="${this.task.title}" required>
          <span class="error"></span>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-form-label col-sm-3"></div>
        <div class="col-sm-9">
          <div class="form-check">
            <input class="form-check-input" id="task-status" type="checkbox" name="status" ${this.task.done ? 'checked' : ''}>
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
    `

    this.title = modalBody.querySelector('#task-title')
    this.status = modalBody.querySelector('#task-status')
    this.priority = modalBody.querySelector('#task-priority')
    this.description = modalBody.querySelector('#task-description')
    this.btnSave = parentModalElement.querySelector('#submit-task-form')
    this.btnClose = parentModalElement.querySelector('#cancel-task-form')

    setTimeout(() => {
      this.title.focus()
      this.title.select()
    }, 0)

    this.btnSave.addEventListener('click', (e) => {
      e.preventDefault()

      // validar título
      if (!this.title.value) {
        this.title.nextElementSibling.textContent = 'El título es requerido'
        return
      } else {
        this.title.nextElementSibling.textContent = ''
      }

      // guardar tarea
      this.task.title = this.title.value
      this.task.done = this.status.checked
      this.task.priority = this.priority.selectedIndex
      this.task.description = this.description.value

      if (!this.isEditing) {
        this.taskListView.addTask(this.task)
      }
      this.taskListView.saveList()

      this.hide()
    })

    this.btnClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.hide()
    })
  }
}

export default TaskForm
