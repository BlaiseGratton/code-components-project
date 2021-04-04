class WireSegment extends HTMLElement {

  static CIRCLE_CAP_RADIUS = 4  // circular caps at ends of segments
  static STROKE_WIDTH = 2  // wire thickness
  static ENDCAP_OFFSET = this.CIRCLE_CAP_RADIUS * 2 + this.STROKE_WIDTH
  static testIdCounter = 0

  attachToContainer (container) {
    container.attachSVGElement(this.line)
    container.attachSVGElement(this.end1)
    container.attachSVGElement(this.end2)
  }

  connectedCallback () {
    if (typeof process !== 'undefined' && !this.id) {
      this.id = `wire-segment-${this.testId}`
    }
    this.style.display = 'contents'
    this.style.position = 'absolute'

    let {
      'x1': x1Attribute,
      'x2': x2Attribute,
      'y1': y1Attribute,
      'y2': y2Attribute
    } = this.attributes

    this.x1 = x1Attribute ? parseInt(x1Attribute.value) : 0
    this.y1 = y1Attribute ? parseInt(y1Attribute.value) : 0
    this.x2 = x2Attribute ? parseInt(x2Attribute.value) : 0
    this.y2 = y2Attribute ? parseInt(y2Attribute.value) : 0

    const width = Math.abs(this.x2 - this.x1)
    const height = Math.abs(this.y2 - this.y1)

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', this.x1 + this.constructor.CIRCLE_CAP_RADIUS)
    line.setAttribute('x2', this.x2 + this.constructor.CIRCLE_CAP_RADIUS)
    line.setAttribute('y1', this.y1 + this.constructor.CIRCLE_CAP_RADIUS)
    line.setAttribute('y2', this.y2 + this.constructor.CIRCLE_CAP_RADIUS)
    line.setAttribute('stroke', 'black')
    line.setAttribute('stroke-width', this.constructor.STROKE_WIDTH)
    line.parentComponent = this
    this._line = line

    const segmentEnd1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    segmentEnd1.setAttribute('class', 'segment-cap')
    segmentEnd1.setAttribute('cx', this.x1 + this.constructor.CIRCLE_CAP_RADIUS)
    segmentEnd1.setAttribute('cy', this.y1 + this.constructor.CIRCLE_CAP_RADIUS)
    segmentEnd1.setAttribute('r', this.constructor.CIRCLE_CAP_RADIUS)
    segmentEnd1.setAttribute('fill', 'black')
    segmentEnd1.parentComponent = this
    this._end1 = segmentEnd1

    const segmentEnd2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    segmentEnd2.setAttribute('class', 'segment-cap')
    segmentEnd2.setAttribute('cx', this.x2 + this.constructor.CIRCLE_CAP_RADIUS)
    segmentEnd2.setAttribute('cy', this.y2 + this.constructor.CIRCLE_CAP_RADIUS)
    segmentEnd2.setAttribute('r', this.constructor.CIRCLE_CAP_RADIUS)
    segmentEnd2.setAttribute('fill', 'black')
    segmentEnd2.parentComponent = this
    this._end2 = segmentEnd2

    if (this.parentElement && this.parentSVG) {
      this.attachToContainer(this.parentElement)

      const self = this

      ;[this.end1, this.end2].forEach(cap => {
        cap.addEventListener('mousedown', function (ev) { self.isDraggingCircle = true })

        cap.addEventListener('mouseup', function ({ currentTarget, clientX, clientY, ...ev }) {
          self.isDraggingCircle = false
          const offset = self.constructor.CIRCLE_CAP_RADIUS * 2 + self.constructor.STROKE_WIDTH
          const xOffset = clientX - offset
          const yOffset = clientY - offset
          self.parentSVG.parentElement.handleIntersections(currentTarget, xOffset, yOffset)
        })

        cap.addEventListener('mouseenter', function (ev) {
          ev.currentTarget.style.fill = 'orange'
          ev.currentTarget.attributes.r.value = 8
        })

        cap.addEventListener('mouseleave', function (ev) {
          ev.currentTarget.style.fill = 'black'
          ev.currentTarget.attributes.r.value = 4
          self.isDraggingCircle = false
        })

        cap.addEventListener('mousemove', function (ev) {
          if (self.isDraggingCircle) {
            self.redraw(ev)
          }
        })
      })
    }
  }

  toJSON () {
    return {
      type: 'wire-segment'
    }
  }

  constructor () {
    super()
    // const shadowDOM = this.attachShadow({ mode: 'open' })
    this.connectedComponents = []
    this.poweredBy = null
    this.groundedTo = null
    this.testId = this.constructor.testIdCounter++

    this.attributeChangeHandlers = {
      /*
      'is-powered': (self, thing, value, otherThing) => {
        if (value) {
          self.line.style.stroke = 'red'
          self.end1.style.stroke = 'red'
          self.end2.style.stroke = 'red'
          self.connectedComponents.forEach(seg => {
            if (!seg.attributes['is-powered']) {
              seg.setAttribute('is-powered', true)
            }
          })
        } else {
          self.line.style.stroke = 'black'
          self.end1.style.stroke = 'black'
          self.end2.style.stroke = 'black'
        }
      }
      */
    }


  }

  get parentSVG () {
    return this.parentElement ? this.parentElement.querySelector('svg') : null
  }

  get x1 () { return this._x1 }
  get x2 () { return this._x2 }
  get y1 () { return this._y1 }
  get y2 () { return this._y2 }

  set x1 (val) {
    this._x1 = val
    this.setAttribute('x1', val)

    if (this.line) {
      this.line.attributes.x1.value = val
      this.end1.attributes.cx.value = val
    }
  }

  set x2 (val) {
    this._x2 = val
    this.setAttribute('x2', val)

    if (this.line) {
      this.line.attributes.x2.value = val
      this.end2.attributes.cx.value = val
    }
  }

  set y1 (val) {
    this._y1 = val
    this.setAttribute('y1', val)

    if (this.line) {
      this.line.attributes.y1.value = val
      this.end1.attributes.cy.value = val
    }
  }

  set y2 (val) {
    this._y2 = val
    this.setAttribute('y2', val)

    if (this.line) {
      this.line.attributes.y2.value = val
      this.end2.attributes.cy.value = val
    }
  }

  get line () { return this._line }
  get end1 () { return this._end1 }
  get end2 () { return this._end2 }

  set svgViewWidth (value) {
    let [x, y, width, height] = this.svgViewWidth.split(' ')
    width = value.toString()
    this.svg.attributes.viewbox.value = [x, y, width, height].join(' ')
  }

  get isPowered () { return Boolean(this._poweredBy) }

  get poweredBy () { return this._poweredBy || null }

  get isGrounded () { return Boolean(this._groundedBy) }

  get groundedBy () { return this._groundedBy }

  set poweredBy (val) {
    const wasPowered = Boolean(this._poweredBy)
    const wasPoweredBy = this._poweredBy
    this._poweredBy = val

    if (!wasPowered && val) {
      // this component is becoming powered, so it checks its buddies to see if they need
      // power like a mensch
      this.connectedComponents.filter(c => c !== val).forEach(component => {
        if (!component.isPowered) {
          component.poweredBy = this
        }
      })
    }

    if (!val && wasPowered) {
      // this component lost its _current_ source of power, so it needs to notify the other buddies
      this.connectedComponents.forEach(component => {
        if (component.poweredBy === this) {
          component.poweredBy = null
        }
      })
    }

    const nextPoweringComponent = this.tryGetNextPoweringComponent(wasPoweredBy)

    if (!this.isPowered) {
      this._poweredBy = nextPoweringComponent || null
    }

    if (this.isPowered) {
      this.connectedComponents.forEach(com => {
        if (com !== nextPoweringComponent && !com.isPowered) {
          com.poweredBy = this
        }
      })
    }
    this.handleFlowChange()
  }

  set groundedBy (val) {
    const wasGrounded = Boolean(this._groundedBy)
    const wasGroundedBy = this._groundedBy
    this._groundedBy = val

    if (!wasGrounded && val) {
      // this component is becoming grounded, so it checks its buddies to see if they need
      // to be grounded like a mensch
      this.connectedComponents.filter(c => c !== val).forEach(component => {
        if (!component.isGrounded) {
          component.groundedBy = this
        }
      })
    }

    if (!val && wasGroundedBy) {
      // this component lost its _current_ connection to ground, so it needs to notify the other buddies
      this.connectedComponents.forEach(component => {
        if (component.groundedBy === this) {
          component.groundedBy = null
        }
      })
    }

    const nextGroundingComponent = this.tryGetNextGroundingComponent(wasGroundedBy)

    if (!this.isGrounded) {
      this._groundedBy = nextGroundingComponent || null
    }

    if (this.isGrounded) {
      this.connectedComponents.forEach(com => {
        if (com !== nextGroundingComponent && !com.isGrounded) {
          com.groundedBy = this
        }
      })
    }
    this.handleFlowChange()
  }

  tryGetNextPoweringComponent (removedComponent) {
    if (this.isPowered) return
    return this.connectedComponents
               .filter(c => c !== removedComponent && c.isPowered)
               .find(com => com.poweredBy !== this)
  }

  tryGetNextGroundingComponent (removedComponent) {
    if (this.isGrounded) return
    return this.connectedComponents
               .filter(c => c !== removedComponent && c.isGrounded)
               .find(com => com.groundedBy !== this)
  }

  connect (newComponent) {
    if (this.connectedComponents.includes(newComponent)) return

    this.connectedComponents.push(newComponent)
    newComponent.connect(this)

    if (this.isPowered && !newComponent.isPowered) {
      newComponent.poweredBy = this
    }

    if (newComponent.isPowered && !this.isPowered) {
      this.poweredBy = newComponent
    }

    if (this.isGrounded && !newComponent.isGrounded) {
      newComponent.groundedBy = this
    }

    if (newComponent.isGrounded && !this.isGrounded) {
      this.groundedBy = newComponent
    }
  }

  disconnect (oldComponent) {
    if (!this.connectedComponents.includes(oldComponent)) return

    this.connectedComponents = this.connectedComponents.filter(x => x !== oldComponent)
    oldComponent.disconnect(this)

    if (this.poweredBy === oldComponent) {
      this.poweredBy = null
    }

    if (this.groundedBy === oldComponent) {
      this.groundedBy = null
    }
  }

  getOtherSegmentCap (end) {
    if (end === this.end1) return this.end2
    if (end === this.end2) return this.end1
  }

  handleFlowChange () {
    if (this.line) {
      if (this.isPowered) {
        this.line.style.stroke = 'red'
      } else {
        this.line.style.stroke = 'black'
      }
    }
  }

  redraw ({ currentTarget, clientX, clientY, ...ev }) {
    const movedEnd = currentTarget
    const xOffset = clientX - this.constructor.ENDCAP_OFFSET
    const yOffset = clientY - this.constructor.ENDCAP_OFFSET
    movedEnd.attributes.cx.value = xOffset
    movedEnd.attributes.cy.value = yOffset

    if (this.end1 === movedEnd) {
      this.line.attributes.x1.value = movedEnd.attributes.cx.value
      this.line.attributes.y1.value = movedEnd.attributes.cy.value
    }

    if (this.end2 === movedEnd) {
      this.line.attributes.x2.value = movedEnd.attributes.cx.value
      this.line.attributes.y2.value = movedEnd.attributes.cy.value
    }

    // this.parentSVG.parentElement.handleIntersections(movedEnd, xOffset, yOffset)
  }

  attributeChangedCallback (attribute, ...rest) {
    this.attributeChangeHandlers[attribute](this, ...rest)
  }

  static get observedAttributes () { return ['is-powered'] }
}

window.customElements.define('wire-segment', WireSegment)

if (typeof module !== 'undefined') {
  module.exports = { WireSegment }
}
