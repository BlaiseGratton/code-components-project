class AttributeControl extends HTMLElement {
  
  connectedCallback () {
    const template = document.createElement('template') 

    template.innerHTML = `
      <section>
        <label>${this.attributeName}</label>
        <input type="number" step="4" value="${this.attributeValue}"></input>
      </section>
    `
    this.appendChild(template.content)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.label = this.querySelector('label')
    this.input = this.querySelector('input')
    this.input.onchange = this.handleInputChange
  }

  registerAttribute (component, attributeName) {
    this.attributeName = attributeName
    this.attributeValue = component.getAttribute(attributeName)
    this.component = component
    if (attributeName === 'scale') this.input.setAttribute('step', '0.01')
  }

  get attributeName () { return this._name }

  set attributeName (value) {
    this.label.textContent = value
    this._name = value
  }

  get attributeValue () { return this._value }

  set attributeValue (value) {
    this.input.value = value
    this._value = value
  }

  handleInputChange (event) {
    const newValue = event.target.value
    this.value = newValue
    this.component[this.attributeName] = newValue
  }
}

window.customElements.define('attribute-control', AttributeControl)

export default AttributeControl 
