# ToDo js

Aplicación _ToDo List_ con Javascript _vanilla_ hecha en clase (_Live coding_)

No utiliza _Web Components_ ni librerías. Se pretende aprender a realizar una pequeña aplicación _Javascript_ con lo básico. Más adelante, se verán las ventajas las librerías de componentes.

[Excalidraw Mockup](https://excalidraw.com/#json=gptaRL4eHX-SmJ2jUtAKO,t3J_YYwg44sg9BPhw6rWgQ)

## Estructura

- `src/`
  - `main\`
    - `main.js`: Proceso principal de Electron
    - `TaskStorage.js`: Almacenamiento en formato JSON
  - `renderer\`
    - `preload.js`: Código que se ejecuta antes de cargar la página
    - `index.html`: Página principal
    - `index.js`: Código de la página principal. Controla eventos de formularios, se podría dividir en varios ficheros
    - `Task.js`: Modelo de tarea
    - `TaskList.js`: Modelo de lista de tareas. Extiende de `Array`
    - `TaskView.js`: Componente de la vista de una tarea
    - `TaskListView.js`: Componente de la vista de la lista de tareas

## Arquitectura

Se separa interfaz de usuario del modelo de datos. Al ser una aplicación sencilla, no llega a ser una arquitectura _MVC_ (Modelo-Vista-Controlador) pero se acerca. Las vistas se encargan de mostrar la interfaz y controlar la lógica de negocio y los modelos se encargan de la lógica de datos, lo que permite cambiar el modelo de datos sin afectar a la interfaz, por ejemplo si se cambia el almacenamiento de datos de JSON a una base de datos o peticiones a un servidor.

- **Modelos**: `Task`, `TaskList`
- **Vistas**: `TaskView`, `TaskListView`

Por otro lado tenemos la arquitectura típica de una aplicación _Electron_:

- **Proceso principal**: `main.js`
- **Proceso de renderizado**: `index.js`, `preload.js`

Donde el proceso principal se encarga de la creación de la ventana y la gestión de eventos de la aplicación y el proceso de renderizado se encarga de la interfaz de usuario.

En este caso, se ha creado un pequeño un módulo `TaskStorage` para el almacenamiento de tareas en formato JSON desde el proceso principal, puesto que desde el proceso de renderizado (navegador), no se puede acceder a ficheros del sistema.

Para comunicar el proceso de renderizado con el proceso principal se utiliza `contextBridge` de Electron:
  
```javascript
// renderer/preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bridge', {
  loadList: () => ipcRenderer.invoke('store:load-list'),
  saveList: (list) => ipcRenderer.invoke('store:save-list', list),
  confirmDeleteTask: (task) => ipcRenderer.invoke('confirm:delete-task', task)
})
```

Se exponen funciones para cargar y guardar la lista de tareas y confirmar el borrado de una tarea. De esta forma se crea una comunicación mediante eventos entre el proceso de renderizado y el proceso principal.
