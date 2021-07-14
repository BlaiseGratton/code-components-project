import * as components from '../../components'

const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn()


describe('NOR gate component behavior', () => {
  it('never lets current out when either input is lit', () => {
    
    document.body.innerHTML = `
      <component-container id="container-1" width="400" height="400" no-ui>
      </component-container>
    `
    const container = document.querySelector('component-container#container-1')
    const NORGate = container.addNORGate()
    expect(NORGate).not.toBeNull()
    expect(NORGate.relay1.wire1.isPowered).toBeTruthy()
    expect(NORGate.relay2.wire1.isPowered).toBeTruthy()
    expect(NORGate.relay2.switch.wire1.isPowered).toBeTruthy()
    expect(NORGate.relay2.switch.isPowered).toBeTruthy()
    expect(NORGate.relay2.switch.wire2.isPowered).toBeTruthy()
    expect(NORGate.relay2.wire2.isPowered).toBeTruthy()
    expect(NORGate.outputWire.isPowered).toBeTruthy()
    expect(NORGate.inputWire1.isPowered).toBeFalsy()
    expect(NORGate.relay1.switch.isClosed).toBeTruthy()
    expect(NORGate.relay2.switch.isClosed).toBeTruthy()

    const power1 = container.addPowerSource()
    const wire1 = power1.addWireSegment()
    wire1.connect(NORGate.inputWire1)
    expect(NORGate.inputWire1.isPowered).toBeTruthy()
    expect(NORGate.relay1.switch.isOpen).toBeTruthy()
    expect(NORGate.relay1.wire2.isPowered).toBeFalsy()
    expect(NORGate.wire1.isPowered).toBeFalsy()
    expect(NORGate.wire2.isPowered).toBeFalsy()
    expect(NORGate.relay2.wire1.isPowered).toBeFalsy()
    expect(NORGate.outputWire.isPowered).toBeFalsy()

    expect(NORGate.inputWire2.isPowered).toBeFalsy()
    expect(NORGate.relay2.switch.isOpen).toBeFalsy()
    const power2 = container.addPowerSource()
    const wire2 = power2.addWireSegment()
    wire2.connect(NORGate.inputWire2)
    expect(NORGate.inputWire2.isPowered).toBeTruthy()
    expect(NORGate.relay2.switch.isOpen).toBeTruthy()
    expect(NORGate.outputWire.isPowered).toBeFalsy()

    wire1.disconnect(NORGate.inputWire1)
    expect(NORGate.outputWire.isPowered).toBeFalsy()
    wire1.connect(NORGate.inputWire1)
    expect(NORGate.outputWire.isPowered).toBeFalsy()

    wire2.disconnect(NORGate.inputWire2)
    expect(NORGate.outputWire.isPowered).toBeFalsy()
    wire2.connect(NORGate.inputWire2)
    expect(NORGate.outputWire.isPowered).toBeFalsy()

    wire1.disconnect(NORGate.inputWire1)
    wire2.disconnect(NORGate.inputWire2)
    expect(NORGate.outputWire.isPowered).toBeTruthy()
  })
})
