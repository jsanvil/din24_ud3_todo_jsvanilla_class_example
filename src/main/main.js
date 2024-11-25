/**
 * @fileoverview Módulo principal de la aplicación
 *
 * Gestiona la lógica del proceso principal de Electron, la ventana principal y los eventos IPC.
 */

const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  nativeTheme
} = require('electron')

const { join } = require('node:path')
const SimpleJsonStorage = require('./SimpleJsonStorage')
const setMainMenu = require('./menu')
const ContextMenu = require('./ContextMenu')
const EVENTS = require('./ipcEvents')

const isDev = !app.isPackaged

// Recargar la aplicación cuando se modifique el código (hot reload)
// Solo en modo de desarrollo
if (isDev) {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true,
      ignore: ['src/main/tasks.json']
    })
  } catch (err) {
    console.error(err)
  }
}

// tema por defecto
nativeTheme.themeSource = 'dark'

/**
 * Ventana principal de la aplicación (BrowserWindow)
 */
let win

/**
 * Almacenamiento de la configuración de la aplicación (SimpleJsonStorage)
 */
const settingsStorage = new SimpleJsonStorage(join(app.getPath('userData'), 'settings.json'))

// ***** CREAR VENTANA PRINCIPAL *****

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 650,
    icon: join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, '../renderer/preload.js')
    },
    show: false // Ocultar la ventana, se mostrará cuando el contenido esté listo
  })

  win.setMinimumSize(500, 300)

  // Cargar el archivo HTML principal
  win.loadFile(join(__dirname, '../renderer/index.html'))

  // Evento emitido cuando la el contenido de la ventana ha sido cargado
  win.webContents.on('did-finish-load', async () => {
    loadSettings(settingsStorage)
    win.show() // Mostrar la ventana con el contenido ya cargado y el tema aplicado
    // Esto se hace para evitar el parpadeo de la ventana al cambiar el tema en la carga
    // Si no lo hiciéramos, la ventana se mostraría con el tema por defecto y luego cambiaría
  })

  // Establece el menú de la aplicación
  setMainMenu(win, settingsStorage)

  // cut, copy, paste
  const contextMenu = new ContextMenu(win)
  win.webContents.on('context-menu', contextMenu.callback.bind(contextMenu))
}

// Crear la ventana cuando la aplicación esté lista
app.whenReady().then(() => {
  createWindow()

  // Cuando se active la aplicación y no haya ventanas, crear una nueva
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Cerrar la aplicación cuando todas las ventanas estén cerradas
//
// nota: En macOS (darwin), es común que las aplicaciones se mantengan activas
//       hasta que el usuario salga explícitamente con Cmd + Q
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ***** ALMACENAMIENTO DE TAREAS *****

// Ruta del directorio de la aplicación del usuario
const userAppDir = app.getPath('userData')
// Nombre del archivo de tareas
const tasksFile = 'tasks.json'
// Instancia de SimpleJsonStorage para almacenar las tareas
const taskStorage = new SimpleJsonStorage(join(userAppDir, tasksFile))

// *****  EVENTOS IPC *****

// 'store:load-list' - Cargar la lista de tareas
// 'store:save-list' - Guardar la lista de tareas
// 'confirm:delete-task' - Confirmar el borrado de una tarea
// 'update-theme' - Actualizar el tema de la aplicación
//
// Se ha creado un pequeño módulo para almacenar los nombres de los eventos IPC
// en src/main/ipcEvents.js
//
// En src/renderer/preload.js se han expuesto los eventos IPC para ser utilizados
// en el proceso de renderizado

// 'store:load-list' - Cargar la lista de tareas
ipcMain.handle(EVENTS.STORE_LOAD_LIST, async () => {
  return taskStorage.read()
})

// 'store:save-list' - Guardar la lista de tareas
ipcMain.handle(EVENTS.STORE_SAVE_LIST, async (event, list) => {
  taskStorage.write(list)
  return true
})

// 'confirm:delete-task' - Confirmar el borrado de una tarea
ipcMain.handle(EVENTS.CONFIRM_DELETE_TASK, async (event, task) => {
  const result = await dialog.showMessageBox(win, {
    type: 'warning',
    title: `Borrar ${task.title}`,
    message: `¿Borrar '${task.title}' de la lista?`,
    buttons: ['Cancelar', 'BORRAR'],
    cancelId: 0,
    defaultId: 1
  }).then(result => result)
  return result
})

/**
 * Cargar la configuración de la aplicación desde el almacenamiento
 *
 * @param {SimpleJsonStorage} settingsStorage - Instancia de SimpleJsonStorage
 */
async function loadSettings (settingsStorage) {
  const settings = await settingsStorage.read({ theme: nativeTheme.themeSource })
  if (settings.theme) {
    nativeTheme.themeSource = settings.theme
    // Enviar el evento a la ventana para actualizar el tema
    win.webContents.send(EVENTS.UPDATE_THEME, settings.theme)
  }
}
