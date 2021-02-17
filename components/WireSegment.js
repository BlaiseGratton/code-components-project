window.customElements.define('wire-segment', class WireSegment extends HTMLElement {

  // these buddies are for the DOM
  handleConnectSegment (segment) {
    if (!this.connectedComponents.find(seg => seg === segment))
      this.connectedComponents.push(segment)

    if (!this.attributes['is-powered'] && segment.attributes['is-powered'])
      this.setAttribute('is-powered', true)
  }

  // these buddies are for the DOM
  handleDisconnectSegment (segment) {
    this.connectedComponents = this.connectedComponents.filter(seg => seg !== segment)

    if (!this.connectedComponents.length
        || !this.connectedComponents.find(seg => seg.attributes['is-powered'])) {
      this.removeAttribute('is-powered')
    }
  }

  connectedCallback () {
    if (process) { // in a jest environment so it can do equality checks
      this.id = `wire-segment-${Math.ceil(Math.random() * 100000)}`
    }
    this.style.display = 'contents'
    this.style.position = 'absolute'
  }

  toJSON () {
    return {
      type: 'wire-segment'
    }
  }

  constructor () {
    super()
    // const shadowDOM = this.attachShadow({ mode: 'open' })
    this.poweringTo = []
    this.poweredBy = []
    this.connectedComponents = []

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

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    svg.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink'
    )

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

    const circleCapRadius = 4  // circular caps at ends of segments

    if (this.parentSVG) {
      svg.setAttribute('width', this.parentSVG.attributes.width.value)
      svg.setAttribute('height', this.parentSVG.attributes.height.value)
      svg.setAttribute('viewbox', this.parentSVG.attributes.viewbox)
    }

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('id', 'segment-line')
    line.setAttribute('x1', this.x1 + circleCapRadius)
    line.setAttribute('x2', this.x2 + circleCapRadius)
    line.setAttribute('y1', this.y1 + circleCapRadius)
    line.setAttribute('y2', this.y2 + circleCapRadius)
    line.setAttribute('stroke', 'black')
    line.setAttribute('stroke-width', 2)
    line.parentComponent = this
    svg.appendChild(line)

    const segmentEnd1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    segmentEnd1.setAttribute('id', 'end-1')
    segmentEnd1.setAttribute('class', 'segment-cap')
    segmentEnd1.setAttribute('cx', this.x1 + circleCapRadius)
    segmentEnd1.setAttribute('cy', this.y1 + circleCapRadius)
    segmentEnd1.setAttribute('r', circleCapRadius)
    segmentEnd1.setAttribute('fill', 'black')
    segmentEnd1.parentComponent = this
    svg.appendChild(segmentEnd1)

    const segmentEnd2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    segmentEnd2.setAttribute('id', 'end-2')
    segmentEnd2.setAttribute('class', 'segment-cap')
    segmentEnd2.setAttribute('cx', this.x2 + circleCapRadius)
    segmentEnd2.setAttribute('cy', this.y2 + circleCapRadius)
    segmentEnd2.setAttribute('r', circleCapRadius)
    segmentEnd2.setAttribute('fill', 'black')
    segmentEnd2.parentComponent = this
    svg.appendChild(segmentEnd2)

    if (this.parentSVG) {
      this.parentSVG.appendChild(svg)
      this.svg = svg

      const self = this

      this.svg.querySelectorAll('circle').forEach(cap => {
        cap.addEventListener('mousedown', function (ev) { self.isDraggingCircle = true })
        cap.addEventListener('mouseup', function ({ currentTarget, clientX, clientY, ...ev }) {
          self.isDraggingCircle = false
          const circleCapRadius = 4
          const offset = circleCapRadius * 2 + 2
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

  get parentSVG () {
    return this.parentElement ? this.parentElement.querySelector('svg') : null
  }

  get x1 () { return this._x1 }
  get x2 () { return this._x2 }
  get y1 () { return this._y1 }
  get y2 () { return this._y2 }
  set x1 (val) { this._x1 = val }
  set x2 (val) { this._x2 = val }
  set y1 (val) { this._y1 = val }
  set y2 (val) { this._y2 = val }

  get svg () { return this._svg }
  set svg (value) { this._svg = value }

  get line () { return this.svg.querySelector('line') }

  get end1 () { return this.svg.querySelector('#end-1') }

  get end2 () { return this.svg.querySelector('#end-2') }

  get svgWidth () { return this.svg.clientWidth }
  
  get svgHeight () { return this.svg.clientHeight }

  get svgViewWidth () { return this.svg.attributes.viewbox.value }

  set svgWidth (value) { this.svg.attributes.width.value = value }

  set svgHeight (value) { this.svg.attributes.height.value = value }

  set svgViewWidth (value) {
    let [x, y, width, height] = this.svgViewWidth.split(' ')
    width = value.toString()
    this.svg.attributes.viewbox.value = [x, y, width, height].join(' ')
  }

  get isPowered () { return Boolean(this.poweredBy.length) }

  get poweredBy () { return this._poweredBy || [] }

  set poweredBy (val) {
    const wasPowered = Boolean(this._poweredBy && this._poweredBy.length)

    // assumption here is that poweredBy only changes by one component at a time
    const newPowerSource = val.find(com => !this.poweredBy.includes(com))
    const removedPowerSource = this.poweredBy.find(com => !val.includes(com))

    this._poweredBy = val

    if (newPowerSource) {
      // this component is becoming powered, so it checks its buddies to see if they need
      // power like a mensch
      this.connectedComponents.filter(c => c !== newPowerSource).forEach(component => {
        if (!component.isPowered) {
          component.poweredBy = [...component.poweredBy, this]
        }
      })
    }

    if (removedPowerSource) {
      if (!this.isPowered) {
        // this component lost its _current_ source of power, so it needs to check if any 
        // other buddies can supply power
        const otherComponents = this.connectedComponents.filter(c => c !== removedPowerSource)
        const nextPoweringComponent = otherComponents.find(
          com => com.isPowered && !com.poweredBy.includes(this)
        )

        if (nextPoweringComponent) {
          this._poweredBy = [...this._poweredBy, nextPoweringComponent]
        } else {
          // if it is truly out of power, notify anyone it was also powering
          this.connectedComponents.filter(c => c !== removedPowerSource).forEach(component => {
            component.poweredBy = component.poweredBy.filter(c => c !== this)
          })
        }
      }
    }
  }

  connect (newComponent) {
    if (this.connectedComponents.includes(newComponent)) return
    this.connectedComponents.push(newComponent)

    if (newComponent.isPowered) {
      this.poweredBy = [...this.poweredBy, newComponent]
    }
    newComponent.connect(this)
  }

  disconnect (oldComponent) {
    if (!this.connectedComponents.includes(oldComponent)) return
    this.connectedComponents = this.connectedComponents.filter(x => x !== oldComponent)

    if (this.poweredBy.includes(oldComponent)) {
      this.poweredBy = this.poweredBy.filter(com => com !== oldComponent)
    }
    oldComponent.disconnect(this)
  }

  isOtherSegmentEnd (segmentCap) { return this === segmentCap.parentComponent }

  redraw ({ currentTarget, clientX, clientY, ...ev }) {
    const circleCapRadius = 4
    const offset = circleCapRadius * 2 + 2
    const movedEnd = currentTarget
    const xOffset = clientX - offset
    const yOffset = clientY - offset
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
})
