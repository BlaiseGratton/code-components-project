import * as components from '../../components'

const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn()


describe('half adder component behavior', () => {
  it('takes two input signals as a 0 or 1 bit and outputs the sum and carry', () => {
    
    document.body.innerHTML = `
      <component-container id="container-1" width="400" height="400" no-ui>
      </component-container>
    `
    const container = document.querySelector('component-container#container-1')
    const halfAdder = container.addHalfAdder()
    expect(halfAdder).not.toBeNull()

    expect(halfAdder.inputWire1.isPowered).toBeFalsy()
    expect(halfAdder.inputWire2.isPowered).toBeFalsy()
    expect(halfAdder.sumOut.isPowered).toBeFalsy()
    expect(halfAdder.carryOut.isPowered).toBeFalsy()

    const power1 = container.addPowerSource()
    const wire1 = power1.addWireSegment()
    wire1.connect(halfAdder.inputWire1)
    expect(halfAdder.sumOut.isPowered).toBeTruthy()
    expect(halfAdder.carryOut.isPowered).toBeFalsy()
    wire1.disconnect(halfAdder.inputWire1)
    expect(halfAdder.sumOut.isPowered).toBeFalsy()
    expect(halfAdder.carryOut.isPowered).toBeFalsy()

    const power2 = container.addPowerSource()
    const wire2 = power1.addWireSegment()
    wire2.connect(halfAdder.inputWire2)
    expect(halfAdder.sumOut.isPowered).toBeTruthy()
    expect(halfAdder.carryOut.isPowered).toBeFalsy()
    wire2.disconnect(halfAdder.inputWire2)
    expect(halfAdder.sumOut.isPowered).toBeFalsy()
    expect(halfAdder.carryOut.isPowered).toBeFalsy()

    wire1.connect(halfAdder.inputWire1)
    wire2.connect(halfAdder.inputWire2)
    expect(halfAdder.sumOut.isPowered).toBeFalsy()
    expect(halfAdder.carryOut.isPowered).toBeTruthy()
    wire1.disconnect(halfAdder.inputWire1)
    expect(halfAdder.sumOut.isPowered).toBeTruthy()
    expect(halfAdder.carryOut.isPowered).toBeFalsy()
    wire1.connect(halfAdder.inputWire1)
    expect(halfAdder.sumOut.isPowered).toBeFalsy()
    expect(halfAdder.carryOut.isPowered).toBeTruthy()
    wire2.disconnect(halfAdder.inputWire2)
    expect(halfAdder.sumOut.isPowered).toBeTruthy()
    expect(halfAdder.carryOut.isPowered).toBeFalsy()
    wire2.connect(halfAdder.inputWire2)
    expect(halfAdder.sumOut.isPowered).toBeFalsy()
    expect(halfAdder.carryOut.isPowered).toBeTruthy()
  })
})
