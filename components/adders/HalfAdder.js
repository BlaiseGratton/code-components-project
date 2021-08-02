import ComponentContainer from '../ComponentContainer.js'

class HalfAdder extends ComponentContainer {

  defaultWidth = 872
  defaultHeight = 1420

  connectedCallback () {
    super.connectedCallback()

    const template = document.createElement('template') 

    template.innerHTML = `
      <wire-segment x1="1" y1="478" x2="18" y2="478" id="input-1"></wire-segment>
      <wire-segment x1="51" y1="269" x2="18" y2="478" id="input-1-to-xor"></wire-segment>
      <wire-segment x1="18" y1="478" x2="70" y2="1100" id="input-1-to-and_1"></wire-segment>
      <wire-segment x1="70" y1="1100" x2="298" y2="1143" id="input-1-to-and_2"></wire-segment>

      <wire-segment x1="1" y1="969" x2="18" y2="969" id="input-2"></wire-segment>
      <wire-segment x1="18" y1="969" x2="51" y2="738" id="input-2-to-xor"></wire-segment>
      <wire-segment x1="18" y1="969" x2="51" y2="1300" id="input-2-to-and_1"></wire-segment>
      <wire-segment x1="51" y1="1300" x2="298" y2="1323" id="input-2-to-and_2"></wire-segment>

      <xor-gate x="${75 * this.scale}" y="${50 * this.scale}" scale="${this.scale}"id="xor-gate"></xor-gate>
      <and-gate x="${325 * this.scale}" y="${1000 * this.scale}" scale="${this.scale}" id="and-gate"></and-gate>
      <wire-segment x1="540" y1="1290" x2="864" y2="1150" id="carry-out"></wire-segment>
    `
    this.appendChild(template.content)

    const inputWire1 = this.querySelector('#input-1')
    const inputWire2 = this.querySelector('#input-2')
    const carryOut = this.querySelector('#carry-out')
    const sumOut = this.querySelector('xor-gate').outputWire

    inputWire1.noDisconnect = true
    inputWire2.noDisconnect = true
    carryOut.noDisconnect = true
    sumOut.noDisconnect = true

    this.inputWire1 = this.parentElement.exposeWireCap(inputWire1.end1, 'left')
    this.inputWire2 = this.parentElement.exposeWireCap(inputWire2.end1, 'left')
    this.carryOut = this.parentElement.exposeWireCap(carryOut.end2, 'right')
    this.sumOut = this.parentElement.exposeWireCap(sumOut.end2, 'right')

    const input1toXOR = this.querySelector('#input-1-to-xor')
    const input1toAND1 = this.querySelector('#input-1-to-and_1')
    const input1toAND2 = this.querySelector('#input-1-to-and_2')
    this.XORGate = this.querySelector('#xor-gate')
    this.ANDGate = this.querySelector('#and-gate')
    inputWire1.connect(input1toXOR)
    input1toXOR.connect(this.XORGate.inputWire1)
    inputWire1.connect(input1toAND1)
    input1toAND1.connect(input1toAND2)
    input1toAND2.connect(this.ANDGate.inputWire1)

    const input2toXOR = this.querySelector('#input-2-to-xor')
    const input2toAND1 = this.querySelector('#input-2-to-and_1')
    const input2toAND2 = this.querySelector('#input-2-to-and_2')
    inputWire2.connect(input2toXOR)
    input2toXOR.connect(this.XORGate.inputWire2)
    inputWire2.connect(input2toAND1)
    input2toAND1.connect(input2toAND2)
    input2toAND2.connect(this.ANDGate.inputWire2)
    this.ANDGate.outputWire.connect(carryOut)
  }
  
}

window.customElements.define('half-adder', HalfAdder)

export default HalfAdder
