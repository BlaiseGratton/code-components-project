import WireSegment from './WireSegment.js'


class SimpleSwitch extends WireSegment {

  connectedCallback () {
    super.connectedCallback()

    this.wire1 = document.createElement('wire-segment')
    this.wire2 = document.createElement('wire-segment')
    this.wire1.parentComponent = this
    this.wire2.parentComponent = this

    this.parentElement.appendChild(this.wire1)
    this.parentElement.appendChild(this.wire2)
    this.connect(this.wire1)

    this.wire1.x2 = this.x1
    this.wire1.y2 = this.y1
    this.wire1.x1 = this.x1 - 12
    this.wire1.y1 = this.y1

    this.wire2.x1 = this.x2
    this.wire2.y1 = this.y2
    this.wire2.x2 = this.x2 + 12
    this.wire2.y2 = this.y2

    this.x2 -= 20
    this.y2 -= 20

    if (this.isClosed) {
      this.connect(this.wire2)
    }

    if (this.id && this.parentElement) {
      this.parentElement.connectCoilsToSwitch(this)
    }
  }

  constructor (isClosed) {
    super()
    this.isClosed = Boolean(isClosed)
  }

  get isOpen () { return !this.isClosed }

  open () {
    if (!this.isOpen) {
      this.disconnect(this.wire2)
      this.isClosed = false
      this.x2 -= 20
      this.y2 -= 20
    }
  }

  close () {
    if (this.isOpen) {
      this.connect(this.wire2)
      this.isClosed = true
      this.x2 = this.wire2.x1
      this.y2 = this.wire2.y1
    }
  }

  connect (component) {
    if (component.parentComponent !== this) {
      throw new Error(
        '[Switch.js] - cannot connect directly to this component - connect to a contact point'
      )
    } else {
      super.connect(component)
    }
  }
}

window.customElements.define('simple-switch', SimpleSwitch)

export default SimpleSwitch
