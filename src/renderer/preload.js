const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bridge', {
  loadList: () => ipcRenderer.invoke('store:load-list'),
  saveList: (list) => ipcRenderer.invoke('store:save-list', list),
  confirmDeleteTask: (task) => ipcRenderer.invoke('confirm:delete-task', task),
  onUpdateTheme: (theme) => ipcRenderer.on('update-theme', theme)
})
