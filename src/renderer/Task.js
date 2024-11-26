'use strict'
// @ts-check

/**
 * Defines the Task model.
 */
class Task {
  /**
   * Creates a new Task.
   * @param {Object} task - Task properties to set.
   * @property {String} task.id - Task unique identifier (UUID)
   * @property {Date} task.createdAt - Task creation date (default now)
   * @property {Date} task.updatedAt - Task update date (default now)
   * @property {String} task.title - Task title (required)
   * @property {Boolean} task.status - Task status (default false)
   * @property {Number} task.priority - Task priority (default 0)
   * @property {String} task.description - Task description (default '')
   * @property {Date} task.dueDate - Task deadline (default null)
   */
  constructor (task) {
    this.id = task.id || crypto.randomUUID()
    this.createdAt = task.createdAt ? new Date(task.createdAt) : new Date()
    this.updatedAt = task.updatedAt ? new Date(task.updatedAt) : new Date()
    this.title = task.title
    this.status = task.status || false
    this.priority = task.priority || 0
    this.description = task.description || ''
    this.completionDate = task.completionDate ? new Date(task.completionDate) : null
    this.dueDate = task.dueDate ? new Date(task.dueDate) : null
  }
}

export default Task
