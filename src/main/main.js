const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { join } = require('node:path')
const TaskStorage = require('./TaskStorage')

try {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true
  })
} catch (_) {}

let win

// Función para crear la ventana principal
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, '../renderer/preload.js')
    }
  })

  win.loadFile(join(__dirname, '../renderer/index.html'))
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

const store = new TaskStorage()

// Escuchar eventos de IPC

ipcMain.handle('store:load-list', async () => {
  return store.read()
})

ipcMain.handle('store:save-list', async (event, list) => {
  store.write(list)
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