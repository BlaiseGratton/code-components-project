require('../components/ComponentContainer')
require('../components/WireSegment')
require('../components/PowerSource')


const segmentString = `
  <component-container>
    <wire-segment x1="0" y1="10" x2="20" y2="30"></wire-segment>
  </component-container>
`

test('getting segment attributes in JavaScript', () => {
  document.body.innerHTML = segmentString

  const segment = document.querySelector('wire-segment')

  expect(segment.x1).toEqual(0)
  expect(segment.y1).toEqual(10)
  expect(segment.x2).toEqual(20)
  expect(segment.y2).toEqual(30)
})

test('setting segment attributes via HTMLElement', () => {
  document.body.innerHTML = segmentString

  const segment = document.querySelector('wire-segment')
  expect(segment.x1).toEqual(0)
  segment.x1 = 5

  expect(segment.x1).toEqual(5)
  expect(segment.y1).toEqual(10)
  expect(segment.x2).toEqual(20)
  expect(segment.y2).toEqual(30)
})

test('adding a (default) wire segment to component container', () => {
  document.body.innerHTML = '<component-container></component-container'
  const container = document.querySelector('component-container')

  const seg = container.addWireSegment()
  const segment = document.querySelector('wire-segment')

  expect(segment).not.toBeNull()
  expect(segment.x1).toEqual(0)
  expect(segment.y1).toEqual(0)
  expect(segment.x2).toEqual(20)
  expect(segment.y2).toEqual(20)
})

test('adding a specific wire segment to component container', () => {
  document.body.innerHTML = '<component-container></component-container'

  const container = document.querySelector('component-container')
  const seg = container.addWireSegment({ x1: 50, y1: 60, x2: 70, y2: 80 })
  const segment = document.querySelector('wire-segment')

  expect(segment).not.toBeNull()
  expect(segment.x1).toEqual(50)
  expect(segment.y1).toEqual(60)
  expect(segment.x2).toEqual(70)
  expect(segment.y2).toEqual(80)
})

test('wire segments by default are not powered', () => {
  document.body.innerHTML = '<component-container></component-container'
  const container = document.querySelector('component-container')

  const segment = container.addWireSegment()

  expect(segment.isPowered).toBe(false)
})

test('connecting a wire segment to another segment', () => {
  document.body.innerHTML = '<component-container></component-container'
  const container = document.querySelector('component-container')
  const wire1 = container.addWireSegment()
  const wire2 = container.addWireSegment()
  wire1.connect(wire2)
 
  expect(wire1.isPowered).toBe(false)
  expect(wire2.isPowered).toBe(false)

  // can't set isPowered willy nilly right now, need a power source
  wire1.isPowered = true
  expect(wire1.isPowered).toBe(false)
  expect(wire2.isPowered).toBe(false)
})

test('connecting multiple segments to a power source', () => {
  document.body.innerHTML = '<component-container></component-container'
  const container = document.querySelector('component-container')
  const wire1 = container.addWireSegment()
  const wire2 = container.addWireSegment()
  const wire3 = container.addWireSegment()
  wire2.connect(wire3)
  wire1.connect(wire2)

  expect(wire1.isPowered).toBe(false)
  expect(wire2.isPowered).toBe(false)
  expect(wire3.isPowered).toBe(false)

  const powerSource = container.addPowerSource()
  wire1.connect(powerSource)
  expect(powerSource.isPowered).toBe(true)
  expect(wire1.isPowered).toBe(true)
  expect(wire2.isPowered).toBe(true)
  expect(wire3.isPowered).toBe(true)
  // verify poweredBy chain
  expect(powerSource.poweredBy).toEqual([powerSource.ALWAYS_POWERED])
  expect(wire1.poweredBy).toEqual([powerSource])
  expect(wire2.poweredBy).toEqual([wire1])
  expect(wire3.poweredBy).toEqual([wire2])

  wire1.disconnect(powerSource)
  expect(powerSource.isPowered).toBe(true)
  expect(wire1.isPowered).toBe(false)
  expect(wire2.isPowered).toBe(false)
  expect(wire3.isPowered).toBe(false)
  expect(wire1.poweredBy).toEqual([])
  expect(wire2.poweredBy).toEqual([])
  expect(wire3.poweredBy).toEqual([])

  powerSource.connect(wire1)
  expect(wire1.isPowered).toBe(true)
  expect(wire2.isPowered).toBe(true)
  expect(wire3.isPowered).toBe(true)

  powerSource.disconnect(wire1)
  expect(powerSource.isPowered).toBe(true)
  expect(wire1.isPowered).toBe(false)
  expect(wire2.isPowered).toBe(false)
  expect(wire3.isPowered).toBe(false)

  wire3.connect(powerSource)
  expect(wire1.isPowered).toBe(true)
  expect(wire2.isPowered).toBe(true)
  expect(wire3.isPowered).toBe(true)
  expect(wire3.poweredBy).toEqual([powerSource])
  expect(wire2.poweredBy).toEqual([wire3])
  expect(wire1.poweredBy).toEqual([wire2])

  wire3.disconnect(powerSource)
  expect(powerSource.isPowered).toBe(true)
  expect(wire1.isPowered).toBe(false)
  expect(wire2.isPowered).toBe(false)
  expect(wire3.isPowered).toBe(false)
})

test('making a wire loop and connecting it to power', () => {
  document.body.innerHTML = '<component-container></component-container'
  const container = document.querySelector('component-container')
  const wire1 = container.addWireSegment()
  const wire2 = container.addWireSegment()
  const wire3 = container.addWireSegment()
  const wire4 = container.addWireSegment()
  const wire5 = container.addWireSegment()
  const wire6 = container.addWireSegment()
  wire1.connect(wire2)
  wire2.connect(wire3)
  wire3.connect(wire4)
  wire4.connect(wire5)
  wire5.connect(wire6)
  wire6.connect(wire3)
  const wires = [wire1, wire2, wire3, wire4, wire5, wire6]
  const wireIsPowered = wire => wire.isPowered

  const powerSource = container.addPowerSource()
  expect(wires.every(wireIsPowered)).toBe(false)

  wire1.connect(powerSource)
  expect(wires.every(wireIsPowered)).toBe(true)
  expect(wire1.poweredBy).toEqual([powerSource])
  expect(wire2.poweredBy).toEqual([wire1])
  expect(wire3.poweredBy).toEqual([wire2])
  expect(wire4.poweredBy).toEqual([wire3])
  expect(wire5.poweredBy).toEqual([wire4])
  expect(wire6.poweredBy).toEqual([wire5])
  expect(wire6.connectedComponents).toEqual([wire5, wire3])

  wire1.disconnect(powerSource)
  expect(wires.every(wireIsPowered)).toBe(false)

  wire3.disconnect(wire4)
  wire1.connect(powerSource)
  expect(wires.every(wireIsPowered)).toBe(true)
  wire3.connect(wire4)
  expect(wires.every(wireIsPowered)).toBe(true)
  wire3.disconnect(wire4)
  expect(wires.every(wireIsPowered)).toBe(true)

  wire1.disconnect(powerSource)
  expect(wires.every(wireIsPowered)).toBe(false)
  wire2.disconnect(wire3)
  wire3.connect(powerSource)
  expect([wire1, wire2].every(wireIsPowered)).toBe(false)
  expect([wire3, wire4, wire5, wire6].every(wireIsPowered)).toBe(true)
  expect(wire3.poweredBy).toEqual([powerSource])
  expect(wire4.poweredBy).toEqual([wire5])
  expect(wire5.poweredBy).toEqual([wire6])
  expect(wire6.poweredBy).toEqual([wire3])
})

test('breaking a wire loop connected to power', () => {
  document.body.innerHTML = '<component-container></component-container'
  const container = document.querySelector('component-container')
  const powerSource = container.addPowerSource()
  const wire1 = container.addWireSegment()
  const wire2 = container.addWireSegment()
  const wire3 = container.addWireSegment()
  const wire4 = container.addWireSegment()
  const wire5 = container.addWireSegment()
  const wire6 = container.addWireSegment()
  const wire7 = container.addWireSegment()
  const wire8 = container.addWireSegment()
  wire1.connect(wire2)
  wire2.connect(wire3)
  wire3.connect(wire4)
  wire2.connect(wire5)
  wire5.connect(wire6)
  wire6.connect(wire7)
  wire7.connect(wire8)
  wire4.connect(wire7)
  const wires = [wire1, wire2, wire3, wire4, wire5, wire6, wire7, wire8]
  const wireIsPowered = wire => wire.isPowered

  expect(wires.every(wireIsPowered)).toBe(false)
  powerSource.connect(wire1)
  expect(wires.every(wireIsPowered)).toBe(true)
  expect(wire1.poweredBy).toEqual([powerSource])
  expect(wire2.poweredBy).toEqual([wire1])
  expect(wire3.poweredBy).toEqual([wire2])
  expect(wire4.poweredBy).toEqual([wire3])
  expect(wire5.poweredBy).toEqual([wire6])
  expect(wire6.poweredBy).toEqual([wire7])
  expect(wire7.poweredBy).toEqual([wire4])
  expect(wire8.poweredBy).toEqual([wire7])

  expect(wire5.connectedComponents).toEqual([wire2, wire6])
  wire5.disconnect(wire6)
  expect(wire5.connectedComponents).toEqual([wire2])
  expect(wire5.isPowered).toBe(true)
  expect(wire5.poweredBy).toEqual([wire2])
  expect(wires.every(wireIsPowered)).toBe(true)

  wire3.disconnect(wire4)
  expect([wire1, wire2, wire3, wire5].every(wireIsPowered)).toBe(true)
  expect([wire4, wire6, wire7, wire8].every(wireIsPowered)).toBe(false)
  wire5.connect(wire6)
  expect(wires.every(wireIsPowered)).toBe(true)
})
