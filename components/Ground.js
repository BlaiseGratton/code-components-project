class GroundConnection extends HTMLElement {

  get ALWAYS_GROUNDED () { return { isGrounded: true } }

  toRepresentation () {
    const xOffset = this.xOffset ? `x="${this.xOffset}"`: ''
    const yOffset = this.yOffset ? `y="${this.yOffset}"`: ''
    const wireX = this.wire ? `x1="${this.wire.end1.cx.baseVal.value}"` : ''
    const wireY = this.wire ? `y1="${this.wire.end1.cy.baseVal.value}"` : ''
    return `<ground-connection ${xOffset} ${yOffset} ${wireX} ${wireY}></ground-connection>`
  }

  set x (value) {
    this.setAttribute('x', value)
    const xDelta = value - this.xOffset
    this.xOffset += xDelta
    this.updateChildAttributes('x', xDelta)
  }

  set y (value) {
    this.setAttribute('y', value)
    const yDelta = value - this.yOffset
    this.yOffset += yDelta
    this.updateChildAttributes('y', yDelta)
  }

  updateChildAttributes (attribute, delta) {
    this.childElements.forEach(elem => {
      Array.from(elem.attributes)
        .filter(attr => attr.name.includes(attribute))
        .forEach(attr => {
          attr.value = parseInt(attr.value) + delta
        })
    })
  }

  connectedCallback () {
    if (typeof process !== 'undefined' && !this.id) {
      this.id = `ground-connection${this.testId}`
    }
    this.style.display = 'contents'
    this.style.position = 'absolute'

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    const Y_OFFSET = 100  // for the horizontal bars of the symbol, not component positioning

    let { 'x': xOffset, 'y': yOffset, 'x1': wireEndX, 'y1': wireEndY } = this.attributes
    this.xOffset = xOffset ? parseInt(xOffset.value) : 0
    this.yOffset = yOffset ? parseInt(yOffset.value) : 0


    line1.setAttribute('x1', 100 + this.xOffset)
    line1.setAttribute('y1', Y_OFFSET + this.yOffset)
    line1.setAttribute('x2', 140 + this.xOffset)
    line1.setAttribute('y2', Y_OFFSET + this.yOffset)
    line1.setAttribute('stroke', 'black')
    line1.setAttribute('stroke-width', 3)
    line1.parentComponent = this

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line2.setAttribute('x1', 110 + this.xOffset)
    line2.setAttribute('y1', Y_OFFSET + 8 + this.yOffset)
    line2.setAttribute('x2', 130 + this.xOffset)
    line2.setAttribute('y2', Y_OFFSET + 8 + this.yOffset)
    line2.setAttribute('stroke', 'black')
    line2.setAttribute('stroke-width', 3)
    line2.parentComponent = this

    const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line3.setAttribute('x1', 116 + this.xOffset)
    line3.setAttribute('y1', Y_OFFSET + 16 + this.yOffset)
    line3.setAttribute('x2', 124 + this.xOffset)
    line3.setAttribute('y2', Y_OFFSET + 16 + this.yOffset)
    line3.setAttribute('stroke', 'black')
    line3.setAttribute('stroke-width', 3)
    line3.parentComponent = this

    if (this.parentElement && this.parentSVG) {
      this.parentElement.attachSVGElement(line1, line2, line3)
    }

    this.wire = this.addWireSegment()
    if (wireEndX) this.wire.x1 = wireEndX.value
    if (wireEndY) this.wire.y1 = wireEndY.value
    this.wire.determineCurrent()

    this.childElements = [line1, line2, line3, this.wire]
  }

  addWireSegment ({ x2 = 120, y2 = 100 } = {}) {
    const segment = document.createElement('wire-segment')
    segment.isSetByComponent = true
    this.parentElement.appendChild(segment)
    segment.x1 = 120 + this.xOffset
    segment.x2 = x2 + this.xOffset
    segment.y1 = 60 + this.yOffset
    segment.y2 = y2 + this.yOffset
    segment.connect(this)
    this.parentSVG.removeChild(segment.end2)
    segment.parentComponent = this
    return segment
  }

  toJSON () {
    return {
      type: 'ground-connection'
    }
  }

  constructor (testId) {
    super()
    this.testId = testId
    this.connectedComponents = []
  }

  get isPowered () { return false }

  get poweredBy () { return [] }

  set poweredBy (val) { return true /* blank setter intentional */ }

  get isGrounded () { return Boolean(this.groundedBy) }

  get groundedBy () { return this.ALWAYS_GROUNDED }

  set groundedBy (val) { return true /* blank setter intentional */ }

  get parentSVG () {
    return this.parentElement && this.parentElement.svg
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

window.customElements.define('ground-connection', GroundConnection)

export default GroundConnection
