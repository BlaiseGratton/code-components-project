import LoaderSidebar from './SideBar.js'

class LoaderContainer extends HTMLElement {
  
  connectedCallback () {
    const template = document.createElement('template') 

    template.innerHTML = `
      <section>
        <h1>Loader Container</h1>
        <section id="container-wrapper"></section>
      </section>
    `

    this.appendChild(template.content)
    this.handleContainerClick = this.handleContainerClick.bind(this)
    this.containerWrapper = this.querySelector('#container-wrapper')
  }

  constructor () {
    super()
    this.container = null
  }

  handleContainerClick (ev) {
    console.log(ev.target.parentElement)
  }

  createContainerElement () {
    const template = document.createElement('template')
    template.innerHTML = '<component-container width="1000" height="1000"></component-container>'
    this.containerWrapper.appendChild(template.content)
    this.container = this.querySelector('component-container')
    this.container.onclick = this.handleContainerClick
  }

  addComponent (name) {
    if (!this.container) {
      this.createContainerElement()
    }
    this.container.addComponent(name)
  }

  loadTemplate (content) {
    const template = document.createElement('template')
    template.innerHTML = content
    this.container = template.content.querySelector('component-container')
    this.container.onclick = this.handleContainerClick
    this.containerWrapper.appendChild(template.content)
  }

  exportTemplate () {
    return this.container && this.container.toRepresentation()
  }
}

window.customElements.define('loader-container', LoaderContainer)

export default LoaderContainer 
