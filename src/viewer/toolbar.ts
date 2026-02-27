import { select } from 'd3-selection'

export class Toolbar {
  container: HTMLElement

  constructor(element: HTMLElement) {
    this.container = element
  }

  addButton(label: string, onClicked: () => void): HTMLButtonElement {
    const button = document.createElement('button')
    button.className = 'btn btn-primary btn-sm'
    button.textContent = label
    button.addEventListener('click', onClicked)
    this.container.appendChild(button)
    return button
  }
}
