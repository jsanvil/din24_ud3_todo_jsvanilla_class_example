const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem, nativeTheme } = require('electron')
const { join } = require('node:path')
const TaskStorage = require('./TaskStorage')
const setMainMenu = require('./menu')

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

  // cut, copy, paste

  function contextMenu (event) {
    const contextMenu = new Menu()

    contextMenu.append(new MenuItem({ label: 'Cortar', role: 'cut' }))
    contextMenu.append(new MenuItem({ label: 'Copiar', role: 'copy' }))
    contextMenu.append(new MenuItem({ label: 'Pegar', role: 'paste' }))

    contextMenu.popup({ window: win, x: event.x, y: event.y })
  }

  win.webContents.on('context-menu', (event, params) => {
    contextMenu(params)
  })

  setMainMenu(win)
}

// Crear la ventana cuando la aplicación esté lista
app.whenReady().then(() => {
  const userAppDir = app.getPath('userData')
  const tasksFile = 'tasks.json'
  const store = new TaskStorage(join(userAppDir, tasksFile))

  // Escuchar eventos de IPC

  ipcMain.handle('store:load-list', async () => {
    return store.read()
  })

  ipcMain.handle('store:save-list', async (event, list) => {
    store.write(list)
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
