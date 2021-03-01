let WireSegment

if (typeof process !== 'undefined') {
  const module = require('../components/WireSegment')
  WireSegment = module.WireSegment
} else if (typeof WireSegment === 'undefined') {
  throw new Error('[Bulb.js] WireSegment is undefined - did you load it before loading this script?')
}

class Bulb extends WireSegment {
  get isLit () { return this.isPowered && this.isGrounded }
}

window.customElements.define('simple-bulb', Bulb)
