'use strict'
// @ts-check

const fs = require('fs')

/**
 * Almacenamiento JSON simple
 * @module SimpleJsonStorage
 */

/**
 * Almacenamiento JSON simple
 * - Lee y escribe datos en un archivo en formato JSON
 * - Si el archivo no existe, se crea con los datos iniciales
 * @example
 * // Crear nueva instancia de almacenamiento
 * const storage = new SimpleJsonStorage('tasks.json')
 * // Leer los datos del archivo
 * const tasks = storage.read()
 * // Modificar los datos
 * tasks.push({ title: 'New task' })
 * // Escribir los datos en el archivo
 * storage.write(tasks)
 */
class SimpleJsonStorage {
  /**
   * @param {string} filename - Ruta del archivo JSON
   * @throws {Error} Si el nombre del archivo es inválido
   */
  constructor (filename) {
    if (!filename || typeof filename !== 'string' || filename.trim() === '') {
      throw new Error('El nombre del archivo es inválido')
    }

    this.filename = filename
  }

  /**
   * Lee los datos del archivo
   * @param {Array} [init=[]] - Datos iniciales si el archivo no existe
   * @returns {Array} Datos leídos del archivo
   */
  read (init = []) {
    if (!fs.existsSync(this.filename)) {
      this.write(init)
      return init
    }
    const data = fs.readFileSync(this.filename, 'utf-8')
    return JSON.parse(data)
  }

  /**
   * Escribe los datos en el archivo
   * @param {Array} data - Datos a escribir en el archivo
   * @throws {Error} Si los datos no son válidos o no se pueden escribir los datos en el archivo
   */
  write (data) {
    fs.writeFileSync(this.filename, JSON.stringify(data, null, 2))
  }
}

module.exports = SimpleJsonStorage
