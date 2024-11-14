import Task from './Task.js'

class TaskList extends Array {
  async save () {
    await window.bridge.saveList(this)
  }

  async load () {
    await window.bridge.loadList().then(taskList => {
      if (taskList) {
        while (this.length > 0) {
          this.pop()
        }
        taskList.forEach(task => this.push(new Task(task)))
      }
    })
  }
}

export default TaskList
