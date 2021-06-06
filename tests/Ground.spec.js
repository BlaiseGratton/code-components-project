require('../components/ComponentContainer')
require('../components/Ground')
require('../components/WireSegment')


test('adding a (default) ground point to component container', () => {
  document.body.innerHTML = '<component-container></component-container>'

  const container = document.querySelector('component-container')
  const returnedComponent = container.addGround()
  const ground = document.querySelector('ground-connection')

  expect(ground).not.toBeFalsy()
  expect(ground).toBe(returnedComponent)
  expect(ground.isGrounded).toBe(true)
  expect(ground.isPowered).toBe(false)
})

test('grounding a wire segment', () => {
  document.body.innerHTML = '<component-container></component-container>'

  const container = document.querySelector('component-container')
  const ground = container.addGround()
  const wireSegment = ground.addWireSegment()

  expect(wireSegment).not.toBeFalsy()
  expect(wireSegment.isPowered).toBe(false)
  expect(wireSegment.isGrounded).toBe(true)
})

test('disconnecting a wire segment from ground', () => {
  document.body.innerHTML = '<component-container></component-container>'

  const container = document.querySelector('component-container')
  const ground = container.addGround()
  const wireSegment = ground.addWireSegment()
  expect(wireSegment.isPowered).toBe(false)
  expect(wireSegment.isGrounded).toBe(true)
  wireSegment.disconnect(ground)

  expect(wireSegment.isGrounded).toBe(false)

  wireSegment.connect(ground)
  expect(wireSegment.isGrounded).toBe(true)
  expect(ground.isGrounded).toBe(true)
})
