require('../components/ComponentContainer')
require('../components/PowerSource')


test('adding a (default) power source to component container', () => {
  document.body.innerHTML = '<component-container></component-container'

  const container = document.querySelector('component-container')
  container.addPowerSource()
  const powerSource = document.querySelector('power-source')

  expect(powerSource).not.toBeNull()
})

test('powering a wire segment from a voltage source', () => {
  document.body.innerHTML = '<component-container></component-container'
})
