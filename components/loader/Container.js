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
    let component = ev.target.parentComponent

    // in case a wire is assigned a parent as part of a larger component
    if (component && component.localName === 'wire-segment')
      component = component.parentComponent || component

    // if no parent component but the event is caught by a container e.g. a relay
    if (!component)
      component = ev.target.parentElement
    this.loader.sidebar.handleSelectComponent(component)
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
