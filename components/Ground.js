window.customElements.define('ground-connection', class GroundConnection extends HTMLElement {

  get ALWAYS_GROUNDED () { return { isGrounded: true } }

  connectedCallback () {
    if (typeof process !== 'undefined' && !this.id) {
      this.id = `ground-connection${this.testId}`
    }
    this.style.display = 'contents'
    this.style.position = 'absolute'

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    const Y_OFFSET = 100

    line1.setAttribute('x1', 100)
    line1.setAttribute('y1', Y_OFFSET)
    line1.setAttribute('x2', 140)
    line1.setAttribute('y2', Y_OFFSET)
    line1.setAttribute('stroke', 'black')
    line1.setAttribute('stroke-width', 3)

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line2.setAttribute('x1', 110)
    line2.setAttribute('y1', Y_OFFSET + 8)
    line2.setAttribute('x2', 130)
    line2.setAttribute('y2', Y_OFFSET + 8)
    line2.setAttribute('stroke', 'black')
    line2.setAttribute('stroke-width', 3)

    const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line3.setAttribute('x1', 116)
    line3.setAttribute('y1', Y_OFFSET + 16)
    line3.setAttribute('x2', 124)
    line3.setAttribute('y2', Y_OFFSET + 16)
    line3.setAttribute('stroke', 'black')
    line3.setAttribute('stroke-width', 3)

    if (this.parentElement && this.parentSVG) {
      this.parentElement.attachSVGElement(line1)
      this.parentElement.attachSVGElement(line2)
      this.parentElement.attachSVGElement(line3)
    }

    this.addWireSegment()
  }

  addWireSegment ({ x2 = 120, y2 = 100 } = {}) {
    const segment = document.createElement('wire-segment')
    this.parentElement.appendChild(segment)
    segment.x1 = 120
    segment.x2 = x2
    segment.y1 = 60
    segment.y2 = y2
    segment.connect(this)
    this.parentSVG.removeChild(segment.end2)
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
})
