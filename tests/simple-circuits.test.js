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
