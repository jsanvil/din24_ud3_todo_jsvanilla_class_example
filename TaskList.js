import Task from './Task.js'

class TaskList extends Array {

  constructor() {
    super()
    this.load()
  }

  push(task) {
    super.push(task)
    this.save()
  }

  pop() {
    super.pop()
    this.save()
  }

  shift() {
    super.shift()
    this.save()
  }

  unshift(task) {
    super.unshift(task)
    this.save()
  }

  splice(index, howMany, ...items) {
    super.splice(index, howMany, ...items)
    this.save()
  }

  save() {
    localStorage.setItem('taskList', JSON.stringify(this))
  }

  load() {
    const taskList = JSON.parse(localStorage.getItem('taskList')) || []
    if (taskList) {
      taskList.forEach(task => this.push(new Task(task)))
    }
  }

}

export default TaskList