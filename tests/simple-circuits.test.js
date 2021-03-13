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

test('a simple AND gate circuit', () => {
  document.body.innerHTML = '<component-container></component-container>'
  const container = document.querySelector('component-container')
  const switch1 = container.addSwitch()
  const switch2 = container.addSwitch()
  const switch3 = container.addSwitch()
  const switch4 = container.addSwitch()
  const powerSource1 = container.addPowerSource()
  const powerSource2 = container.addPowerSource()
  const powerSource3 = container.addPowerSource()
  const ground1 = container.addGround()
  const ground2 = container.addGround()
  const ground3 = container.addGround()
  const wire1 = container.addWireSegment()
  const wire2 = container.addWireSegment()
  const wire3 = container.addWireSegment()
  const wire4 = container.addWireSegment()
  const wire5 = container.addWireSegment()
  const wire6 = container.addWireSegment()
  const bulb = container.addBulb()
  const wireCoil1 = container.addWireCoil()
  const wireCoil2 = container.addWireCoil()

  // two switches and bulb circuit
  powerSource1.connect(switch1.wire1)
  switch1.wire2.connect(switch2.wire1)
  switch2.wire2.connect(bulb)
  bulb.connect(ground1)

  // relay for first switch
  powerSource2.connect(switch3.wire1)
  switch3.wire2.connect(wireCoil1)
  wireCoil1.connect(ground2)
  wireCoil1.connectSwitch(switch1)

  // relay for second switch
  powerSource3.connect(switch4.wire1)
  switch4.wire2.connect(wireCoil2)
  wireCoil2.connect(ground3)
  wireCoil2.connectSwitch(switch2)

  expect(bulb.isLit).toBe(false)
  switch3.close()
  expect(bulb.isLit).toBe(false)
  switch4.close()
  expect(bulb.isLit).toBe(true)
  switch4.open()
  expect(bulb.isLit).toBe(false)
  switch4.close()
  expect(bulb.isLit).toBe(true)
  switch3.open()
  expect(bulb.isLit).toBe(false)
})
