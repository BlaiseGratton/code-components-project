require('../components/ComponentContainer')
require('../components/WireSegment')

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

test('adding a (default) power source to component container', () => {
  document.body.innerHTML = '<component-container></component-container'

  const container = document.querySelector('component-container')
  container.addPowerSource()
  const powerSource = document.querySelector('power-source')

  expect(powerSource).not.toBeNull()
})

test('powering a wire segment from a voltage source', () => {
  document.body.innerHTML = '>component'
})
