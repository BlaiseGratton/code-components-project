import * as components from '../../components'

const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn()


describe('NAND gate component behavior', () => {
  it('only stops letting current out when both inputs are powered', () => {
    
    document.body.innerHTML = `
      <component-container id="container-1" width="400" height="400" no-ui>
      </component-container>
    `
    const container = document.querySelector('component-container#container-1')
    const NANDGate = container.addNANDGate()
    expect(NANDGate).not.toBeNull()
    expect(NANDGate.outputWire.isPowered).toBeTruthy()

    expect(NANDGate.relay1.wire1.isPowered).toBeTruthy()
    expect(NANDGate.relay1.wire2.isPowered).toBeTruthy()
    expect(NANDGate.inputWire1.isPowered).toBeFalsy()
    expect(NANDGate.relay1.switch.isOpen).toBeFalsy()
    const power1 = container.addPowerSource()
    const wire1 = power1.addWireSegment()
    wire1.connect(NANDGate.inputWire1)
    expect(NANDGate.inputWire1.isPowered).toBeTruthy()
    expect(NANDGate.relay1.switch.isClosed).toBeFalsy()
    expect(NANDGate.relay1.wire2.isPowered).toBeTruthy()
    expect(NANDGate.wire1.isPowered).toBeTruthy()
    expect(NANDGate.wire2.isPowered).toBeTruthy()
    expect(NANDGate.relay2.wire1.isPowered).toBeTruthy()
    expect(NANDGate.outputWire.isPowered).toBeTruthy()
    wire1.disconnect(NANDGate.inputWire1)

    expect(NANDGate.inputWire2.isPowered).toBeFalsy()
    expect(NANDGate.relay2.switch.isOpen).toBeFalsy()
    const power2 = container.addPowerSource()
    const wire2 = power2.addWireSegment()
    wire2.connect(NANDGate.inputWire2)
    expect(NANDGate.inputWire2.isPowered).toBeTruthy()
    expect(NANDGate.relay2.switch.isOpen).toBeTruthy()
    expect(NANDGate.outputWire.isPowered).toBeTruthy()

    wire1.connect(NANDGate.inputWire1)
    expect(NANDGate.outputWire.isPowered).toBeFalsy()
    wire1.disconnect(NANDGate.inputWire1)
    expect(NANDGate.outputWire.isPowered).toBeTruthy()

    wire2.disconnect(NANDGate.inputWire2)
    expect(NANDGate.outputWire.isPowered).toBeTruthy()
    wire2.connect(NANDGate.inputWire2)
    expect(NANDGate.outputWire.isPowered).toBeTruthy()
    wire1.connect(NANDGate.inputWire1)
    expect(NANDGate.outputWire.isPowered).toBeFalsy()
  })
})

