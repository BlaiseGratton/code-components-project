const style = `
  <style>
    .sidebar-container {
      min-width: 14em;
      display: flex;
      flex-direction: column;
    }

    .form-container, .template-server-info {
      display: flex;
      flex-direction: column;
    }

    .loader-button, input[type="submit"] {
      cursor: pointer;
    }
  </style>
`


class LoaderSidebar extends HTMLElement {

  connectedCallback () {
    const template = document.createElement('template') 

    template.innerHTML = `
      ${style}
      <section class="sidebar-container">
        <section class="form-container">
          <form>
            <h1>Load a template server</h1>
            <input type="url" required name="templates-url"/>
            <input type="submit" value="Load"/>
          </form>
        </section>
        <section class="template-server-info" style="display: none;">
          <h1>Using template server</h1>
          <h2 id="server-url-title"></h2>
        </section>
        <section class="template-list"></section>
      </section>
    `

    this.appendChild(template.content)

    this.form = this.querySelector('form')
    this.formSection = this.querySelector('.form-container')
    this.serverInfoSection = this.querySelector('.template-server-info')
    this.serverURLTitle = this.serverInfoSection.querySelector('#server-url-title')
    this.templateList = this.querySelector('.template-list')
    this.handleLoadTemplates = this.handleLoadTemplates.bind(this)
    this.form.onsubmit = this.handleLoadTemplates
  }

  handleLoadTemplates (ev) {
    ev.preventDefault()
    const url = ev.target.elements['templates-url'].value

    fetch(url).then(res => res.json()).then(data => {
      this.appendTemplateList(data)
      this.formSection.style.display = 'none'
      this.serverInfoSection.style.display = 'inherit'
      this.serverURLTitle.textContent = url
      url[url.length - 1] === '/' ?
        this.baseURL = url :
        this.baseURL = url + '/'
    })
  }

  appendTemplateList (data) {
    data.forEach(templateURL => {
      const loaderButton = document.createElement('template-loader-button')
      loaderButton.url = templateURL
      loaderButton.sidebar = this
      this.templateList.appendChild(loaderButton)
    })
  }

  loadTemplate (url) {
    fetch(this.baseURL + url).then(res => res.text()).then(html => {
      this.loader.loadTemplate(html)
    })
  }

}

window.customElements.define('loader-sidebar', LoaderSidebar)

export default LoaderSidebar