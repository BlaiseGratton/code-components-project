// $('wire-segment').setAttribute('is-powered', 'true')

const style = document.createElement('style')

style.textContent = `
  
`

window.customElements.define('wire-segment', class extends HTMLElement {

  constructor () {
    super()

    this.attributeChangeHandlers = {
      'is-powered': (self, ...rest) => {
        self.shadowRoot.querySelector('line').style.stroke = 'red'
      }
    }

    const shadowDOM = this.attachShadow({ mode: 'open' })
    shadowDOM.appendChild(style)

    let {
      'x1': x1Attribute,
      'x2': x2Attribute,
      'y1': y1Attribute,
      'y2': y2Attribute
    } = this.attributes

    const x1 = parseInt(x1Attribute.value)
    const y1 = parseInt(y1Attribute.value)
    const x2 = parseInt(x2Attribute.value)
    const y2 = parseInt(y2Attribute.value)

    const width = Math.abs(x2 - x1)
    const height = Math.abs(y2 - y1)

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
    const circleCapRadius = 4  // circular caps at ends of segments
    svg.setAttribute('width', width + circleCapRadius * 2)
    svg.setAttribute('height', height + circleCapRadius * 2)
    svg.setAttribute('viewbox', `0 0 ${width + circleCapRadius * 2}, ${height + circleCapRadius * 2}`)

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    // line.setAttribute('id', 'segment-1')
    line.setAttribute('x1', x1 + circleCapRadius)
    line.setAttribute('x2', x2 + circleCapRadius)
    line.setAttribute('y1', y1 + circleCapRadius)
    line.setAttribute('y2', y2 + circleCapRadius)
    line.setAttribute('stroke', 'black')
    line.setAttribute('stroke-width', 2)

    const segmentEnd1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    segmentEnd1.setAttribute('cx', x1 + circleCapRadius)
    segmentEnd1.setAttribute('cy', y1 + circleCapRadius)
    segmentEnd1.setAttribute('r', circleCapRadius)
    segmentEnd1.setAttribute('fill', 'black')

    const segmentEnd2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    segmentEnd2.setAttribute('cx', x2 + circleCapRadius)
    segmentEnd2.setAttribute('cy', y2 + circleCapRadius)
    segmentEnd2.setAttribute('r', circleCapRadius)
    segmentEnd2.setAttribute('fill', 'black')

    svg.appendChild(line)
    svg.appendChild(segmentEnd1)
    svg.appendChild(segmentEnd2)
    shadowDOM.appendChild(svg)
  }


  attributeChangedCallback (attribute, ...rest) {
    this.attributeChangeHandlers[attribute](this, ...rest)
  }

  static get observedAttributes () {
    return ['is-powered']
  }

})
