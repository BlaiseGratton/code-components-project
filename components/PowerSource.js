class PowerSource extends HTMLElement {

  get ALWAYS_POWERED () { return { isPowered: true } }

  toRepresentation () {
    const xOffset = this.xOffset ? `x="${this.xOffset}"`: ''
    const yOffset = this.yOffset ? `y="${this.yOffset}"`: ''
    const wireX = this.wire ? `x2="${this.wire.end2.cx.baseVal.value}"` : ''
    const wireY = this.wire ? `y2="${this.wire.end2.cy.baseVal.value}"` : ''
    return `<power-source ${xOffset} ${yOffset} ${wireX} ${wireY}></power-source>`
  }

  connectedCallback () {
    if (typeof process !== 'undefined' && !this.id) {
      this.id = `power-source-${this.testId}`
    }
    this.style.display = 'contents'
    this.style.position = 'absolute'

    let { 'x': xOffset, 'y': yOffset, 'x2': wireEndX, 'y2': wireEndY } = this.attributes
    this.xOffset = xOffset ? parseInt(xOffset.value) : 0
    this.yOffset = yOffset ? parseInt(yOffset.value) : 0

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line1.setAttribute('x1', 10 + this.xOffset)
    line1.setAttribute('y1', 10 + this.yOffset)
    line1.setAttribute('x2', 22 + this.xOffset)
    line1.setAttribute('y2', 40 + this.yOffset)
    line1.setAttribute('stroke', 'black')
    line1.setAttribute('stroke-width', 4)

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line2.setAttribute('x1', 22 + this.xOffset)
    line2.setAttribute('y1', 40 + this.yOffset)
    line2.setAttribute('x2', 34 + this.xOffset)
    line2.setAttribute('y2', 10 + this.yOffset)
    line2.setAttribute('stroke', 'black')
    line2.setAttribute('stroke-width', 4)

    if (this.parentElement && this.parentSVG) {
      this.parentElement.attachSVGElement(line1)
      this.parentElement.attachSVGElement(line2)
    }

    this.wire = this.addWireSegment()
    if (wireEndX) this.wire.x2 = wireEndX.value
    if (wireEndY) this.wire.y2 = wireEndY.value
  }

  toJSON () {
    return {
      type: 'power-source'
    }
  }

  constructor (testId) {
    super()
    this.testId = testId
    this.connectedComponents = []
  }

  get isPowered () { return Boolean(this.poweredBy) }

  get poweredBy () { return this.ALWAYS_POWERED }

  set poweredBy (val) { return true /* blank setter intentional */ }

  addWireSegment ({ x2 = 22, y2 = 80 } = {}) {
    const segment = document.createElement('wire-segment')
    this.parentElement.appendChild(segment)
    segment.x1 = 22 + this.xOffset
    segment.x2 = x2 + this.xOffset
    segment.y1 = 40 + this.yOffset
    segment.y2 = y2 + this.yOffset
    segment.connect(this)
    this.parentSVG.removeChild(segment.end1)
    return segment
  }

  get parentSVG () {
    return this.parentElement && this.parentElement.querySelector('svg')
  }

  get svg () {
    return this._svg
  }

  set svg (value) {
    this._svg = value
  }

  connect (newComponent) {
    if (this.connectedComponents.includes(newComponent)) return
    this.connectedComponents.push(newComponent)
    newComponent.connect(this)
  }

  disconnect (oldComponent) {
    if (!this.connectedComponents.includes(oldComponent)) return
    this.connectedComponents = this.connectedComponents.filter(x => x !== oldComponent)
    oldComponent.disconnect(this)
  }
}

window.customElements.define('power-source', PowerSource)

export default PowerSource
