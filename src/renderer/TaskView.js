'use strict'
// @ts-check

/**
 * Representa la vista de una tarea dentro del listado
 *
 * Se encarga de renderizar una tarea y de gestionar los eventos
 */
class TaskView {
  /**
   * Crear una vista de tarea
   *
   * @param {Task} task - La tarea a renderizar según el modelo
   * @param {TaskListView} taskListView - La vista del listado de tareas al que pertenece
   */
  constructor (task, taskListView) {
    this.task = task
    this.taskListView = taskListView
  }

  /**
   * Crear el elemento HTML que representa la tarea.
   * Si ya se ha creado, se devuelve el elemento ya existente.
   * @returns {HTMLElement} - El elemento HTML que representa la tarea
   */
  createElement () {
    const newTask = document.createElement('li')
    newTask.classList.add(`task-priority-${this.task.priority}`)
    newTask.innerHTML = `
    <div class="card">
      <div class="card-body d-flex flex-column justify-content-between align-items-center gap-2" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="task-${this.task.id}" href="#task-${this.task.id}">
        <div class="d-flex justify-content-between align-items-center gap-2 w-100">
          <input class="form-check form-check-inline form-check-input" type="checkbox" ${this.task.status ? 'checked' : ''}>
          <span class="flex-grow-1 text-truncate task-title ${this.task.status ? 'task-status-done' : ''}">${this.task.title}</span>
          <button class="btn btn-sm edit-task" title="Editar"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm delete-task" title="Borrar"><i class="bi bi-x-circle "></i></button>
        </div>
        <div class="collapse" id="task-${this.task.id}" data-bs-parent="#task-list">
            <!--
            <p>Fecha de creación: ${this.task.created}</p>
            <p>Fecha de vencimiento: ${this.task.dueDate}</p>
            -->
            <p>Prioridad: ${this.task.priority}</p>
            <p>${this.task.description}</p>
        </div>
      </div>
    </div>
    `

    // EVENTOS

    // evento editar
    newTask.querySelector('.edit-task').addEventListener('click', (e) => {
      this.taskListView.editTask(this.task)
    })

    // evento borrar
    newTask.querySelector('.delete-task').addEventListener('click', (e) => {
      this.taskListView.removeTask(this.task)
    })

    // marcar/desmarcar completada
    newTask.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      this.task.status = !!e.target.checked
      const taskTitle = newTask.querySelector('span')
      this.task.status ? taskTitle.classList.add('task-status-done') : taskTitle.classList.remove('task-status-done')
      this.taskListView.taskList.save().then(() => {
        this.taskListView.updateFilteredList()
      })
    })

    return newTask
  }
}

export default TaskView
