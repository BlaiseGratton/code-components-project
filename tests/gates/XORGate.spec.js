import * as components from '../../components'

const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn()


describe('XOR gate component behavior', () => {
  it('lets current out when only one input is powered', () => {
    
    document.body.innerHTML = `
      <component-container id="container-1" width="400" height="400" no-ui>
      </component-container>
    `
    const container = document.querySelector('component-container#container-1')
    const XORGate = container.addXORGate()
    expect(XORGate).not.toBeNull()
    expect(XORGate.outputWire.isPowered).toBeFalsy()
    expect(XORGate.ORGate.inputWire1.isPowered).toBeFalsy()
    expect(XORGate.ORGate.inputWire2.isPowered).toBeFalsy()
    expect(XORGate.NANDGate.inputWire1.isPowered).toBeFalsy()
    expect(XORGate.NANDGate.inputWire2.isPowered).toBeFalsy()
    expect(XORGate.NANDGate.outputWire.isPowered).toBeTruthy()
    expect(XORGate.ANDGate.inputWire1.isPowered).toBeFalsy()
    expect(XORGate.ANDGate.inputWire2.isPowered).toBeTruthy()

    const power1 = container.addPowerSource()
    const wire1 = power1.addWireSegment()
    wire1.connect(XORGate.inputWire1)
    expect(XORGate.ORGate.inputWire1.isPowered).toBeTruthy()
    expect(XORGate.ORGate.outputWire.isPowered).toBeTruthy()
    expect(XORGate.ANDGate.inputWire1.isPowered).toBeTruthy()
    expect(XORGate.outputWire.isPowered).toBeTruthy()
    expect(XORGate.NANDGate.outputWire.isPowered).toBeTruthy()
    wire1.disconnect(XORGate.inputWire1)
    expect(XORGate.NANDGate.outputWire.isPowered).toBeTruthy()
    expect(XORGate.ORGate.inputWire1.isPowered).toBeFalsy()
    expect(XORGate.ANDGate.inputWire1.isPowered).toBeFalsy()
    expect(XORGate.outputWire.isPowered).toBeFalsy()

    const power2 = container.addPowerSource()
    const wire2 = power1.addWireSegment()
    wire2.connect(XORGate.inputWire2)
    expect(XORGate.NANDGate.outputWire.isPowered).toBeTruthy()
    expect(XORGate.ORGate.inputWire1.isPowered).toBeFalsy()
    expect(XORGate.ORGate.inputWire2.isPowered).toBeTruthy()
    expect(XORGate.ORGate.outputWire.isPowered).toBeTruthy()
    expect(XORGate.ANDGate.inputWire1.isPowered).toBeTruthy()
    expect(XORGate.outputWire.isPowered).toBeTruthy()
    wire2.disconnect(XORGate.inputWire2)
    expect(XORGate.outputWire.isPowered).toBeFalsy()

    wire2.connect(XORGate.inputWire2)
    expect(XORGate.outputWire.isPowered).toBeTruthy()
    wire1.connect(XORGate.inputWire1)
    expect(XORGate.NANDGate.outputWire.isPowered).toBeFalsy()
    expect(XORGate.outputWire.isPowered).toBeFalsy()
    wire1.disconnect(XORGate.inputWire1)
    expect(XORGate.outputWire.isPowered).toBeTruthy()
  })
})
