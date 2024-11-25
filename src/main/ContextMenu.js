const { Menu, MenuItem } = require('electron')

/**
 * Módulo para mostrar menús contextuales
 * @module ContextMenu
 */

/**
 * Clase para mostrar menús contextuales
 */
class ContextMenu {
  /**
   * @param {BrowserWindow} win - Ventana en la que se mostrará el menú contextual
  */
  constructor (win) {
    this.win = win
  }

  /**
   * Muestra un menú contextual para texto seleccionado
   * @param {Object} params - Parámetros del menú contextual
   */
  showTextClipboardMenu (params) {
    const contextMenu = new Menu()

    if (params.editFlags.canCut) {
      contextMenu.append(new MenuItem({ label: 'Cortar', role: 'cut' }))
    }

    if (params.editFlags.canCopy) {
      contextMenu.append(new MenuItem({ label: 'Copiar', role: 'copy' }))
    }

    if (params.editFlags.canPaste) {
      contextMenu.append(new MenuItem({ label: 'Pegar', role: 'paste' }))
    }

    if (contextMenu.items.length > 0) {
      contextMenu.popup({ window: this.win, x: params.x, y: params.y })
    }
  }

  callback (event, params) {
    if (params.isEditable) {
      this.showTextClipboardMenu(params)
    }
  }
}

module.exports = ContextMenu
