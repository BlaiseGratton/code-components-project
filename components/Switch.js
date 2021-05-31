if (typeof process !== 'undefined') {
  const module = require('../components/WireSegment')
  WireSegment = module.WireSegment
} else if (typeof WireSegment === 'undefined') {
  throw new Error('[Switch.js] WireSegment is undefined - did you load it before loading this script?')
}

window.customElements.define('simple-switch', class SimpleSwitch extends WireSegment {

  connectedCallback () {
    super.connectedCallback()

    //this.switchWire = document.createElement('wire-segment')
    this.wire1 = document.createElement('wire-segment')
    this.wire2 = document.createElement('wire-segment')
    //this.switchWire.connect(this.wire1, true)
    this.connect(this.wire1, true)

    this.parentElement.appendChild(this.wire1)
    this.parentElement.appendChild(this.wire2)

    this.wire1.x2 = this.x1
    this.wire1.y2 = this.y1
    this.wire1.x1 = this.x1 - 30
    this.wire1.y1 = this.y1

    this.wire2.x1 = this.x2
    this.wire2.y1 = this.y2
    this.wire1.x2 = this.x2 + 30
    this.wire1.y2 = this.y2

    if (this.isClosed) {
      this.connect(this.wire2)
    }
  }

  constructor (isClosed) {
    super()
    this.isClosed = isClosed
  }

  open () {
    this.disconnect(this.wire2)
    this.isClosed = false
  }

  close () {
    this.connect(this.wire2)
    this.isClosed = true
  }

  connect () {
    throw new Error(
      '[Switch.js] - cannot connect directly to this component - connect to a contact point'
    )
  }
})
