import LoaderContainer from './Container.js'
import LoaderSidebar from './SideBar.js'
import TemplateLoaderButton from './TemplateLoaderButton.js'

const style = `
  <style>
    .wrapper {
      display: flex;
      flex-direction: row;
    }
    .main-container {
      display: flex;
      flex-direction: column;
    }
  </style>
`

class TemplateLoader extends HTMLElement {
  
  connectedCallback () {
    const template = document.createElement('template') 

    template.innerHTML = `
      ${style}
      <section class="wrapper">
        <loader-sidebar></loader-sidebar>
        <section class="main-container">
          <section class="wrapper">
            <h1 id="container-title">No template loaded</h1>
            <button id="save-template">Save</button>
          </section>
          <loader-container></loader-container>
        </section>
      </section>
    `
    this.appendChild(template.content)

    const sidebar = this.querySelector('loader-sidebar')
    const container = this.querySelector('loader-container')
    sidebar.loader = this
    container.loader = this
    this.sidebar = sidebar
    this.container = container
    this.containerTitle = this.querySelector('#container-title')
    this.saveButton = this.querySelector('#save-template')
    this.saveButton.onclick = this.saveTemplate.bind(this)
  }

  saveTemplate () {
    if (!this.baseURL) window.alert('Server URL must be loaded')

    const content = this.container.exportTemplate()
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({
      name: 'test',
      content
    })

    fetch(`${this.baseURL}`, { method: 'POST', headers, body })
  }

  setTitle (value) {
    this.containerTitle.textContent = value
  }

  loadTemplate (content) {
    this.container.loadTemplate(content)
  }

  addComponent (name) {
    this.container.addComponent(name)
  }
}

window.customElements.define('template-loader', TemplateLoader)

export default TemplateLoader
