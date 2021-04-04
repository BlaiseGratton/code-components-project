require('../components/')

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
  // jsdom does not fully support all SVGElement methods, so have to figure out how to
  // fill in the gaps here
  const mockCreateSVGRect = SVGSVGElement.prototype.createSVGRect = jest.fn(() => ({}))
  const mockCheckIntersection = SVGSVGElement.prototype.checkIntersection = jest.fn(() => true)

  it('connects the components when they overlay in the svg', () => {
    document.body.innerHTML = '<component-container></component-container>'
    const container = document.querySelector('component-container')
    const svg = container.querySelector('svg')
    const power = container.addPowerSource()
    const powerWire = power.addWireSegment()
    expect(powerWire.isPowered).toBeTruthy()
    const segment = container.addWireSegment()
    expect(segment.isPowered).toBeFalsy()

    segment.x2 = powerWire.x1
    segment.y2 = powerWire.y1
    const mouseEvent = document.createEvent('MouseEvents')
    mouseEvent.initEvent('mouseup', true, true)
    segment.end2.dispatchEvent(mouseEvent)

    expect(+segment.line.getAttribute('x2')).toEqual(22)
    expect(+segment.line.getAttribute('y2')).toEqual(40)
    expect(segment.isPowered).toBeTruthy()
  })
})
