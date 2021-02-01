require('../components/ComponentContainer')
require('../components/WireSegment')

const segmentString = `
  <component-container>
    <wire-segment x1="0" y1="10" x2="20" y2="30"></wire-segment>
  </component-container>
`


test('getting segment attributes in JavaScript', () => {
  document.body.innerHTML = segmentString

  const segment = document.querySelector('wire-segment')

  expect(segment.x1).toEqual(0)
  expect(segment.y1).toEqual(10)
  expect(segment.x2).toEqual(20)
  expect(segment.y2).toEqual(30)
})

test('setting segment attributes via HTMLElement', () => {
  document.body.innerHTML = segmentString

  const segment = document.querySelector('wire-segment')
  expect(segment.x1).toEqual(0)
  segment.x1 = 5

  expect(segment.x1).toEqual(5)
  expect(segment.y1).toEqual(10)
  expect(segment.x2).toEqual(20)
  expect(segment.y2).toEqual(30)
})
