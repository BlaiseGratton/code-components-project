require('./WireSegment')

window.customElements.define('component-container', class extends HTMLElement {

  constructor () {
    super()

    const {
      width = 200,
      height = 200
    } = this.attributes

    const style = document.createElement('style')

    style.textContent = `
      svg {
        border: 1px solid yellow;
      }
    `


    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`)

    this.appendChild(style)
    this.appendChild(svg)
  }

  get svg () {
    return this.querySelector('svg')
  }

  addWireSegment ({ x1 = 0, y1 = 0, x2 = 20, y2 = 20 } = {}) {
    const segment = document.createElement('wire-segment')
    this.svg.appendChild(segment)
    segment.x1 = x1
    segment.x2 = x2
    segment.y1 = y1
    segment.y2 = y2
    return segment
  }

  handleIntersections (movedEnd, xOffset, yOffset) {
    const svg = this.svg
    const mousePosition = svg.createSVGRect()
    mousePosition.x = xOffset - 5 
    mousePosition.y = yOffset - 5
    mousePosition.width = 10
    mousePosition.height = 10

    const segmentCaps = svg.querySelectorAll('circle.segment-cap')

    segmentCaps.forEach(cap => {
      if (cap === movedEnd || cap.parentComponent.isOtherSegmentEnd(movedEnd)) return

      if (svg.checkIntersection(cap, mousePosition)) {
        if (!movedEnd.parentComponent.connectedSegments.find(seg => seg === cap.parentComponent)) {
          movedEnd.parentComponent.handleConnectSegment(cap.parentComponent)
          cap.parentComponent.handleConnectSegment(movedEnd.parentComponent)
        }
      } else if (movedEnd.parentComponent.connectedSegments.find(seg => seg === cap.parentComponent)) {
        movedEnd.parentComponent.handleDisconnectSegment(cap.parentComponent)
        cap.parentComponent.handleDisconnectSegment(movedEnd.parentComponent)
      }
    })
  }
})
