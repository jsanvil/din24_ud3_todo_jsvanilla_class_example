import Task from './Task.js'

class TaskList extends Array {

  constructor() {
    super()
  }

  save() {
    window.bridge.saveList(this)
  }

  load() {
    window.bridge.loadList().then(taskList => {
      if (taskList) {
        this.length = 0
        taskList.forEach(task => this.push(new Task(task)))
      }
    })
  }

}

export default TaskList