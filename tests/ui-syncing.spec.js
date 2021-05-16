require('../components/')

// jsdom does not fully support all SVGElement methods, so have to figure out how to
// fill in the gaps here
const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))

const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn((end, rectangle) => {
  let pointsAreFound = false
  let x
  let y

  if (end === end.parentComponent.end1) {
    pointsAreFound = true
    x = end.parentComponent.x1
    y = end.parentComponent.y1
  }
  if (end === end.parentComponent.end2) {
    pointsAreFound = true
    x = end.parentComponent.x2
    y = end.parentComponent.y2
  }

  if (pointsAreFound) {
    return (
      x >= rectangle.x && x <= (rectangle.x + rectangle.width) &&
      y >= rectangle.y && y <= (rectangle.y + rectangle.height)
    )
  }
  return false
})

describe('setting the component element coordinates', () => {
  it('keeps the svg coordinates in sync', () => {
    document.body.innerHTML = '<component-container></component-container>'
    const container = document.querySelector('component-container')
    const svg = container.querySelector('svg')
    expect(container.childElementCount).toBe(2)  // <style>, <svg>
    expect(svg.childElementCount).toBe(0)

    const segment = container.addWireSegment()
    expect(container.childElementCount).toBe(3)  // <style>, <svg>, <wire-segment>
    expect(svg.childElementCount).toBe(3)  // <circle> <line> <circle>

    const segmentLine = svg.querySelector('line')
    expect(segmentLine.parentComponent === segment).toBeTruthy()
    expect(segment.x1).toEqual(0)
    expect(+segmentLine.getAttribute('x1')).toEqual(0)
    expect(segment.y1).toEqual(0)
    expect(+segmentLine.getAttribute('y1')).toEqual(0)
    expect(+segment.getAttribute('x1')).toEqual(0)
    expect(+segment.getAttribute('y1')).toEqual(0)
    expect(+segment.getAttribute('x2')).toEqual(20)
    expect(+segment.getAttribute('y2')).toEqual(20)

    expect(segment.x2).toEqual(20)
    expect(+segmentLine.getAttribute('x2')).toEqual(20)
    expect(segment.y2).toEqual(20)
    expect(+segmentLine.getAttribute('y2')).toEqual(20)

    expect(+segment.end1.getAttribute('cx')).toEqual(0)
    expect(+segment.end1.getAttribute('cy')).toEqual(0)
    expect(+segment.end2.getAttribute('cx')).toEqual(20)
    expect(+segment.end2.getAttribute('cy')).toEqual(20)
  })
})

describe('moving the component element coordinates', () => {

  it('connects the components when they overlay in the svg', () => {
    document.body.innerHTML = '<component-container></component-container>'
    const container = document.querySelector('component-container')
    const svg = container.querySelector('svg')
    const power = container.addPowerSource()
    const powerWire = power.addWireSegment()
    expect(powerWire.isPowered).toBeTruthy()
    const segment = container.addWireSegment()
    expect(segment.isPowered).toBeFalsy()

    segment.x2 = powerWire.x2
    segment.y2 = powerWire.y2
    const mouseEvent = document.createEvent('MouseEvents')

    expect(+segment.line.getAttribute('x2')).toEqual(22)
    expect(+segment.line.getAttribute('y2')).toEqual(80)
    expect(segment.isPowered).toBeTruthy()
  })
})


describe('loading a positionally aligned circuit', () => {

  it('completes a circuit when all segments are lined up', () => {
    document.body.innerHTML = `
      <component-container>
        <power-source></power-source>
        <ground-connection></ground-connection>
        <wire-segment x1="18" y1="77" x2="18" y2="139" id="wire-2"></wire-segment>
        <wire-coil x1="18" y1="139" x2="90" y2="140" id="wire-coil"></wire-coil>
        <wire-segment x1="90" y1="140" x2="80" y2="30"i id="wire-3"></wire-segment>
        <simple-bulb x1="80" y1="30" x2="115" y2="58"></simple-bulb>
      </component-container>
    `
    const bulb = document.querySelector('simple-bulb')
    const power = document.querySelector('power-source')
    const wire1 = power.connectedComponents[0]
    const wire2 = document.querySelector('#wire-2')
    const wire3 = document.querySelector('#wire-3')
    const coil = document.querySelector('wire-coil')
    const ground = document.querySelector('ground-connection')
    const wire4 = ground.connectedComponents[0]

    expect(bulb).not.toBeNull()
    expect(power).not.toBeNull()
    expect(wire1).not.toBeNull()
    expect(wire2).not.toBeNull()
    expect(wire3).not.toBeNull()
    expect(wire4).not.toBeNull()
    expect(coil).not.toBeNull()
    expect(ground).not.toBeNull()

    expect(wire1.connectedComponents.length).toBe(2)
    expect(wire1.connectedComponents[0]).toEqual(power)
    expect(wire1.connectedComponents[1]).toEqual(wire2)

    expect(bulb.isPowered).toBeTruthy()
    expect(bulb.isGrounded).toBeTruthy()
    expect(bulb.isLit).toBeTruthy()

    // move the power source's wire to break the connection
    wire1.x2 = 10
    expect(bulb.isPowered).toBeFalsy()
  })
})
