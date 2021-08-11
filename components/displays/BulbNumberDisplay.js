import ComponentContainer from '../ComponentContainer.js'

class BulbNumberDisplay extends ComponentContainer {

  defaultWidth = 100 
  defaultHeight = 80

  get extraProps () {
    return `bits="${this.bits}"`
  }

  onCurrentChange () {
    const bitString = this.bulbs.map(bulb => bulb.isLit ? '1' : '0').reverse().join('')
    this.value = parseInt(bitString, 2)
  }

  set value (value) {
    this.display.textContent = value
    this._value = value
  }

  constructor () {
    super()
    this.onCurrentChange = this.onCurrentChange.bind(this)
  }

  connectedCallback () {
    super.connectedCallback()

    const bits = parseInt(this.attributes.bits && this.attributes.bits.value) || 1
    this.bits = bits
    this.defaultHeight *= bits
    this.setViewBox()
    this.svg.setAttribute('height', this.defaultHeight)
    const bulbs = Array(bits).fill().map((_, i) => i)

    const template = document.createElement('template') 

    template.innerHTML = `
      ${bulbs.map((_, i) => {
        const offset = i * this.defaultHeight / bits
        return `
          <simple-bulb x1="10" y1="${60 + offset}" x2="84" y2="${60 + offset}" id="bulb-${i + 1}"></simple-bulb>
          <ground-connection x="-32" y="${offset + 4}" scale=".4"></ground-connection>
          `
        }
      ).join('')}
    `

    const display = document.createElement('p')
    display.textContent = this.value
    display.style.position = 'absolute'
    display.style.top = '-43px'
    display.style.left = '45px'
    display.style.fontSize = '20px'
    this.appendChild(display)
    this.appendChild(template.content)
    this.display = display
    this.bulbs = []
    
    bulbs.forEach((_, i) => {
      const bulb = this.querySelector('#bulb-' + (i + 1))
      bulb.noDisconnect = true
      bulb.parentElement.parentElement.exposeWireCap(bulb.end1, 'left')
      bulb.parentElement.parentElement.exposeWireCap(bulb.end2, 'right')
      this.bulbs.push(bulb)
      bulb.onCurrentChange = this.onCurrentChange
    })

    this.onCurrentChange()
  }
}

window.customElements.define('bulb-number-display', BulbNumberDisplay)

export default BulbNumberDisplay
