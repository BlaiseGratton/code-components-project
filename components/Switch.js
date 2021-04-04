if (typeof process !== 'undefined') {
  const module = require('../components/WireSegment')
  WireSegment = module.WireSegment
} else if (typeof WireSegment === 'undefined') {
  throw new Error('[Switch.js] WireSegment is undefined - did you load it before loading this script?')
}

window.customElements.define('simple-switch', class SimpleSwitch extends WireSegment {

  constructor (isClosed) {
    super()
    this.switchWire = document.createElement('wire-segment')
    this.wire1 = document.createElement('wire-segment')
    this.wire2 = document.createElement('wire-segment')
    this.switchWire.connect(this.wire1)

    if (isClosed) {
      this.wire2.connect(this.wire1)
    }
  }

  open () {
    this.switchWire.disconnect(this.wire2)
  }

  close () {
    this.switchWire.connect(this.wire2)
  }

  connect () {
    throw new Error(
      '[Switch.js] - cannot connect directly to this component - connect to a contact point'
    )
  }
})
