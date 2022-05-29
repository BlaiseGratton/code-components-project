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

    this.y1 += 1
    this.x2 -= 20
    this.y2 -= 20

    if (this.isClosed) {
      this.connect(this.wire2)
    }

    if (this.id && this.parentElement) {
      this.parentElement.connectCoilsToSwitch(this)
    }
    this.relatedComponents = [this.wire1, this.wire2]
    this.isMoving = false
  }

  constructor (isClosed) {
    super()
    this.isClosed = Boolean(isClosed)
    this.relatedComponents = []
    this.isMoving = true
  }

  get isOpen () { return !this.isClosed }

  onLoseMagnetise () { this.open() }

  onGainMagnetise () { this.close() }

  get x1 () { return this._x1 }
  get x2 () { return this._x2 }
  get y1 () { return this._y1 }
  get y2 () { return this._y2 }

  updateRelatedAttributes (component, attribute, delta) {
    Array.from(component.attributes)
      .filter(attr => attr.name.includes(attribute))
      .forEach(attr => {
        attr.value = parseInt(attr.value) + delta
      })
  }

  set x1 (val) {
    const delta = val - this.x1
    super.x1 = val

    if (delta && !this.isMoving) {
      this.updateRelatedAttributes(this.wire1, 'x', delta)
    }
  }

  set y1 (val) {
    const delta = val - this.y1
    super.y1 = val

    if (delta && !this.isMoving) {
      this.updateRelatedAttributes(this.wire1, 'y', delta)
    }
  }

  set x2 (val) {
    const delta = val - this.x2
    super.x2 = val

    if (delta && !this.isMoving) {
      this.updateRelatedAttributes(this.wire2, 'x', delta)
    }
  }

  set y2 (val) {
    const delta = val - this.y2
    super.y2 = val

    if (delta && !this.isMoving) {
      this.updateRelatedAttributes(this.wire2, 'y', delta)
    }
  }

  open () {
    this.isMoving = true
    if (!this.isOpen) {
      this.isClosed = false
      this.x2 -= 20
      this.y2 -= 20
      this.disconnect(this.wire2)
    }
    this.isMoving = false
  }

  close () {
    this.isMoving = true
    if (this.isOpen) {
      this.isClosed = true
      this.x2 = this.wire2.x1
      this.y2 = this.wire2.y1
      this.connect(this.wire2)
    }
    this.isMoving = false
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
