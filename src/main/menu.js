const { app, Menu, nativeTheme } = require('electron')

function setMainMenu (win) {
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
          }
        },
        {
          label: 'Modo claro',
          click: () => {
            win.webContents.send('update-theme', 'light')
            nativeTheme.themeSource = 'light'
          }
        },
        ...(app.isPackaged ? [] : [{ type: 'separator' }, { role: 'reload' }, { role: 'toggledevtools' }])
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = setMainMenu
