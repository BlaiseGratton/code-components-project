window.customElements.define('component-container', class ComponentContainer extends HTMLElement {

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
    svg.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink'
    )
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`)

    this.appendChild(style)
    this.appendChild(svg)
  }

  get svg () {
    return this.querySelector('svg')
  }

  attachSVGElement (element) {
    this.svg.appendChild(element)
  }

  addWireSegment ({ x1 = 0, y1 = 0, x2 = 20, y2 = 20 } = {}, testId) {
    const segment = document.createElement('wire-segment')
    segment.testId = testId
    this.appendChild(segment)
    segment.x1 = x1
    segment.x2 = x2
    segment.y1 = y1
    segment.y2 = y2
    return segment
  }

  addPowerSource () {
    const powerSource = document.createElement('power-source')
    this.appendChild(powerSource)
    return powerSource
  }

  addGround () {
    const ground = document.createElement('ground-connection')
    this.appendChild(ground)
    return ground
  }

  addBulb () {
    const bulb = document.createElement('simple-bulb')
    this.appendChild(bulb)
    return bulb
  }

  addSwitch () {
    const swhich = document.createElement('simple-switch')
    this.appendChild(swhich)
    return swhich
  }

  addWireCoil () {
    const wireCoil = document.createElement('wire-coil')
    this.appendChild(wireCoil)
    return wireCoil
  }

  handleIntersections (movedEnd, xOffset, yOffset) {
    const movedWire = movedEnd.parentComponent
    const circleCapRadius = movedWire.constructor.CIRCLE_CAP_RADIUS
    const strokeWidth = movedWire.constructor.STROKE_WIDTH
    const svg = this.svg
    const mousePosition = svg.createSVGRect()
    mousePosition.x = xOffset - circleCapRadius - (strokeWidth / 2)
    mousePosition.y = yOffset - circleCapRadius - (strokeWidth / 2)
    mousePosition.width = circleCapRadius * 2 + strokeWidth
    mousePosition.height = circleCapRadius * 2 + strokeWidth

    const segmentCaps = svg.querySelectorAll('circle.segment-cap')

    segmentCaps.forEach(cap => {
      const otherWire = cap.parentComponent

      if (cap.parentComponent === movedWire) return
      if (otherWire === movedWire) return
      const segmentsAreConnected = movedWire.connectedComponents.find(comp => comp === otherWire)

      if (svg.checkIntersection(cap, mousePosition)) {
        if (!segmentsAreConnected) {
          movedWire.connect(otherWire)
        }
      } else if (
        segmentsAreConnected &&
        !this.capsOverlap(otherWire, movedWire.getOtherSegmentCap(movedEnd))
      ) {
        movedEnd.parentComponent.disconnect(cap.parentComponent)
      }
    })
  }

  capsOverlap (wireSegment, endToCheck) {
    const svg = this.svg
    const capRectangle = svg.createSVGRect()
    capRectangle.x = endToCheck.cx.baseVal.value - endToCheck.r.baseVal.value
    capRectangle.y = endToCheck.cy.baseVal.value - endToCheck.r.baseVal.value
    capRectangle.width = endToCheck.r.baseVal.value * 2
    capRectangle.height = endToCheck.r.baseVal.value * 2

    return (
      svg.checkIntersection(wireSegment.end1, capRectangle) ||
      svg.checkIntersection(wireSegment.end2, capRectangle)
    )
  }
})
