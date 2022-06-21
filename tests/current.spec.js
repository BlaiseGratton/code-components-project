import * as components from '../components/index.js'

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

describe('determining the direction of current flow in a wire segment', () => {

  it('completes a circuit when all segments are lined up', () => {
    document.body.innerHTML = `
      <component-container width="2500" height="1950">
        <power-source id="power-1"></power-source>
        <power-source x="200" id="power-2"></power-source>
        <ground-connection></ground-connection>
        <wire-segment x1="18" y1="77" x2="18" y2="139" id="wire-2"></wire-segment>
        <wire-coil x1="18" y1="139" x2="90" y2="140" id="wire-coil"></wire-coil>
        <wire-segment x1="90" y1="140" x2="80" y2="30"i id="wire-3"></wire-segment>
        <wire-segment x1="190" y1="150" x2="80" y2="30"i id="wire-4"></wire-segment>
        <simple-bulb x1="80" y1="30" x2="115" y2="58"></simple-bulb>
      </component-container>
    `
    const bulb = document.querySelector('simple-bulb')
    const power1 = document.querySelector('#power-1')
    const power2 = document.querySelector('#power-2')
    const wire1 = power1.connectedComponents[0]
    const wire2 = document.querySelector('#wire-2')
    const wire3 = document.querySelector('#wire-3')
    const wire4 = document.querySelector('#wire-4')
    const wire6 = power2.connectedComponents[0]
    const coil = document.querySelector('wire-coil')
    const ground = document.querySelector('ground-connection')
    const wire5 = ground.connectedComponents[0]

    expect(bulb).not.toBeNull()
    expect(power1).not.toBeNull()
    expect(power2).not.toBeNull()
    expect(wire1).not.toBeNull()
    expect(wire2).not.toBeNull()
    expect(wire3).not.toBeNull()
    expect(wire4).not.toBeNull()
    expect(wire5).not.toBeNull()
    expect(coil).not.toBeNull()
    expect(ground).not.toBeNull()

    expect(wire1.connectedComponents.length).toBe(2)
    expect(wire1.connectedComponents[0]).toEqual(power1)
    expect(wire1.connectedComponents[1]).toEqual(wire2)

    expect(bulb.isPowered).toBeTruthy()
    expect(bulb.isGrounded).toBeTruthy()
    expect(bulb.isLit).toBeTruthy()
    expect(wire1.hasCurrent).toBeTruthy()
    wire2.y1 = 157  // adjust it slightly to trigger a flow change
    wire2.y1 = 77 
    expect(wire2.hasCurrent).toBeTruthy()
    expect(wire4.hasCurrent).toBeFalsy()

    // move the power source's wire to break the connection
    wire1.x2 = 10
    expect(bulb.isPowered).toBeFalsy()
  })
})

