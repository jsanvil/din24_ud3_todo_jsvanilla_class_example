const { app, Menu, nativeTheme } = require('electron')

/**
 * Módulo para configurar el menú de la aplicación
 * @module menu
 */

/**
 * Configura el menú principal de la aplicación
 * @param {BrowserWindow} win - Ventana principal de la aplicación
 * @param {SimpleJsonStorage} settingsStorage - Almacenamiento de la configuración de la aplicación
 */
function setMainMenu (win, settingsStorage) {
  const template = [
    {
      label: 'ToDo',
      submenu: [
        {
          label: 'Salir',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Opciones',
      submenu: [
        {
          label: 'Modo oscuro',
          click: () => {
            win.webContents.send('update-theme', 'dark')
            nativeTheme.themeSource = 'dark'
            settingsStorage.write({ theme: 'dark' })
          }
        },
        {
          label: 'Modo claro',
          click: () => {
            win.webContents.send('update-theme', 'light')
            nativeTheme.themeSource = 'light'
            settingsStorage.write({ theme: 'light' })
          }
        },
        // Show dev tools only in development
        ...(app.isPackaged ? [] : [{ type: 'separator' }, { role: 'reload' }, { role: 'toggledevtools' }])
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = setMainMenu
