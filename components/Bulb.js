import WireSegment from './WireSegment.js'


class Bulb extends WireSegment {
  get isLit () { return this.isPowered && this.isGrounded }

  redrawBulb () {
    const pathStartX = (this.x1 + this.x2) / 2
    const pathStartY = (this.y1 + this.y2) / 2
    this.path1.attributes.d.value = `M${pathStartX},${pathStartY} l-2,-15 a 15 15 0 1 1 15 0 l-2,15`
  }

  handleFlowChange () {
    super.handleFlowChange()

    if (this.parentElement) {
      this.path1 && this.path1.setAttribute('stroke', this.isLit ? 'orange' : 'grey')
      this.onCurrentChange && this.onCurrentChange(this)
    }
  }

  connectedCallback () {
    super.connectedCallback()

    if (typeof process !== 'undefined' && !this.id) {
      this.id = `bulb-${this.testId}`
    }

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const pathStartX = (this.x1 + this.x2) / 2
    const pathStartY = (this.y1 + this.y2) / 2
    path1.setAttribute('d', `M${pathStartX},${pathStartY} l-2,-15 a 15 15 0 1 1 15 0 l-2,15`)
    this.path1 = path1
    this.parentElement.attachSVGElement(path1)
    path1.setAttribute('stroke', 'grey')
    path1.setAttribute('fill', 'none')
  }

  redraw (event) {
    super.redraw(event)
    this.redrawBulb()
  }
}

window.customElements.define('simple-bulb', Bulb)

export default Bulb
