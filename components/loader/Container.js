import LoaderSidebar from './SideBar.js'

class LoaderContainer extends HTMLElement {
  
  connectedCallback () {
    const template = document.createElement('template') 

    template.innerHTML = `
      <section>
        <h1>Loader Container</h1>
      </section>
    `

    this.appendChild(template.content)
  }
}

window.customElements.define('loader-container', LoaderContainer)

export default LoaderContainer 
