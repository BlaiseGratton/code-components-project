import * as components from '../components/index.js'

describe('properties of a simple bulb', () => {
  it('renders', () => {
    document.body.innerHTML = '<component-container></component-container>'
    const container = document.querySelector('component-container')
    let foundBulb = document.querySelector('simple-bulb')
    expect(foundBulb).toBeNull()

    const bulb = container.addBulb()
    foundBulb = document.querySelector('simple-bulb')
    expect(bulb).not.toBeNull()
    expect(bulb).toBe(foundBulb)
  })

  it('has an `isLit` property', () => {
    document.body.innerHTML = '<component-container></component-container>'
    const container = document.querySelector('component-container')
    const bulb = container.addBulb()
    expect(bulb.isLit).toBe(false)
  })

  it('can connect to other components just like wires', () => {
    document.body.innerHTML = '<component-container></component-container>'
    const container = document.querySelector('component-container')
    const bulb = container.addBulb()
    const wire1 = container.addWireSegment({}, 1)
    const wire2 = container.addWireSegment({}, 2)
    wire1.connect(bulb)
    bulb.connect(wire2)

    expect(bulb.connectedComponents).toEqual([wire1, wire2])
    expect(wire1.connectedComponents).toStrictEqual([bulb])
    expect(wire2.connectedComponents).toStrictEqual([bulb])
  })
})
