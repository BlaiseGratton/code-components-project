import ComponentContainer from './ComponentContainer.js'


class SimpleRelay extends ComponentContainer {

  connectedCallback () {
    super.connectedCallback()

    this.svg.setAttribute('width', 140)
    this.svg.setAttribute('height', 145)

    const switch1 = document.createElement('simple-switch')
    switch1.setAttribute('x1', 37)
    switch1.setAttribute('y1', 45)
    switch1.setAttribute('x2', 85)
    switch1.setAttribute('y2', 45)
    switch1.setAttribute('id', 'switch1')
    this.appendChild(switch1)
    this.switch = switch1

    const wire1 = document.createElement('wire-segment')
    wire1.setAttribute('x1', 10)
    wire1.setAttribute('y1', 0)
    wire1.setAttribute('x2', 20)
    wire1.setAttribute('y2', 42)
    this.appendChild(wire1)
    wire1.noDisconnect = true
    this.outerWire1 = this.parentElement.exposeWireCap(wire1.end1, 'up')
    this.wire1 = wire1
    wire1.connect(switch1.wire1)

    const wire2 = document.createElement('wire-segment')
    wire2.setAttribute('x1', 94)
    wire2.setAttribute('y1', 40)
    wire2.setAttribute('x2', 134)
    wire2.setAttribute('y2', 40)
    this.appendChild(wire2)
    wire2.noDisconnect = true
    this.outerWire2 = this.parentElement.exposeWireCap(wire2.end2, 'right')
    this.wire2 = wire2
    wire2.connect(switch1.wire2)

    const wire3 = document.createElement('wire-segment')
    wire3.setAttribute('x1', -2)
    wire3.setAttribute('y1', 72)
    wire3.setAttribute('x2', 32)
    wire3.setAttribute('y2', 72)
    this.appendChild(wire3)
    wire3.noDisconnect = true
    this.outerWire3 = this.parentElement.exposeWireCap(wire3.end1, 'left')
    this.wire3 = wire3

    const wireCoil = document.createElement('wire-coil')
    wireCoil.setAttribute('x1', 32)
    wireCoil.setAttribute('y1', 72)
    wireCoil.setAttribute('x2', 85)
    wireCoil.setAttribute('y2', 73)
    wireCoil.setAttribute('for', 'switch1')
    this.appendChild(wireCoil)
    this.coil = wireCoil
    wire3.connect(wireCoil)

    const wire4 = document.createElement('wire-segment')
    wire4.setAttribute('x1', 85)
    wire4.setAttribute('y1', 73)
    wire4.setAttribute('x2', 100)
    wire4.setAttribute('y2', 73)
    this.appendChild(wire4)
    wire4.connect(wireCoil)

    const ground = document.createElement('ground-connection')
    ground.setAttribute('x', -15)
    ground.setAttribute('y', 18)
    this.appendChild(ground)
    ground.connect(wire4)
  }

}

window.customElements.define('simple-relay', SimpleRelay)

export default SimpleRelay
