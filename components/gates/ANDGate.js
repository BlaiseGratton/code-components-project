import ComponentContainer from '../ComponentContainer.js'
import PowerSource from '../PowerSource.js'
import Relay from '../Relay.js'
import WireSegment from '../WireSegment.js'


class ANDGate extends ComponentContainer {

  connectedCallback () {
    super.connectedCallback()

    this.svg.setAttribute('width', 200)
    this.svg.setAttribute('height', 400)

    const power = document.createElement('power-source')
    this.appendChild(power)
    power.wire.x2 = 44 
    power.wire.y2 = 49
    this.power = power

    const relay1 = document.createElement('simple-relay')
    relay1.setAttribute('x', 30)
    relay1.setAttribute('y', 70)
    this.appendChild(relay1)
    relay1.outerWire3.x2 = 2
    relay1.outerWire3.noDisconnect = true
    power.wire.connect(relay1.wire1)
    this.inputWire1 = this.parentElement.exposeWireCap(relay1.outerWire3.end2, 'left')
    this.relay1 = relay1

    const relay2 = document.createElement('simple-relay')
    relay2.setAttribute('x', 30)
    relay2.setAttribute('y', 250)
    this.appendChild(relay2)
    relay2.outerWire3.x2 = 2
    relay2.outerWire2.noDisconnect = true
    relay2.outerWire3.noDisconnect = true
    this.outputWire = this.parentElement.exposeWireCap(relay2.outerWire2.end2, 'right')
    this.inputWire2 = this.parentElement.exposeWireCap(relay2.outerWire3.end2, 'left')
    this.relay2 = relay2

    const wire1 = document.createElement('wire-segment')
    wire1.x1 = 189
    wire1.y1 = 111 
    wire1.x2 = 189
    wire1.y2 = 225
    this.wire1 = wire1
    this.appendChild(wire1)
    wire1.connect(relay1.outerWire2)

    const wire2 = document.createElement('wire-segment')
    wire2.x1 = 41
    wire2.y1 = 225
    wire2.x2 = 189
    wire2.y2 = 225
    this.wire2 = wire2
    this.appendChild(wire2)
    wire1.connect(wire2)
    wire2.connect(relay2.wire1)
  }

}

window.customElements.define('and-gate', ANDGate)

export default ANDGate
