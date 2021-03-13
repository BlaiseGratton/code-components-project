require('../components/')

it('renders', () => {
  document.body.innerHTML = '<component-container></component-container>'
  const container = document.querySelector('component-container')
  const swhich = container.addSwitch()
  expect(swhich).not.toBeNull()
  const queriedSwitch = document.querySelector('simple-switch')
  expect(queriedSwitch).toBe(swhich)
})

describe('opening and closing a switch', () => {
  it('completes a circuit when closed', () => {
    document.body.innerHTML = '<component-container></component-container>'
    const container = document.querySelector('component-container')
    const swhich = container.addSwitch()
    const powerSource = container.addPowerSource()
    const ground = container.addGround()
    const wire1 = container.addWireSegment()
    const wire2 = container.addWireSegment()
    const wire3 = container.addWireSegment()
    const bulb = container.addBulb()
    
    powerSource.connect(wire1)
    wire1.connect(swhich.wire1)
    swhich.wire2.connect(wire2)
    wire2.connect(bulb)
    bulb.connect(wire3)
    wire3.connect(ground)

    expect(wire1.isPowered).toBe(true)
    expect(wire1.isGrounded).toBe(false)
    expect(swhich.wire1.isPowered).toBe(true)
    expect(swhich.wire1.isGrounded).toBe(false)
    expect(swhich.wire2.isPowered).toBe(false)
    expect(swhich.wire2.isGrounded).toBe(true)
    expect(bulb.isPowered).toBe(false)
    expect(bulb.isGrounded).toBe(true)
    expect(bulb.isLit).toBe(false)
    swhich.close()
    expect(bulb.isLit).toBe(true)
    swhich.open()
    expect(bulb.isLit).toBe(false)
  })
})
