class ComponentContainer extends HTMLElement {

  connectedCallback () {

    const {
      'width': widthAttribute,
      'height': heightAttribute,
      'x': xAttribute,
      'y': yAttribute,
    } = this.attributes

    const width = widthAttribute ? widthAttribute.value : 200
    const height = heightAttribute ? heightAttribute.value : 200
    const xOffset = xAttribute ? parseInt(xAttribute.value) : 0
    const yOffset = yAttribute ? parseInt(yAttribute.value) : 0

    this.noUI = Boolean(this.attributes['no-ui']) // for skipping checking SVG overlaps

    this.style.position = 'absolute'
    this.style.left = `${xOffset}px`
    this.style.top = `${yOffset}px`

    const style = document.createElement('style')

    style.textContent = `
      svg {
        border: 1px solid grey;
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
    this._svg = svg
  }

  get svg () {
    return this._svg
  }

  attachSVGElement (...elements) {
    elements.forEach(element => element && this.svg.appendChild(element))
  }

  removeSVGElement (...elements) {
    elements.forEach(element => this.svg.removeChild(element))
  }

  exposeWireCap (endCap, xOffset, yOffset, direction) {
    const yOffsets = { up: 25, down: -25 }
    const xOffsets = { left: 25, right: -25 }

    const wire = document.createElement('wire-segment')
    const capX = endCap.cx.baseVal.value
    const capY = endCap.cy.baseVal.value
    wire.setAttribute('x1', capX + xOffset - 4)
    wire.setAttribute('y1', capY + yOffset - 4)
    wire.setAttribute('x2', capX + xOffset - 4 - (xOffsets[direction] || 0))
    wire.setAttribute('y2', capY + yOffset - 4 - (yOffsets[direction] || 0))
    wire.connect(endCap.parentComponent)
    this.appendChild(wire)
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
    if (!this.svg.createSVGRect) return []
    const movedWire = movedEnd.parentComponent
    const circleCapRadius = movedWire.constructor.CIRCLE_CAP_RADIUS
    const strokeWidth = movedWire.constructor.STROKE_WIDTH
    const svg = this.svg
    const mousePosition = svg.createSVGRect()
    mousePosition.x = xOffset - circleCapRadius - (strokeWidth / 2)
    mousePosition.y = yOffset - circleCapRadius - (strokeWidth / 2)
    mousePosition.width = circleCapRadius * 2 + strokeWidth
    mousePosition.height = circleCapRadius * 2 + strokeWidth

    if (false) { // for visually debugging overlap checks
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', mousePosition.x)
      rect.setAttribute('y', mousePosition.y)
      rect.setAttribute('width', mousePosition.width)
      rect.setAttribute('height', mousePosition.height)
      svg.appendChild(rect)
    }

    const segmentCaps = svg.querySelectorAll('circle.segment-cap')

    return Array.from(segmentCaps).map(cap => {
      const otherWire = cap.parentComponent

      if (cap.parentComponent === movedWire) return
      if (otherWire === movedWire) return
      return svg.checkIntersection(cap, mousePosition) ? cap : null
    }).filter(Boolean)
  }

  capsOverlap (wireSegment, endToCheck) {
    const svg = this.svg
    const capRectangle = svg.createSVGRect()

    if (typeof process === 'undefined') {
      capRectangle.x = endToCheck.cx.baseVal.value - endToCheck.r.baseVal.value
      capRectangle.y = endToCheck.cy.baseVal.value - endToCheck.r.baseVal.value
      capRectangle.width = endToCheck.r.baseVal.value * 2
      capRectangle.height = endToCheck.r.baseVal.value * 2
    } else {
      // this is for testing purposes and works hand in hand with
      // the mockCheckIntersection override
      let x, y
      if (endToCheck === endToCheck.parentComponent.end1) {
        x = endToCheck.parentComponent.x1
        y = endToCheck.parentComponent.y1
      }
      if (endToCheck === endToCheck.parentComponent.end2) {
        x = endToCheck.parentComponent.x2
        y = endToCheck.parentComponent.y2
      }
      capRectangle.x = x
      capRectangle.y = y
      capRectangle.width = 8
      capRectangle.height = 8
    }

    if (!(wireSegment.end1 || wireSegment.end2)) return false

    const isOverlap = (
      svg.checkIntersection(wireSegment.end1, capRectangle) ||
      svg.checkIntersection(wireSegment.end2, capRectangle)
    )

    return isOverlap
  }

  connectCoilsToSwitch (switchComponent) {
    const coilsToConnect = this.querySelectorAll(`wire-coil[for="${switchComponent.id}"]`)
    coilsToConnect.forEach(coil => coil.connectSwitch(switchComponent))
  }

  connectSwitchesToCoil (coilComponent) {
    const switchesToConnect = this.querySelectorAll(`simple-switch#${coilComponent.attributes.for.value}`)
    switchesToConnect.forEach(switchComp => coilComponent.connectSwitch(switchComp))
  }
}

window.customElements.define('component-container', ComponentContainer)


if (typeof module !== 'undefined') {
  module.exports = { ComponentContainer }
}
