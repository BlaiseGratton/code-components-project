window.customElements.define('power-source', class extends HTMLElement {

  constructor () {
    super()
    this.style.display = 'contents'
    this.style.position = 'absolute'

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
    svg.setAttribute('width', this.parentSVG.attributes.width.value)
    svg.setAttribute('height', this.parentSVG.attributes.height.value)
    svg.setAttribute('viewbox', this.parentSVG.attributes.viewbox)
    
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

    this.parentSVG.appendChild(svg)
    this.svg = svg
  }

  get parentSVG () {
    return this.parentElement.querySelector('svg')
  }

  get svg () {
    return this._svg
  }

  set svg (value) {
    this._svg = value
  }


})
