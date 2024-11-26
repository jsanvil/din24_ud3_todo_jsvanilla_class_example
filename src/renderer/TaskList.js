'use strict'
// @ts-check

import Task from './Task.js'

/**
 * Modelo de lista de tareas, extiende de Array
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array|Array}
 */
class TaskList extends Array {
  /**
   * Envía el evento para guardar la lista de tareas en el proceso principal
   * @returns {Promise<void>}
   */
  async save () {
    await window.bridge.saveList(this)
  }

  /**
   * Envía el evento para cargar la lista de tareas desde el proceso principal
   * @returns {Promise<void>}
   */
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

  /**
   * Filtra las tareas por estado y devuelve una nueva TaskList
   * @param {Boolean} status - Estado de la tarea (true = completada, false = pendiente)
   * @returns {TaskList} Lista de tareas filtrada por estado
   */
  filterByStatus (status) {
    return this.filter(task => task.status !== status)
  }

  /**
   * Filtra las tareas por prioridad y devuelve una nueva TaskList
   * @param {Number} priority - Prioridad de la tarea (0 = baja, 1 = media, 2 = alta)
   * @returns {TaskList} Lista de tareas filtrada por prioridad
   */
  filterByPriority (priority, asc = true) {
    return this.filter(task => task.priority === priority)
  }

  /**
   * Filtra las tareas por título y devuelve una nueva TaskList
   * @param {String} searchPattern - String to search in task titles
   * @returns {TaskList} List of tasks filtered by title
   */
  filterByTitle (searchPattern) {
    return this.filter(task => task.title.toLowerCase().includes(searchPattern.toLowerCase()))
  }

  /**
   * Ordena las tareas por título y devuelve una nueva TaskList
   * @param {Boolean} asc - Ordenar en orden ascendente (true) o descendente (false)
   * @returns {TaskList} Lista de tareas ordenada
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
   */
  sortByTitle (asc = true) {
    return this.sort((a, b) => {
      if (asc) {
        return a.title.localeCompare(b.title)
      } else {
        return b.title.localeCompare(a.title)
      }
    })
  }

  /**
   * Ordena las tareas por prioridad y devuelve una nueva TaskList
   * @param {Boolean} asc - Ordenar en orden ascendente (true) o descendente (false)
   * @returns {TaskList} Lista de tareas ordenada
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
   */
  sortByPriority (asc = false) {
    return this.sort((a, b) => {
      if (asc) {
        return a.priority - b.priority
      } else {
        return b.priority - a.priority
      }
    })
  }

  /**
   * Ordena las tareas por estado y devuelve una nueva TaskList
   * @param {Boolean} asc - Ordenar en orden ascendente (true) o descendente (false)
   * @returns {TaskList} Lista de tareas ordenada
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
   */
  sortByStatus (asc = true) {
    return this.sort((a, b) => {
      if (asc) {
        return a.status - b.status
      }
      return b.status - a.status
    })
  }

  /**
   * Ordena las tareas por fecha de creación y devuelve una nueva TaskList
   * @param {Boolean} asc - Ordenar en orden ascendente (true) o descendente (false)
   * @returns {TaskList} Lista de tareas ordenada
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
   */
  sortByCreationDate (asc = true) {
    return this.sort((a, b) => {
      if (asc) {
        return a.createdAt - b.createdAt
      }
      return b.createdAt - a.createdAt
    })
  }

  sortByCompletionDate (asc = true) {
    return this.sort((a, b) => {
      if (asc) {
        return a.statusAt - b.statusAt
      }
      return b.statusAt - a.statusAt
    })
  }

  sortByDueDate (asc = true) {
    return this.sort((a, b) => {
      if (asc) {
        return a.dueDate - b.dueDate
      }
      return b.dueDate - a.dueDate
    })
  }
}

export default TaskList
