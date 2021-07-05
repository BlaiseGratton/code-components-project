import * as components from '../../components'

const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn()


describe('AND gate component behavior', () => {
  it('only lets current out when both inputs are lit', () => {
    
    document.body.innerHTML = `
      <component-container id="container-1" width="400" height="400" no-ui>
      </component-container>
    `
    const container = document.querySelector('component-container#container-1')
    const ANDGate = container.addANDGate()
    expect(ANDGate).not.toBeNull()
    expect(ANDGate.outputWire.isPowered).toBeFalsy()

    expect(ANDGate.relay1.wire1.isPowered).toBeTruthy()
    expect(ANDGate.relay1.wire2.isPowered).toBeFalsy()
    expect(ANDGate.inputWire1.isPowered).toBeFalsy()
    expect(ANDGate.relay1.switch.isOpen).toBeTruthy()
    const power1 = container.addPowerSource()
    const wire1 = power1.addWireSegment()
    wire1.connect(ANDGate.inputWire1)
    expect(ANDGate.inputWire1.isPowered).toBeTruthy()
    expect(ANDGate.relay1.switch.isClosed).toBeTruthy()
    expect(ANDGate.relay1.wire2.isPowered).toBeTruthy()
    expect(ANDGate.wire1.isPowered).toBeTruthy()
    expect(ANDGate.wire2.isPowered).toBeTruthy()
    expect(ANDGate.relay2.wire1.isPowered).toBeTruthy()
    expect(ANDGate.outputWire.isPowered).toBeFalsy()

    expect(ANDGate.inputWire2.isPowered).toBeFalsy()
    expect(ANDGate.relay2.switch.isOpen).toBeTruthy()
    const power2 = container.addPowerSource()
    const wire2 = power2.addWireSegment()
    wire2.connect(ANDGate.inputWire2)
    expect(ANDGate.inputWire2.isPowered).toBeTruthy()
    expect(ANDGate.relay2.switch.isOpen).toBeFalsy()
    expect(ANDGate.outputWire.isPowered).toBeTruthy()

    // break the connection, outputWire should be off
    wire1.disconnect(ANDGate.inputWire1)
    expect(ANDGate.outputWire.isPowered).toBeFalsy()
    wire1.connect(ANDGate.inputWire1)
    expect(ANDGate.outputWire.isPowered).toBeTruthy()

    wire2.disconnect(ANDGate.inputWire2)
    expect(ANDGate.outputWire.isPowered).toBeFalsy()
    wire2.connect(ANDGate.inputWire2)
    expect(ANDGate.outputWire.isPowered).toBeTruthy()
  })
})
