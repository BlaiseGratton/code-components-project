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
    .align-vertical {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    #save-template { margin: 1em;}
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
            <section class="align-vertical">
              <button id="save-template">Save</button>
            </section>
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

  async saveTemplate () {
    if (!this.baseURL) return window.alert('Server URL must be loaded')

    const content = this.container.exportTemplate()
    const headers = { 'Content-Type': 'application/json' }

    const body = JSON.stringify({
      name: 'test',
      content
    })

    const res = await fetch(`${this.baseURL}${body.name}.html`)
    if (res.ok && confirm(`Overwrite template ${body.name}?` || !res.ok)) {
      fetch(`${this.baseURL}`, { method: 'POST', headers, body })
    }
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
