import ComponentContainer from '../ComponentContainer.js'

class XORGate extends ComponentContainer {

  defaultWidth = 772
  defaultHeight = 900

  connectedCallback () {
    super.connectedCallback()

    const template = document.createElement('template') 

    template.innerHTML = `
      <wire-segment x1="1" y1="217" x2="130" y2="217" id="xor-input-1"></wire-segment>
      <wire-segment x1="130" y1="217" x2="223" y2="121" id="input-1-to-OR"></wire-segment>
      <wire-segment x1="130" y1="217" x2="223" y2="600" id="input-1-to-NAND"></wire-segment>

      <wire-segment x1="1" y1="687" x2="130" y2="687" id="xor-input-2"></wire-segment>
      <wire-segment x1="130" y1="687" x2="223" y2="332" id="input-2-to-OR"></wire-segment>
      <wire-segment x1="130" y1="687" x2="223" y2="810" id="input-2-to-NAND"></wire-segment>

      <or-gate x="${250 * this.scale}" y="${10 * this.scale}" scale="${this.scale}"></or-gate>
      <nand-gate x="${250 * this.scale}" y="${490 * this.scale}" scale="${this.scale}"></nand-gate>
      <wire-segment x1="465" y1="237" x2="522" y2="394" id="or-connector"></wire-segment>
      <wire-segment x1="465" y1="714" x2="524" y2="571" id="nand-connector"></wire-segment>
      <and-gate x="${550 * this.scale}" y="${250 * this.scale}" scale="${this.scale}"></and-gate>
    `
    this.appendChild(template.content)

    this.ORGate = this.querySelector('or-gate')
    this.NANDGate = this.querySelector('nand-gate')
    this.ANDGate = this.querySelector('and-gate')

    const inputWire1 = this.querySelector('#xor-input-1')
    const inputWire2 = this.querySelector('#xor-input-2')
    const outputWire = this.ANDGate.outputWire

    const input1ToOR = this.querySelector('#input-1-to-OR')
    const input1ToNAND = this.querySelector('#input-1-to-NAND')
    inputWire1.connect(input1ToOR)
    inputWire1.connect(input1ToNAND)
    input1ToOR.connect(this.ORGate.inputWire1)
    input1ToNAND.connect(this.NANDGate.inputWire1)

    const input2ToOR = this.querySelector('#input-2-to-OR')
    const input2ToNAND = this.querySelector('#input-2-to-NAND')
    inputWire2.connect(input2ToOR)
    inputWire2.connect(input2ToNAND)
    input2ToOR.connect(this.ORGate.inputWire2)
    input2ToNAND.connect(this.NANDGate.inputWire2)

    const ORConnector = this.querySelector('#or-connector')
    ORConnector.connect(this.ORGate.outputWire)
    ORConnector.connect(this.ANDGate.inputWire1)

    const NANDConnector = this.querySelector('#nand-connector')
    NANDConnector.connect(this.NANDGate.outputWire)
    NANDConnector.connect(this.ANDGate.inputWire2)

    inputWire1.noDisconnect = true
    inputWire2.noDisconnect = true
    outputWire.noDisconnect = true

    this.inputWire1 = this.parentElement.exposeWireCap(inputWire1.end1, 'left')
    this.inputWire2 = this.parentElement.exposeWireCap(inputWire2.end1, 'left')
    this.outputWire = this.parentElement.exposeWireCap(outputWire.end2, 'right')

    this.exposedComponents = [this.inputWire1, this.inputWire2, this.outputWire]
  }
  
}

window.customElements.define('xor-gate', XORGate)

export default XORGate
