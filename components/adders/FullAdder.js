import ComponentContainer from '../ComponentContainer.js'

class FullAdder extends ComponentContainer {

  defaultWidth = 2300
  defaultHeight = 1900

  connectedCallback () {
    super.connectedCallback()

    const template = document.createElement('template') 

    template.innerHTML = `
      <half-adder x="${75 * this.scale}" y="${428 * this.scale}" scale="${this.scale}" id="half-adder-1"></half-adder>
      <half-adder x="${1050 * this.scale}" y="${50 * this.scale}" scale="${this.scale}" id="half-adder-2"></half-adder>
      <or-gate x="${2050 * this.scale}" y="${1100 * this.scale}" scale="${this.scale}" id="full-adder-or-gate"></or-gate>
      <wire-segment x1="0" y1="139" x2="950" y2="300" id="carry-in"></wire-segment>
      <wire-segment x1="0" y1="907" x2="50" y2="907" id="outer-input-1"></wire-segment>
      <wire-segment x1="0" y1="1397" x2="50" y2="1397" id="outer-input-2"></wire-segment>

      <wire-segment x1="950" y1="300" x2="1025" y2="529" id="carry-in-to-adder-2"></wire-segment>
      <wire-segment x1="965" y1="1019" x2="1025" y2="1019" id="adder-1-sum-out"></wire-segment>
      <wire-segment x1="965" y1="1578" x2="1925" y2="1540" id="adder-1-carry-out_1"></wire-segment>
      <wire-segment x1="1939" y1="640" x2="2292" y2="640" id="final-sum-out"></wire-segment>
      <wire-segment x1="1939" y1="1200" x2="2021" y2="1213" id="adder-2-carry-out"></wire-segment>
      <wire-segment x1="1925" y1="1540" x2="2022" y2="1421" id="adder-1-carry-out_2"></wire-segment>
      <wire-segment x1="2264" y1="1326" x2="2292" y2="1326" id="final-carry-out"></wire-segment>
    `
    this.appendChild(template.content)

    const input1 = this.querySelector('#outer-input-1')
    const input2 = this.querySelector('#outer-input-2')
    const carryIn = this.querySelector('#carry-in')
    const carryInToAdder2 = this.querySelector('#carry-in-to-adder-2')
    const adder1SumOut = this.querySelector('#adder-1-sum-out')
    const adder1CarryOut1 = this.querySelector('#adder-1-carry-out_1')
    const adder1CarryOut2 = this.querySelector('#adder-1-carry-out_2')
    const adder2CarryOut = this.querySelector('#adder-2-carry-out')
    const sumOut = this.querySelector('#final-sum-out')
    const carryOut = this.querySelector('#final-carry-out')
    const halfAdder1 = this.querySelector('#half-adder-1')
    const halfAdder2 = this.querySelector('#half-adder-2')
    const ORGate = this.querySelector('#full-adder-or-gate')

    carryIn.noDisconnect = true
    input1.noDisconnect = true
    input2.noDisconnect = true
    sumOut.noDisconnect = true
    carryOut.noDisconnect = true

    this.carryIn = this.parentElement.exposeWireCap(carryIn.end1, 'left')
    this.input1 = this.parentElement.exposeWireCap(input1.end1, 'left')
    this.input2 = this.parentElement.exposeWireCap(input2.end1, 'left')
    this.sumOut = this.parentElement.exposeWireCap(sumOut.end2, 'right')
    this.carryOut = this.parentElement.exposeWireCap(carryOut.end2, 'right')

    carryIn.connect(carryInToAdder2)
    carryInToAdder2.connect(halfAdder2.inputWire1)
    sumOut.connect(halfAdder2.sumOut)

    input1.connect(halfAdder1.inputWire1)
    halfAdder1.sumOut.connect(adder1SumOut)
    adder1SumOut.connect(halfAdder2.inputWire2)
    halfAdder2.carryOut.connect(adder2CarryOut)

    input2.connect(halfAdder1.inputWire2)
    halfAdder1.carryOut.connect(adder1CarryOut1)
    adder1CarryOut1.connect(adder1CarryOut2)
    adder1CarryOut2.connect(ORGate.inputWire2)

    adder2CarryOut.connect(ORGate.inputWire1)
    ORGate.outputWire.connect(carryOut)
  }
  
}

window.customElements.define('full-adder', FullAdder)

export default FullAdder
