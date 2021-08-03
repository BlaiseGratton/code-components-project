import ComponentContainer from '../ComponentContainer.js'

class FullAdder extends ComponentContainer {

  connectedCallback () {
    super.connectedCallback()

    this.svg.setAttribute('width', 500)
    this.svg.setAttribute('height', 450)
    this.svg.setAttribute('viewBox', '0 0 2300 1900')

    const template = document.createElement('template') 

    template.innerHTML = `
      <half-adder x="1050" y="50" id="half-adder-1"></half-adder>
      <half-adder x="75" y="428" id="half-adder-2"></half-adder>
      <or-gate x="2050" y="1100"></or-gate>
      <wire-segment x1="0" y1="139" x2="950" y2="300" id="carry-in"></wire-segment>
      <wire-segment x1="0" y1="907" x2="50" y2="907" id="outer-input-1"></wire-segment>
      <wire-segment x1="0" y1="1397" x2="50" y2="1397" id="outer-input-2"></wire-segment>
      <wire-segment x1="950" y1="300" x2="1025" y2="529"></wire-segment>
      <wire-segment x1="965" y1="1019" x2="1025" y2="1019"></wire-segment>
      <wire-segment x1="965" y1="1578" x2="1925" y2="1540"></wire-segment>
      <wire-segment x1="1925" y1="1540" x2="2022" y2="1421"></wire-segment>
      <wire-segment x1="1939" y1="1200" x2="2021" y2="1213"></wire-segment>
      <wire-segment x1="2264" y1="1326" x2="2292" y2="1326"></wire-segment>
      <wire-segment x1="1939" y1="640" x2="2292" y2="640"></wire-segment>
    `
    this.appendChild(template.content)

    const carryIn = this.querySelector('#carry-in')
    const input1 = this.querySelector('#outer-input-1')
    const input2 = this.querySelector('#outer-input-2')

    carryIn.noDisconnect = true
    input1.noDisconnect = true
    input2.noDisconnect = true

    this.carryIn = this.parentElement.exposeWireCap(carryIn.end1, 'left')
    this.input1 = this.parentElement.exposeWireCap(input1.end1, 'left')
    this.input2 = this.parentElement.exposeWireCap(input2.end1, 'left')
  }
  
}

window.customElements.define('full-adder', FullAdder)

export default FullAdder
