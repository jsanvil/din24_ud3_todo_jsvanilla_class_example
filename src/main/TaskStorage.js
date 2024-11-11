const fs = require('fs');
const path = require('path');

class TaskStorage {
  constructor(filename = 'tasks.json') {
    this.filename = filename;
  }

  read() {
    const data = fs.readFileSync(path.join(__dirname, this.filename), 'utf-8');
    return JSON.parse(data);
  }

  write(taskList) {
    fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(taskList, null, 2));
  }
}

module.exports = TaskStorage;
