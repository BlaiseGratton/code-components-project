import SimpleRelay from './Relay.js'


class InverterRelay extends SimpleRelay {

  switchComponent = 'throw-switch'

}

window.customElements.define('inverter-relay', InverterRelay)

export default InverterRelay
