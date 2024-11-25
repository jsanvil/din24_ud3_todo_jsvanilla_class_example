/**
 * Defines the Task model.
 */
class Task {
  /**
   * Creates a new Task.
   * @param {Object} task - Task properties to set.
   * @param {String} task.id - Task unique identifier (UUID)
   * @param {Date} task.createdAt - Task creation date (default now)
   * @param {Date} task.updatedAt - Task update date (default now)
   * @param {String} task.title - Task title (required)
   * @param {Boolean} task.done - Task status (default false)
   * @param {Number} task.priority - Task priority (default 0)
   * @param {String} task.description - Task description (default '')
   * @param {Date} task.deadline - Task deadline (default null)
   */
  constructor (task) {
    this.id = task.id || crypto.randomUUID()
    this.createdAt = task.createdAt ? new Date(task.createdAt) : new Date()
    this.updatedAt = task.updatedAt ? new Date(task.updatedAt) : new Date()
    this.title = task.title
    this.done = task.done || false
    this.priority = task.priority || 0
    this.description = task.description || ''
    this.deadline = task.deadline ? new Date(task.deadline) : null
  }
}

export default Task
