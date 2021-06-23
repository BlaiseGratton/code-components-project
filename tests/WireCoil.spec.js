import * as components from '../components/index.js'

const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn()

it('renders', () => {
  document.body.innerHTML = '<component-container></component-container>'
  const container = document.querySelector('component-container')
  const wireCoil = container.addWireCoil()
  expect(wireCoil).not.toBeNull()
  const queriedWireCoil = document.querySelector('wire-coil')
  expect(queriedWireCoil).toBe(wireCoil)
})

describe('closing and opening a switch with a wire coil', () => {
  document.body.innerHTML = '<component-container no-ui></component-container>'
  const container = document.querySelector('component-container')
  const swich1 = container.addSwitch()
  const swich2 = container.addSwitch()
  const powerSource1 = container.addPowerSource()
  const powerSource2 = container.addPowerSource()
  const ground1 = container.addGround()
  const ground2 = container.addGround()
  const wire1 = container.addWireSegment()
  const wire2 = container.addWireSegment()
  const wire3 = container.addWireSegment()
  const wire4 = container.addWireSegment()
  const wire5 = container.addWireSegment()
  const wire6 = container.addWireSegment()
  const bulb = container.addBulb()
  const wireCoil = container.addWireCoil()

  powerSource1.connect(wire1)
  wire1.connect(swich1.wire1)
  swich1.wire2.connect(wire2)
  wire2.connect(bulb)
  bulb.connect(wire3)
  wire3.connect(ground1)

  powerSource2.connect(wire4)
  wire4.connect(wireCoil)
  wireCoil.connect(wire5)
  wire5.connect(swich2.wire1)
  swich2.wire2.connect(wire6)
  wire6.connect(ground2)
  wireCoil.connectSwitch(swich1)

  expect(bulb.isLit).toBe(false)
  expect(wireCoil.isPowered).toBe(true)
  expect(wireCoil.isGrounded).toBe(false)
  swich2.close()
  expect(wireCoil.isGrounded).toBe(true)
  expect(bulb.isLit).toBe(true)

  swich2.open()
  expect(swich2.wire2.isGrounded).toBe(true)
  expect(swich2.wire2.isPowered).toBe(false)
  expect(swich2.wire1.isGrounded).toBe(false)
  expect(swich2.wire1.isPowered).toBe(true)
  expect(wireCoil.isGrounded).toBe(false)
  expect(bulb.isLit).toBe(false)
})
