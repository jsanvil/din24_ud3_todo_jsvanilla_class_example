/**
 * Lista de constantes para los mensajes enviados mediante eventos IPC
 * @module
 */

/**
 * Mensaje para cargar la lista de tareas
 * @type {String}
 */
const STORE_LOAD_LIST = 'store:load-list'

/**
 * Mensaje para guardar la lista de tareas
 * @type {String}
 */
const STORE_SAVE_LIST = 'store:save-list'

/**
 * Mensaje para confirmar el borrado de una tarea
 * @type {String}
 */
const CONFIRM_DELETE_TASK = 'confirm:delete-task'

/**
 * Mensaje para actualizar el tema de la aplicación
 * @type {String}
 */
const UPDATE_THEME = 'update-theme'

module.exports = {
  STORE_LOAD_LIST,
  STORE_SAVE_LIST,
  CONFIRM_DELETE_TASK,
  UPDATE_THEME
}
