if (typeof process !== 'undefined') {
  const module = require('../components/ComponentContainer')
  ComponentContainer = module.ComponentContainer
} else if (typeof ComponentContainer === 'undefined') {
  throw new Error('[Relay.js] ComponentContainer is undefined - did you load it before loading this script?')
}

window.customElements.define('simple-relay', class SimpleRelay extends ComponentContainer {

  connectedCallback () {
    super.connectedCallback()

    const width = this.svg.width.baseVal.value
    const height = this.svg.height.baseVal.value
    const innerContainer = document.createElement('component-container')
    innerContainer.setAttribute('width', width - 60)
    innerContainer.setAttribute('height', height - 60)
    innerContainer.setAttribute('x', 30)
    innerContainer.setAttribute('y', 30)

    this.appendChild(innerContainer)

    const power = document.createElement('power-source')
    this.appendChild(power)

    const switch1 = document.createElement('simple-switch')
    switch1.setAttribute('x1', 37)
    switch1.setAttribute('y1', 45)
    switch1.setAttribute('x2', 85)
    switch1.setAttribute('y2', 45)
    switch1.setAttribute('id', 'switch1')
    innerContainer.appendChild(switch1)

    const wire1 = document.createElement('wire-segment')
    wire1.setAttribute('x1', 10)
    wire1.setAttribute('y1', 0)
    wire1.setAttribute('x2', 20)
    wire1.setAttribute('y2', 42)
    innerContainer.appendChild(wire1)
    wire1.noDisconnect = true
    this.exposeWireCap(wire1.end1, 30, 30, 'up')
    this.wire1 = wire1

    const wire2 = document.createElement('wire-segment')
    wire2.setAttribute('x1', 94)
    wire2.setAttribute('y1', 40)
    wire2.setAttribute('x2', 134)
    wire2.setAttribute('y2', 40)
    innerContainer.appendChild(wire2)
    wire2.noDisconnect = true
    this.exposeWireCap(wire2.end2, 30, 30, 'right')
    this.wire2 = wire2

    const wire3 = document.createElement('wire-segment')
    wire3.setAttribute('x1', -2)
    wire3.setAttribute('y1', 72)
    wire3.setAttribute('x2', 32)
    wire3.setAttribute('y2', 72)
    innerContainer.appendChild(wire3)
    wire3.noDisconnect = true
    this.exposeWireCap(wire3.end1, 30, 30, 'left')
    this.wire3 = wire3

    const wireCoil = document.createElement('wire-coil')
    wireCoil.setAttribute('x1', 32)
    wireCoil.setAttribute('y1', 72)
    wireCoil.setAttribute('x2', 85)
    wireCoil.setAttribute('y2', 73)
    wireCoil.setAttribute('for', 'switch1')
    innerContainer.appendChild(wireCoil)


    const wire4 = document.createElement('wire-segment')
    wire4.setAttribute('x1', 85)
    wire4.setAttribute('y1', 73)
    wire4.setAttribute('x2', 100)
    wire4.setAttribute('y2', 73)
    innerContainer.appendChild(wire4)

    const ground = document.createElement('ground-connection')
    ground.setAttribute('x', -15)
    ground.setAttribute('y', 18)
    innerContainer.appendChild(ground)
  }

})
