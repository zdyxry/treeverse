import { select } from 'd3-selection'

export class Toolbar {
  container: HTMLElement

  constructor(element: HTMLElement) {
    this.container = element
  }

  addButton(label: string, onClicked: () => void): HTMLButtonElement {
    return select(this.container)
      .append('button')
      .text(label)
      .classed('ui primary button', true)
      .style('margin-bottom', '10px')
      .on('click', onClicked)
      .node() as HTMLButtonElement
  }
}
