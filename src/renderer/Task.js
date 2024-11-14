class Task {
  constructor (task) {
    this.id = task.id || crypto.randomUUID()
    this.title = task.title
    this.done = task.done || false
    this.priority = task.priority || 0
    this.description = task.description || ''
  }
}

export default Task
