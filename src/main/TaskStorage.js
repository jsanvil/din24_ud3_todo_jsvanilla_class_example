const fs = require('fs')

class TaskStorage {
  constructor (filename) {
    if (filename === undefined) {
      throw new Error('No se ha proporcionado el nombre del archivo')
    }
    this.filename = filename
    this.writeCount = 0
    this.readCount = 0
  }

  read () {
    if (!fs.existsSync(this.filename)) {
      this.write([])
      return []
    }
    const data = fs.readFileSync(this.filename, 'utf-8')
    return JSON.parse(data)
  }

  write (taskList) {
    fs.writeFileSync(this.filename, JSON.stringify(taskList, null, 2))
  }
}

module.exports = TaskStorage
