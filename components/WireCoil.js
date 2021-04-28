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

  connectedCallback () {
    super.connectedCallback()

    if (typeof process !== 'undefined' && !this.id) {
      this.id = `bulb-${this.testId}`
    }
    
    this.drawCoil()
  }

  drawCoil () {
    const cycles = 4
    const { x1, x2, y1, y2 } = this
    const xDistance = x2 - x1
    const yDistance = y2 - y1
    const cycleXDistance = xDistance / cycles
    const cycleYDistance = yDistance / cycles
    const paths = []
    let lastXStart = this.x1
    let lastYStart = this.y1
    const angle = Math.tan(yDistance / xDistance)
    const slope = yDistance/xDistance
    const yIntercept = y1 - (slope * x1)
    const oppositeSlope = -(xDistance / yDistance)
    const hypotenuse = Math.sqrt(cycleXDistance**2 + cycleYDistance**2)

    const pole1Base = hypotenuse / 2
    const pole1X = Math.cos(angle) * pole1Base
    const pole1Y = Math.sin(angle) * pole1Base
    const pole1YIntercept = pole1Y - (oppositeSlope * pole1X)
    const pole1XIntercept = (-pole1YIntercept) / oppositeSlope
    const pole1AxisDistanceX = pole1X - pole1XIntercept
    const pole1AxisDistanceY = pole1Y - pole1YIntercept
    const pole1AxisDistance = Math.sqrt(pole1AxisDistanceX**2 + pole1AxisDistanceY**2)
    const pole1Ratio = 30 / pole1AxisDistance
    const pole1XDistance = pole1AxisDistanceX * pole1Ratio
    const pole1YDistance = pole1AxisDistanceY * pole1Ratio

    const pole2Base = hypotenuse - pole1Base
    const pole2X = Math.cos(angle) * pole2Base
    const pole2Y = Math.sin(angle) * pole2Base
    const pole2YIntercept = pole2Y - (oppositeSlope * pole2X)
    const pole2XIntercept = (-pole2YIntercept) / oppositeSlope
    const pole2AxisDistanceX = pole2X - pole2XIntercept
    const pole2AxisDistanceY = pole2Y - pole2YIntercept
    const pole2AxisDistance = Math.sqrt(pole2AxisDistanceX**2 + pole2AxisDistanceY**2)
    const pole2Ratio = -50 / pole2AxisDistance
    const pole2XDistance = pole2AxisDistanceX * pole2Ratio
    const pole2YDistance = pole2AxisDistanceY * pole2Ratio

    while (paths.length < cycles) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const xEnd = lastXStart + cycleXDistance
      const yEnd = lastYStart + cycleYDistance
      path.setAttribute('d', `M${lastXStart},${lastYStart} c${pole1XDistance},${pole1YDistance} ${pole2XDistance},${pole2YDistance} ${cycleXDistance},${cycleYDistance}`)
      lastXStart = xEnd
      lastYStart = yEnd
      paths.push(path)
    }

    this.paths = paths

    for (const path of paths) {
      this.parentElement.attachSVGElement(path)
      path.setAttribute('stroke', 'grey')
      path.setAttribute('fill', 'none')
    }
  }

  redraw (event) {
    super.redraw(event)
    this.parentElement.removeSVGElement(...this.paths)
    this.drawCoil()
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
