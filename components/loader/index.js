import LoaderContainer from './Container.js'
import LoaderSidebar from './SideBar.js'
import TemplateLoaderButton from './TemplateLoaderButton.js'

const style = `
  <style>
    .container {
      display: flex;
      flex-direction: row;
    }
  </style>
`

class TemplateLoader extends HTMLElement {
  
  connectedCallback () {
    const template = document.createElement('template') 

    template.innerHTML = `
      ${style}
      <section class="container">
        <loader-sidebar></loader-sidebar>
        <loader-container></loader-container>
      </section>
    `
    this.appendChild(template.content)

    const sidebar = this.querySelector('loader-sidebar')
    const container = this.querySelector('loader-container')
    sidebar.loader = this
    container.loader = this
    this.sidebar = sidebar
    this.container = container
  }

  loadTemplate (content) {
    const template = document.createElement('template')
    template.innerHTML = content
    this.container.appendChild(template.content)
  }

}

window.customElements.define('template-loader', TemplateLoader)

export default TemplateLoader
