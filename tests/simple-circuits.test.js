require('../components/')


const isPowered = wire => wire.isPowered
const isGrounded = wire => wire.isGrounded

test('connecting wire segments to power and ground', () => {
  document.body.innerHTML = '<component-container></component-container>'
  const container = document.querySelector('component-container')

  const wire1 = container.addWireSegment()
  const wire2 = container.addWireSegment()
  const wire3 = container.addWireSegment()
  const wires = [wire1, wire2, wire3]
  const powerSource = container.addPowerSource()
  const ground = container.addGround()
  wire1.connect(wire2)
  wire2.connect(wire3)

  expect(wires.every(isPowered)).toBe(false)
  expect(wires.every(isGrounded)).toBe(false)

  wire1.connect(powerSource)
  expect(wires.every(isPowered)).toBe(true)
  expect(wires.every(isGrounded)).toBe(false)

  wire3.connect(ground)
  expect(wires.every(isPowered)).toBe(true)
  expect(wires.every(isGrounded)).toBe(true)

  wire3.disconnect(ground)
  expect(wires.every(isPowered)).toBe(true)
  expect(wires.every(isGrounded)).toBe(false)

  ground.connect(wire3)
  expect(wires.every(isPowered)).toBe(true)
  expect(wires.every(isGrounded)).toBe(true)

  powerSource.disconnect(wire1)
  expect(wires.every(isPowered)).toBe(false)
  expect(wires.every(isGrounded)).toBe(true)

  wire3.disconnect(ground)
  expect(wires.every(isPowered)).toBe(false)
  expect(wires.every(isGrounded)).toBe(false)
})

test('lighting up a bulb', () => {
  document.body.innerHTML = '<component-container></component-container>'
  const container = document.querySelector('component-container')
  const wire1 = container.addWireSegment({}, 1)
  const wire2 = container.addWireSegment({}, 2)
  const wire3 = container.addWireSegment({}, 3)
  const wires = [wire1, wire2, wire3]
  const powerSource = container.addPowerSource()
  const ground = container.addGround()
  const bulb = container.addBulb()
  wire1.connect(wire2)
  wire2.connect(bulb)
  bulb.connect(wire3)
  expect(bulb.isLit).toBe(false)
  wire1.connect(powerSource)
  expect(bulb.isLit).toBe(false)
  wire3.connect(ground)
  expect(bulb.isLit).toBe(true)
  ground.disconnect(wire3)
  expect(bulb.isLit).toBe(false)
  ground.connect(wire3)
  expect(bulb.isLit).toBe(true)
  wire1.disconnect(powerSource)
  expect(bulb.isLit).toBe(false)
  powerSource.connect(wire2)
  expect(bulb.isLit).toBe(true)
  expect(wires.every(w => w.isPowered)).toBeTruthy()
  expect(wires.every(w => w.isGrounded)).toBeTruthy()
})
