import * as components from '../components/index.js'


const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn()


describe('rendering a relay component', () => {

  it('renders', () => {
    document.body.innerHTML =
      '<component-container><simple-relay></simple-relay></component-container>'

    const container = document.querySelector('component-container')
    const foundRelay = document.querySelector('simple-relay')
    expect(foundRelay).not.toBeNull()
  })
})

describe('relay component behavior', () => {

  it('closes the switch when current is applied to wire 3', () => {
    document.body.innerHTML = `
      <component-container id="container-1" width="400" height="400" no-ui>
      </component-container>
    `
    const container = document.querySelector('component-container#container-1')
    const relay = container.addRelay()
    expect(relay).not.toBeNull()
    expect(relay.switch).not.toBeNull()
    expect(relay.switch.wire1).not.toBeNull()
    expect(relay.switch.wire2).not.toBeNull()
    expect(relay.switch.isOpen).toBeTruthy()
    expect(relay.coil.isPowered).toBe(false)
    expect(relay.coil.isGrounded).toBe(true)

    const power = container.addPowerSource()
    power.connect(relay.outerWire3)
    expect(relay.coil.isPowered).toBe(true)
    expect(relay.switch.isClosed).toBe(true)
  })

  it('closes a circuit running through it', () => {
    document.body.innerHTML = `
      <component-container width="400" height="400"></component-container>
    `
    const container = document.querySelector('component-container')
    const ground = container.addGround()
    const power1 = container.addPowerSource()
    const power2 = container.addPowerSource()
    const bulb = container.addBulb()
    const wire1 = container.addWireSegment()
    const relay = container.addRelay({ x: 200, y: 200 })

    expect(relay.outerWire1).not.toBeNull()
    expect(relay.outerWire2).not.toBeNull()
    expect(relay.outerWire3).not.toBeNull()
    relay.outerWire2.connect(bulb)
    bulb.connect(ground)
    relay.outerWire1.connect(power1)
    expect(bulb.isLit).toBe(false)

    power2.connect(relay.outerWire3)
    expect(bulb.isLit).toBe(true)
  })

  it('relays a current through a chain of relays (page 109 of Code)', () => {

    document.body.innerHTML = `
      <component-container width="400" height="400">
      </component-container>
    `
    const container = document.querySelector('component-container')
    const ground = container.addGround()
    const power1 = container.addPowerSource()
    const power2 = container.addPowerSource()
    const power3 = container.addPowerSource()
    const bulb = container.addBulb()
    const wire1 = container.addWireSegment()
    const wire2 = container.addWireSegment()
    const relay1 = container.addRelay({ x: 20, y: 20 })
    const relay2 = container.addRelay({ x: 220, y: 220 })

    relay1.outerWire2.connect(relay2.outerWire3)
    power1.connect(relay1.outerWire1)
    power2.connect(relay2.outerWire1)
    bulb.connect(relay2.outerWire2)
    bulb.connect(ground)

    expect(relay1.switch.isOpen).toBe(true)
    expect(relay2.switch.isOpen).toBe(true)
    expect(bulb.isLit).toBe(false)
    power3.connect(relay1.outerWire3)
    expect(relay1.switch.isOpen).toBe(false)
    expect(relay2.switch.isOpen).toBe(false)
    expect(bulb.isLit).toBe(true)
    power3.disconnect(relay1.outerWire3)
    expect(relay1.switch.isOpen).toBe(true)
    expect(relay2.switch.isOpen).toBe(true)
    expect(bulb.isLit).toBe(false)
  })

  it('functions as a logical AND gate (page 112 of Code)', () => {

    document.body.innerHTML = `
      <component-container width="400" height="400">
      </component-container>
    `
    const container = document.querySelector('component-container')
    const ground = container.addGround()
    const power1 = container.addPowerSource()
    const power2 = container.addPowerSource()
    const power3 = container.addPowerSource()
    const bulb = container.addBulb()
    const wire1 = container.addWireSegment()
    const wire2 = container.addWireSegment()
    const relay1 = container.addRelay({ x: 20, y: 20 })
    const relay2 = container.addRelay({ x: 220, y: 220 })

    relay1.outerWire2.connect(relay2.outerWire1)
    power1.connect(relay1.outerWire1)
    power2.connect(relay2.outerWire3)
    bulb.connect(relay2.outerWire2)
    bulb.connect(ground)

    expect(relay1.switch.isOpen).toBe(true)
    expect(relay2.switch.isOpen).toBe(false)
    expect(bulb.isLit).toBe(false)

    power3.connect(relay1.outerWire3)
    expect(relay1.switch.isOpen).toBe(false)
    expect(relay2.switch.isOpen).toBe(false)
    expect(bulb.isLit).toBe(true)

    power3.disconnect(relay1.outerWire3)
    expect(relay1.switch.isOpen).toBe(true)
    expect(relay2.switch.isOpen).toBe(false)
    expect(bulb.isLit).toBe(false)

    power2.disconnect(relay2.outerWire3)
    expect(relay1.switch.isOpen).toBe(true)
    expect(relay2.switch.isOpen).toBe(true)
    expect(bulb.isLit).toBe(false)

    power3.connect(relay1.outerWire3)
    expect(relay1.switch.isOpen).toBe(false)
    expect(relay2.switch.isOpen).toBe(true)
    expect(bulb.isLit).toBe(false)

    power2.connect(relay2.outerWire3)
    expect(relay1.switch.isOpen).toBe(false)
    expect(relay2.switch.isOpen).toBe(false)
    expect(bulb.isLit).toBe(true)
  })
})
