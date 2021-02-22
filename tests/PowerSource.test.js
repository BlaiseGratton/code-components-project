require('../components/ComponentContainer')
require('../components/PowerSource')


test('adding a (default) power source to component container', () => {
  document.body.innerHTML = '<component-container></component-container>'

  const container = document.querySelector('component-container')
  const returnedComponent = container.addPowerSource()
  const powerSource = document.querySelector('power-source')

  expect(powerSource).not.toBeFalsy()
  expect(powerSource).toBe(returnedComponent)
  expect(powerSource.isPowered).toBe(true)
})

test('powering a wire segment from a voltage source', () => {
  document.body.innerHTML = '<component-container></component-container>'

  const container = document.querySelector('component-container')
  const powerSource = container.addPowerSource()
  const wireSegment = powerSource.addWireSegment()

  expect(wireSegment).not.toBeFalsy()
  expect(wireSegment.isPowered).toBe(true)
})

test('disconnecting a wire segment from a voltage source', () => {
  document.body.innerHTML = '<component-container></component-container>'

  const container = document.querySelector('component-container')
  const powerSource = container.addPowerSource()
  const wireSegment = powerSource.addWireSegment()
  expect(wireSegment.isPowered).toBe(true)
  wireSegment.disconnect(powerSource)

  expect(wireSegment.isPowered).toBe(false)

  wireSegment.connect(powerSource)
  expect(wireSegment.isPowered).toBe(true)
  expect(powerSource.isPowered).toBe(true)
})

