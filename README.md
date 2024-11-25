# ToDo js

Aplicación _ToDo List_ con Javascript _vanilla_ hecha en clase (_Live coding_)

No utiliza _Web Components_ ni librerías. Se pretende aprender a realizar una aplicación _Electron_ con Javascript puro. Más adelante, se verán las ventajas las librerías de componentes.

[Excalidraw Mockup](https://excalidraw.com/#json=gptaRL4eHX-SmJ2jUtAKO,t3J_YYwg44sg9BPhw6rWgQ)

[Documentación en jsdoc](https://jsanvil.github.io/din24_ud3_todo_jsvanilla_class_example/)

## Ejecución

Instalar dependencias:

```bash
npm install
```

Ejecutar la aplicación en modo desarrollo:

```bash
npm start
```

Crear ejecutables en `/dist` para Windows, Linux:

```bash
npm run build
```

Crear ejecutables para Windows:

```bash
npm run build:win
```

Crear ejecutables para Linux:

```bash
npm run build:linux
```

## Frameworks y librerías

- [**Electron**](https://www.electronjs.org/): Framework para crear aplicaciones de escritorio con tecnologías web
- [**Bootstrap**](https://getbootstrap.com/): Framework CSS para maquetación y estilos
- [**Bootstrap Icons**](https://icons.getbootstrap.com/): Iconos de Bootstrap
- [**electron-reloader**](https://github.com/sindresorhus/electron-reloader): _Hot reload_ para Electron
- [**electron-builder**](https://www.electron.build/): Creación de ejecutables de Electron
- [**standard**](https://github.com/standard/standard): Linter de Javascript
- [**jsdoc**](https://jsdoc.app/): Documentación de código

## Estructura

El código de la aplicación se encuentra en la carpeta `src/`, estructurada de la siguiente forma:

- `src/`
  - `main\`
    - `main.js`: Proceso principal de Electron
    - `TaskStorage.js`: Almacenamiento en formato JSON
    - `menu.js`: Menú de la aplicación
    - `ContextMenu.js`: Menú contextual de la aplicación
    - `ipcEvents`: Mensajes para la comunicación entre procesos
  - `renderer\`
    - `preload.js`: Gestión de la comunicación entre el proceso principal y el proceso de renderizado
    - `index.js`: Código de la página principal. Controla eventos de formularios, se podría dividir en varios ficheros
    - `Task.js`: Modelo de tarea
    - `TaskList.js`: Modelo de lista de tareas. Extiende de `Array`
    - `TaskView.js`: Componente de la vista de una tarea
    - `TaskListView.js`: Componente de la vista de la lista de tareas
    - `TaskForm.js`: Componente del formulario de una tarea

## Arquitectura

Se separa interfaz de usuario del modelo de datos. Al ser una aplicación sencilla, no llega a ser una arquitectura _MVC_ (Modelo-Vista-Controlador) pero se acerca.

Las vistas se encargan de mostrar la interfaz y controlar la lógica de negocio y los modelos se encargan de la lógica de datos, lo que permite cambiar el modelo de datos sin afectar a la interfaz, por ejemplo si se cambia el almacenamiento de datos de JSON a una base de datos o peticiones a un servidor.

- **Modelos**: `Task`, `TaskList`
- **Vistas**: `TaskView`, `TaskListView`, `TaskForm`

Por otro lado tenemos la arquitectura típica de una aplicación _Electron_:

- **Proceso principal**: `main.js`
- **Proceso de renderizado**: `index.js`, `preload.js`

El proceso principal se encarga de la creación de la ventana y la comunicación con el sistema operativo, y el proceso de renderizado se encarga de la interfaz de usuario y la lógica de la aplicación.

Se ha creado un pequeño un módulo `TaskStorage` para el almacenamiento de tareas en formato JSON desde el proceso principal, puesto que desde el proceso de renderizado (navegador), no se puede acceder a ficheros del sistema.

Para comunicar el proceso de renderizado con el proceso principal se utiliza `contextBridge` de Electron:
  
```javascript
// renderer/preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bridge', {
  loadList: () => ipcRenderer.invoke('store:load-list'),
  saveList: (list) => ipcRenderer.invoke('store:save-list', list),
  confirmDeleteTask: (task) => ipcRenderer.invoke('confirm:delete-task', task),
  onUpdateTheme: (theme) => ipcRenderer.on('update-theme', theme)
})
```

Se exponen funciones para cargar y guardar la lista de tareas y confirmar el borrado de una tarea, incluye un evento que recibe el evento de cambio de tema desde el menú nativo de la aplicación.

De esta forma se crea una comunicación mediante eventos entre el proceso de renderizado y el proceso principal.
