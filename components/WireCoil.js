let WireSegment

if (typeof process !== 'undefined') {
  const module = require('../components/WireSegment')
  WireSegment = module.WireSegment
} else if (typeof WireSegment === 'undefined') {
  throw new Error('[Switch.js] WireSegment is undefined - did you load it before loading this script?')
}

window.customElements.define('wire-coil', class WireCoil extends WireSegment {

  constructor () {
    super()
    this.switches = []
  }

  connectSwitch (swhich) {
    if (!this.switches.includes(swhich)) this.switches.push(swhich)
  }

  get poweredBy () { return super.poweredBy }
  get groundedBy () { return super.groundedBy }

  set poweredBy (val) {
    const wasPowered = Boolean(this._poweredBy)
    super.poweredBy = val
    const isNowPowered = Boolean(this._poweredBy)

    if (this.isGrounded) {
      if (!wasPowered && isNowPowered) {
        for (const swich of this.switches) swich.close()
      }
    }

    if (wasPowered && !isNowPowered) {
      for (const swich of this.switches) swich.open()
    }
  }


  set groundedBy (val) {
    const wasGrounded = Boolean(this._groundedBy)
    super.groundedBy = val
    const isNowGrounded = Boolean(this._groundedBy)

    if (this.isPowered) {
      if (!wasGrounded && isNowGrounded) {
        for (const swich of this.switches) swich.close()
      }
    }

    if (wasGrounded && !isNowGrounded) {
      for (const swich of this.switches) swich.open()
    }
  }
})
