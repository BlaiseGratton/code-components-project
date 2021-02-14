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

  wire1.isPowered = true
  expect(wire1.isPowered).toBe(true)
  expect(wire2.isPowered).toBe(true)
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
  expect(wire1.isPowered).toBe(true)
  expect(wire2.isPowered).toBe(true)
  expect(wire3.isPowered).toBe(true)

  wire1.disconnect(powerSource)
  expect(wire1.isPowered).toBe(false)
  expect(wire2.isPowered).toBe(false)
  expect(wire3.isPowered).toBe(false)
})
