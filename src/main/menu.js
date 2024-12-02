'use strict'
// @ts-check

const { app, Menu, nativeTheme, dialog } = require('electron')
const { join } = require('path')

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
    },
    {
      label: '&Ayuda',
      submenu: [
        {
          label: 'Acerca de...',
          click: () => {
            dialog.showMessageBox(win, {
              title: 'Acerca de ToDo',
              message: 'ToDo',
              detail: 'Aplicación de tareas pendientes\nhttps://github.com/jsanvil/din24_ud3_todo_jsvanilla_class_example',
              icon: join(__dirname, '../assets/icon.png'),
              buttons: []
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = setMainMenu
