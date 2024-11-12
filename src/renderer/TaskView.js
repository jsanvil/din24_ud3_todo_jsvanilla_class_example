import TaskListView from "./TaskListView.js"

/**
 * Clase TaskView
 * 
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
  constructor(task, taskListView) {
      this.task = task
      this.taskListView = taskListView
  }

  /**
   * Crear el elemento HTML que representa la tarea.
   * Si ya se ha creado, se devuelve el elemento ya existente.
   * @returns {HTMLElement} - El elemento HTML que representa la tarea
   */
  createElement() {
      const newTask = document.createElement('li')
      newTask.innerHTML = `
          <input type="checkbox" ${this.task.done ? 'checked' : ''}>
          <span class="task-title ${this.task.done ? 'task-status-done' : ''}">${this.task.title}</span>
          <button class="btn edit-task" title="Editar">✏️</button>
          <button class="btn delete-task" title="Borrar">🗑</button>`

      // añadir eventos

      // evento editar
      newTask.querySelector('.edit-task').addEventListener('click', e => {
        this.taskListView.editTask(this.task)
      })

      // evento borrar
      newTask.querySelector('.delete-task').addEventListener('click', e => {
        this.taskListView.removeTask(this.task)
      })

      // marcar/desmarcar completada
      newTask.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
          this.task.done = e.target.checked ? true : false
          const taskTitle = newTask.querySelector('span')
          this.task.done ?
            taskTitle.classList.add('task-status-done') :
            taskTitle.classList.remove('task-status-done')
          this.taskListView.taskList.save()
          this.taskListView.updateFilteredList()
      })

      return newTask
  }
}

export default TaskView
