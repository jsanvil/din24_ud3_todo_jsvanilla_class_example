/**
 * @fileoverview Preload script
 *
 * El script de preload se ejecuta antes de que el script de la ventana principal (index.js)
 * para exponer una API segura y controlada.
 *
 * Se podrá acceder a las funciones de este script desde el script
 * de la ventana principal a través de `window.bridge`.
 *
 * @example
 * // Cargar la lista de tareas desde el script de la ventana principal (index.js)
 * window.bridge.loadList().then(list => { ... })
 *
 * @example
 * // Escuchar el evento para actualizar el tema desde el script de la ventana principal (index.js)
 * window.bridge.onUpdateTheme(theme => { ... })
 *
 * @see https://www.electronjs.org/es/docs/latest/tutorial/tutorial-preload
 */

const { contextBridge, ipcRenderer } = require('electron')
const EVENTS = require('../main/ipcEvents')

contextBridge.exposeInMainWorld('bridge', {
  /**
   * Carga la lista de tareas
   *
   * Invoca al evento `store:load-list` del proceso principal
   * @returns {Promise<Task[]>}
   */
  loadList: () => ipcRenderer.invoke(EVENTS.STORE_LOAD_LIST),

  /**
   * Guarda la lista de tareas
   *
   * Invoca al evento `store:save-list` del proceso principal
   * @param {Task[]} list - Lista de tareas a guardar
   * @returns {Promise<void>}
   */
  saveList: (list) => ipcRenderer.invoke(EVENTS.STORE_SAVE_LIST, list),

  /**
   * Elimina una tarea
   *
   * Invoca al evento `store:delete-task` del proceso principal
   * @param {Task} task - Tarea a eliminar
   * @returns {Promise<void>}
   */
  confirmDeleteTask: (task) => ipcRenderer.invoke(EVENTS.CONFIRM_DELETE_TASK, task),

  /**
   * Actualiza el tema
   *
   * Escucha al evento `update-theme` del proceso principal
   * @param {String} theme - Tema a aplicar
   */
  onUpdateTheme: (theme) => ipcRenderer.on(EVENTS.UPDATE_THEME, theme)
})
