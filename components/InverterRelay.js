import SimpleRelay from './Relay.js'


class InverterRelay extends SimpleRelay {

  connectedCallback () {
    super.connectedCallback()

    this.wire1.disconnect(this.switch.wire1)
    this.wire2.disconnect(this.switch.wire2)
    debugger
    this.removeChild(this.switch)
    delete this.switch

    /*
    const switch1 = document.createElement('throw-switch')
    switch1.setAttribute('x1', 37)
    switch1.setAttribute('y1', 45)
    switch1.setAttribute('x2', 85)
    switch1.setAttribute('y2', 45)
    switch1.setAttribute('id', 'switch1')
    this.appendChild(switch1)
    this.switch = switch1
    */
  }
}

window.customElements.define('inverter-relay', InverterRelay)

export default InverterRelay
