'use strict'
// @ts-check

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
      label: '&ToDo',
      submenu: [
        {
          label: '&Salir',
          click: () => {
            app.quit()
          },
          accelerator: 'CmdOrCtrl+Q'
        }
      ]
    },
    {
      label: '&Opciones',
      submenu: [
        {
          label: 'Modo &Oscuro',
          click: () => {
            win.webContents.send('update-theme', 'dark')
            nativeTheme.themeSource = 'dark'
            settingsStorage.write({ theme: 'dark' })
          },
          type: 'radio',
          checked: nativeTheme.themeSource === 'dark'
        },
        {
          label: 'Modo &Claro',
          click: () => {
            win.webContents.send('update-theme', 'light')
            nativeTheme.themeSource = 'light'
            settingsStorage.write({ theme: 'light' })
          },
          type: 'radio',
          checked: nativeTheme.themeSource === 'light'
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
