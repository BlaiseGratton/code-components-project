import * as components from '../../components'

const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn()


describe('OR gate component behavior', () => {
  it('lets current out when either input is powered', () => {
    
    document.body.innerHTML = `
      <component-container id="container-1" width="400" height="400" no-ui>
      </component-container>
    `
    const container = document.querySelector('component-container#container-1')
    const ORGate = container.addORGate()
    expect(ORGate).not.toBeNull()
    expect(ORGate.outputWire.isPowered).toBeFalsy()

    expect(ORGate.relay1.wire1.isPowered).toBeTruthy()
    expect(ORGate.relay1.wire2.isPowered).toBeFalsy()
    expect(ORGate.inputWire1.isPowered).toBeFalsy()
    expect(ORGate.relay1.switch.isOpen).toBeTruthy()
    const power1 = container.addPowerSource()
    const wire1 = power1.addWireSegment()
    wire1.connect(ORGate.inputWire1)
    expect(ORGate.inputWire1.isPowered).toBeTruthy()
    expect(ORGate.relay1.switch.isClosed).toBeTruthy()
    expect(ORGate.relay1.wire2.isPowered).toBeTruthy()
    expect(ORGate.wire1.isPowered).toBeTruthy()
    expect(ORGate.wire2.isPowered).toBeTruthy()
    expect(ORGate.relay2.wire1.isPowered).toBeTruthy()
    expect(ORGate.outputWire.isPowered).toBeTruthy()
    wire1.disconnect(ORGate.inputWire1)

    expect(ORGate.inputWire2.isPowered).toBeFalsy()
    expect(ORGate.relay2.switch.isOpen).toBeTruthy()
    const power2 = container.addPowerSource()
    const wire2 = power2.addWireSegment()
    wire2.connect(ORGate.inputWire2)
    expect(ORGate.inputWire2.isPowered).toBeTruthy()
    expect(ORGate.relay2.switch.isOpen).toBeFalsy()
    expect(ORGate.outputWire.isPowered).toBeTruthy()

    wire1.connect(ORGate.inputWire1)
    expect(ORGate.outputWire.isPowered).toBeTruthy()
    wire1.disconnect(ORGate.inputWire1)
    expect(ORGate.outputWire.isPowered).toBeTruthy()

    wire2.disconnect(ORGate.inputWire2)
    expect(ORGate.outputWire.isPowered).toBeFalsy()
    wire2.connect(ORGate.inputWire2)
    expect(ORGate.outputWire.isPowered).toBeTruthy()
  })
})

