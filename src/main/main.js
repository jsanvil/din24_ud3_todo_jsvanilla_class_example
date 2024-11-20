const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require('electron')
const { join } = require('node:path')
const SimpleJsonStorage = require('./SimpleJsonStorage')
const setMainMenu = require('./menu')
const ContextMenu = require('./ContextMenu')

// Recargar la aplicación cuando se modifique el código (hot reload)
try {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true,
    ignore: ['src/main/tasks.json']
  })
} catch (_) {}

nativeTheme.themeSource = 'dark'

let win
let settingsStorage

// Función para crear la ventana principal
const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 650,
    webPreferences: {
      preload: join(__dirname, '../renderer/preload.js')
    }
  })

  // win.maximize()

  win.loadFile(join(__dirname, '../renderer/index.html'))

  // cut, copy, paste
  const contextMenu = new ContextMenu(win)
  win.webContents.on('context-menu', contextMenu.callback.bind(contextMenu))

  settingsStorage ||= new SimpleJsonStorage(join(app.getPath('userData'), 'settings.json'))
  setMainMenu(win, settingsStorage)
}

async function loadSettings (settingsStorage) {
  const settings = await settingsStorage.read({ theme: nativeTheme.themeSource })
  if (settings.theme) {
    nativeTheme.themeSource = settings.theme
    win.webContents.send('update-theme', settings.theme)
  }
}

// Crear la ventana cuando la aplicación esté lista
app.whenReady().then(() => {
  createWindow()

  const userAppDir = app.getPath('userData')
  const tasksFile = 'tasks.json'
  const taskStorage = new SimpleJsonStorage(join(userAppDir, tasksFile))

  win.webContents.on('did-finish-load', async () => {
    loadSettings(settingsStorage)
  })

  // Escuchar eventos de IPC

  ipcMain.handle('store:load-list', async () => {
    return taskStorage.read()
  })

  ipcMain.handle('store:save-list', async (event, list) => {
    taskStorage.write(list)
    return true
  })

  ipcMain.handle('confirm:delete-task', async (event, task) => {
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

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})
