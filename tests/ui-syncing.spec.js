require('../components/')

describe('', () => {
  it('renders', () => {
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
