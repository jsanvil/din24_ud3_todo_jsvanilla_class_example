class Task {

  constructor(task) {
      this.id = task.id || crypto.randomUUID()
      this.title = task.title
      this.done = task.done || false
  }
}

export default Task
