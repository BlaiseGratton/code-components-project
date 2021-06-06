if (typeof process !== 'undefined') {
  const module = require('../components/ComponentContainer')
  ComponentContainer = module.ComponentContainer
} else if (typeof ComponentContainer === 'undefined') {
  throw new Error('[Relay.js] ComponentContainer is undefined - did you load it before loading this script?')
}

window.customElements.define('simple-relay', class SimpleRelay extends ComponentContainer {
})
