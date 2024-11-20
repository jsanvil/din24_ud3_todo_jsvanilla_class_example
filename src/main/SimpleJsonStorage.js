const fs = require('fs')

class SimpleJsonStorage {
  constructor (filename) {
    if (!filename || typeof filename !== 'string' || filename.trim() === '') {
      throw new Error('El nombre del archivo es inválido')
    }

    // read permissions
    if (fs.accessSync(filename, fs.constants.R_OK)) {
      throw new Error(`Faltan permisos de lectura -> ${filename}`)
    }

    if (fs.accessSync(filename, fs.constants.W_OK)) {
      throw new Error(`Faltan permisos de escritura -> ${filename}`)
    }

    this.filename = filename
  }

  read (init = []) {
    if (!fs.existsSync(this.filename)) {
      this.write(init)
      return init
    }
    const data = fs.readFileSync(this.filename, 'utf-8')
    return JSON.parse(data)
  }

  write (data) {
    fs.writeFileSync(this.filename, JSON.stringify(data, null, 2))
  }
}

module.exports = SimpleJsonStorage
