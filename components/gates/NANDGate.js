import ComponentContainer from '../ComponentContainer.js'
import PowerSource from '../PowerSource.js'
import Relay from '../Relay.js'
import WireSegment from '../WireSegment.js'


class NANDGate extends ComponentContainer {

  defaultWidth = 200
  defaultHeight = 400

  connectedCallback () {
    super.connectedCallback()

    const power1 = document.createElement('power-source')
    this.appendChild(power1)
    power1.wire.x2 = 44 
    power1.wire.y2 = 19
    this.power1 = power1

    const relay1 = document.createElement('inverter-relay')
    relay1.setAttribute('x', 30 * this.scale)
    relay1.setAttribute('y', 40 * this.scale)
    relay1.setAttribute('scale', this.scale)
    this.appendChild(relay1)
    relay1.outerWire3.x2 = 2
    relay1.outerWire3.noDisconnect = true
    power1.wire.connect(relay1.wire1)
    this.inputWire1 = this.parentElement.exposeWireCap(relay1.outerWire3.end2, 'left')
    this.relay1 = relay1

    const relay2 = document.createElement('inverter-relay')
    relay2.setAttribute('x', 30 * this.scale)
    relay2.setAttribute('y', 250 * this.scale)
    relay2.setAttribute('scale', this.scale)
    this.appendChild(relay2)
    relay2.outerWire3.x2 = 2
    relay2.outerWire2.noDisconnect = true
    relay2.outerWire3.noDisconnect = true
    this.inputWire2 = this.parentElement.exposeWireCap(relay2.outerWire3.end2, 'left')
    this.relay2 = relay2

    const power2 = document.createElement('power-source')
    power2.setAttribute('y', 199)
    this.appendChild(power2)
    power2.wire.x2 = 44 
    power2.wire.y2 = 229 
    this.power1 = power2
    power2.wire.connect(relay2.wire1)

    const wire1 = document.createElement('wire-segment')
    wire1.x1 = 189
    wire1.y1 = 81 
    wire1.x2 = 189
    wire1.y2 = 225
    this.wire1 = wire1
    this.appendChild(wire1)
    wire1.connect(relay1.outerWire2)

    const wire2 = document.createElement('wire-segment')
    wire2.x1 = 189
    wire2.y1 = 225
    wire2.x2 = 189
    wire2.y2 = 288
    this.wire2 = wire2
    this.appendChild(wire2)
    wire1.connect(wire2)
    wire2.connect(relay2.wire2)
    wire2.noDisconnect = true
    wire1.noDisconnect = true
    this.outputWire = this.parentElement.exposeWireCap(wire1.end2, 'right')
    this.outputWire.setAttribute('id', 'two')

    this.exposedComponents = [this.inputWire1, this.inputWire2, this.outputWire]
  }

}

window.customElements.define('nand-gate', NANDGate)

export default NANDGate
