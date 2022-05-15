class ComponentContainer extends HTMLElement {

  setViewBox (width, height) {
    this.svg.setAttribute('viewBox', `0 0 ${this.defaultWidth || width} ${this.defaultHeight || height}`)
  }

  toRepresentation () {
    if (this.tagName === 'COMPONENT-CONTAINER') {
      const representations = []

      for (const component of this.children) {
        const tagName = component.tagName.toLowerCase()
        if (['style', 'svg'].includes(tagName)) continue

        const result = component.toRepresentation()
        representations.push(result)
      }

      return `<component-container width="${this.svg.width.baseVal.value}" height="${this.svg.height.baseVal.value}">${representations.join('')}</component-container>`
    } else {
      const tagName = this.tagName.toLowerCase()
      const extras = this.extraProps || ''

      return `<${tagName} x="${this.attributes.x.value}" y="${this.attributes.y.value}" scale="${this.scale}" ${extras}></${tagName}>`
    }
  }

  loadRepresentation (representation) {
    const template = document.createElement('template')
    template.innerHTML = representation
    this.appendChild(template.content)
  }

  exposedComponents = []

  connectedCallback () {

    const {
      'width': widthAttribute,
      'height': heightAttribute,
      'x': xAttribute,
      'y': yAttribute,
      'scale': scaleAttribute
    } = this.attributes

    const scale = parseFloat(scaleAttribute && scaleAttribute.value) || 1
    const width = (widthAttribute ? widthAttribute.value : this.defaultWidth) * scale
    const height = (heightAttribute ? heightAttribute.value : this.defaultHeight) * scale
    const xOffset = xAttribute ? parseInt(xAttribute.value) : 0
    const yOffset = yAttribute ? parseInt(yAttribute.value) : 0

    this.noUI = Boolean(this.attributes['no-ui']) // for skipping checking SVG overlaps

    this.scale = scale
    this.style.position = 'relative'
    this.style.left = `${xOffset}px`
    this.style.top = `${yOffset}px`

    const style = document.createElement('style')

    style.textContent = `
      svg {
        border: 1px solid grey;
        position: absolute;
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

    this.appendChild(style)
    this.appendChild(svg)
    this._svg = svg
    this.setViewBox(width, height)
  }

  attributeChangedCallback (attribute, oldVal, newVal) {
    if (attribute === 'x') {
      this.style.left = `${newVal}px`
      this.updateExposedComponents('x', newVal - oldVal)
    }
    if (attribute === 'y') {
      this.style.top = `${newVal}px`
      this.updateExposedComponents('y', newVal - oldVal)
    }
  }

  set x (val) { this.setAttribute('x', val) }
  set y (val) { this.setAttribute('y', val) }

  updateExposedComponents (attribute, delta) {
    this.exposedComponents.forEach(component => {
      Array.from(component.attributes)
        .filter(attr => attr.name.includes(attribute))
        .forEach(attr => {
          attr.value = parseInt(attr.value) + delta
        })
    })
  }

  static get observedAttributes () { return ['x', 'y'] }

  get svg () {
    return this._svg
  }

  attachSVGElement (...elements) {
    elements.forEach(element => element && this.svg.appendChild(element))
  }

  removeSVGElement (...elements) {
    elements.forEach(element => this.svg.removeChild(element))
  }

  getAspectRatio = (containerComponent) => {
    const viewBoxWidth = containerComponent.defaultWidth
    const relativeWidth = containerComponent.svg.width.baseVal.value
    const ratio = relativeWidth / viewBoxWidth
    return ratio
  }

  exposeWireCap (endCap, direction) {
    const wireEnd = endCap.parentComponent
    const component = wireEnd.parentElement
    const container = component.parentElement
    const xOffset = parseInt(component.style.left) / container.scale
    const yOffset = parseInt(component.style.top) / container.scale
    const yOffsets = { up: 25, down: -25 }
    const xOffsets = { left: 25, right: -25 }
    const wire = document.createElement('wire-segment')

    let capX, capY

    if (typeof process === 'undefined') {
      capX = endCap.cx.baseVal.value * component.scale / container.scale
      capY = endCap.cy.baseVal.value * component.scale / container.scale
    } else {
      // in a testing context here
      capX = endCap.parentComponent.x1
      capY = endCap.parentComponent.y1
    }

    const endcapOffset = 4
    wire.setAttribute('x1', capX + xOffset - endcapOffset)
    wire.setAttribute('y1', capY + yOffset - endcapOffset)
    wire.setAttribute('x2', capX + xOffset - endcapOffset - (xOffsets[direction] || 0))
    wire.setAttribute('y2', capY + yOffset - endcapOffset - (yOffsets[direction] || 0))
    this.appendChild(wire)
    wire.connect(endCap.parentComponent)
    wire.isExposed = true
    return wire
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

  addRelay ({ x, y } = {}) {
    const relay = document.createElement('simple-relay')

    if (x && y) {
      relay.setAttribute('x', x)
      relay.setAttribute('y', y)
    }

    this.appendChild(relay)
    return relay
  }

  addANDGate ({ x, y } = {}) {
    const ANDGate = document.createElement('and-gate')

    if (x && y) {
      ANDGate.setAttribute('x', x)
      ANDGate.setAttribute('y', y)
    }

    this.appendChild(ANDGate)
    return ANDGate
  }

  addORGate ({ x, y } = {}) {
    const ORGate = document.createElement('or-gate')

    if (x && y) {
      ORGate.setAttribute('x', x)
      ORGate.setAttribute('y', y)
    }

    this.appendChild(ORGate)
    return ORGate
  }

  addNORGate ({ x, y } = {}) {
    const NORGate = document.createElement('nor-gate')

    if (x && y) {
      NORGate.setAttribute('x', x)
      NORGate.setAttribute('y', y)
    }

    this.appendChild(NORGate)
    return NORGate
  }

  addXORGate ({ x, y } = {}) {
    const XORGate = document.createElement('xor-gate')

    if (x && y) {
      XORGate.setAttribute('x', x)
      XORGate.setAttribute('y', y)
    }

    this.appendChild(XORGate)
    return XORGate
  }

  addNANDGate ({ x, y } = {}) {
    const NANDGate = document.createElement('nand-gate')

    if (x && y) {
      NANDGate.setAttribute('x', x)
      NANDGate.setAttribute('y', y)
    }

    this.appendChild(NANDGate)
    return NANDGate
  }

  addHalfAdder ({ x, y } = {}) {
    const halfAdder = document.createElement('half-adder')

    if (x && y) {
      halfAdder.setAttribute('x', x)
      halfAdder.setAttribute('y', y)
    }

    this.appendChild(halfAdder)
    return halfAdder
  }

  addComponent (name, { x, y} = { x: 50, y: 50 }) {
    const component = document.createElement(name)
    component.setAttribute('x', x)
    component.setAttribute('y', y)
    this.appendChild(component)
    return component
  }

  get parentXOffset () {
    return window.pageXOffset + this.parentElement.getBoundingClientRect().left
  }

  get parentYOffset () {
    return window.pageYOffset + this.parentElement.getBoundingClientRect().top
  }

  handleIntersections (movedEnd, xOffset, yOffset, isFromDrag) {
    if (!this.svg.createSVGRect) return []
    const movedWire = movedEnd.parentComponent
    const circleCapRadius = movedWire.constructor.CIRCLE_CAP_RADIUS
    const strokeWidth = movedWire.constructor.STROKE_WIDTH
    const svg = this.svg
    const mousePosition = svg.createSVGRect()
    mousePosition.x = window.pageXOffset + xOffset - (strokeWidth / 2) - circleCapRadius
    mousePosition.y = window.pageYOffset + yOffset - (strokeWidth / 2) - circleCapRadius
    mousePosition.width = (circleCapRadius * 2 + strokeWidth) * this.scale * 1.25
    mousePosition.height = (circleCapRadius * 2 + strokeWidth) * this.scale * 1.25

    if (false && isFromDrag) { // for visually debugging overlap checks
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
    const throwSwitchesToConnect = this.querySelectorAll(`throw-switch#${coilComponent.attributes.for.value}`)
    switchesToConnect.forEach(switchComp => coilComponent.connectSwitch(switchComp))
    throwSwitchesToConnect.forEach(switchComp => coilComponent.connectSwitch(switchComp))
  }
}

window.customElements.define('component-container', ComponentContainer)

export default ComponentContainer
