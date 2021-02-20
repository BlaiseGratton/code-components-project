if (typeof require !== 'undefined') {
  require('./WireSegment')
}


window.customElements.define('power-source', class PowerSource extends HTMLElement {

  get ALWAYS_POWERED () { return { isPowered: true } }

  connectedCallback () {
    if (process && !this.id) {
      this.id = `power-source-${this.testId}`
    }
    this.style.display = 'contents'
    this.style.position = 'absolute'
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

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    svg.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink'
    )
    
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line1.setAttribute('x1', 10)
    line1.setAttribute('y1', 10)
    line1.setAttribute('x2', 22)
    line1.setAttribute('y2', 40)
    line1.setAttribute('stroke', 'black')
    line1.setAttribute('stroke-width', 4)
    svg.appendChild(line1)

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line2.setAttribute('x1', 22)
    line2.setAttribute('y1', 40)
    line2.setAttribute('x2', 34)
    line2.setAttribute('y2', 10)
    line2.setAttribute('stroke', 'black')
    line2.setAttribute('stroke-width', 4)
    svg.appendChild(line2)

    if (this.parentSVG) {
      svg.setAttribute('width', this.parentSVG.attributes.width.value)
      svg.setAttribute('height', this.parentSVG.attributes.height.value)
      svg.setAttribute('viewbox', this.parentSVG.attributes.viewbox)
      this.parentSVG.appendChild(svg)
    }
    this.svg = svg
  }

  get isPowered () { return Boolean(this.poweredBy.length) }

  get poweredBy () { return [this.ALWAYS_POWERED] }

  set poweredBy (val) { return true /* blank setter intentional */ }

  addWireSegment ({ x2 = 20, y2 = 20 } = {}) {
    const segment = document.createElement('wire-segment')
    this.svg.appendChild(segment)
    segment.x1 = 22
    segment.x2 = x2
    segment.y1 = 40
    segment.y2 = y2
    segment.connect(this)
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

    if (newComponent.isPowered) {
      this.poweredBy = [...this.poweredBy, newComponent]
    }
    newComponent.connect(this)
  }

  disconnect (oldComponent) {
    if (!this.connectedComponents.includes(oldComponent)) return
    this.connectedComponents = this.connectedComponents.filter(x => x !== oldComponent)

    if (this.poweredBy.includes(oldComponent)) {
      this.poweredBy = this.poweredBy.filter(com => com !== oldComponent)
    }
    oldComponent.disconnect(this)
  }
})
