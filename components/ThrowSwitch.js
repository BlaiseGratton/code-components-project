import SimpleSwitch from './Switch.js'


// this is called ThrowSwitch so that we can implement double-throw relays that
// look realistic, fight me
class ThrowSwitch extends SimpleSwitch {

  connectedCallback () {
    super.connectedCallback()

    this.x2 = this.wire2.x1
    this.y2 = this.wire2.y1
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
      this.x2 += 20
      this.y2 += 20
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
      /*
      throw new Error(
        '[Switch.js] - cannot connect directly to this component - connect to a contact point'
      )
      */
    } else {
      super.connect(component)
    }
  }
}

window.customElements.define('throw-switch', ThrowSwitch)

export default ThrowSwitch
