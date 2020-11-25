const style = document.createElement('style')

style.textContent = `
  
`

window.customElements.define('wire-segment', class extends HTMLElement {

  constructor () {
    super()

    const shadowDOM = this.attachShadow({ mode: 'open' })
    shadowDOM.appendChild(style)

    let {
      'x1': x1Attribute,
      'x2': x2Attribute,
      'y1': y1Attribute,
      'y2': y2Attribute
    } = this.attributes

    const x1 = x1Attribute.value
    const y1 = y1Attribute.value
    const x2 = x2Attribute.value
    const y2 = y2Attribute.value

    const width = Math.abs(x2 - x1)
    const height = Math.abs(y2 - y1)

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`)

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('id', 'segment-1')
    line.setAttribute('x1', x1)
    line.setAttribute('x2', x2)
    line.setAttribute('y1', y1)
    line.setAttribute('y2', y2)
    line.setAttribute('stroke', 'black')
    line.setAttribute('stroke-width', 2)

    svg.appendChild(line)
    shadowDOM.appendChild(svg)
  }

  attributeChangedCallback (attribute, thing, value, anotherThing) {
    this.shadowRoot.querySelector('line').style.stroke = 'red'
  }

  static get observedAttributes () {
    return ['is-powered']
  }

})
