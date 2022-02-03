class TemplateLoaderButton extends HTMLElement {
  
  connectedCallback () {
    const template = document.createElement('template') 

    template.innerHTML = `
      <button class="loader-button">Load ${this.url}</button>
    `
    this.appendChild(template.content)
    this.onclick = this.handleClick
  }

  handleClick (ev) {
    this.sidebar.loadTemplate(this.url)
  }
}

window.customElements.define('template-loader-button', TemplateLoaderButton)

export default TemplateLoaderButton 
