const style = `
  <style>
    .name {
      font-size: .95em;
    }

    .sidebar-container {
      min-width: 14em;
      display: flex;
      flex-direction: column;
    }

    .form-container, .template-server-info {
      display: flex;
      flex-direction: column;
    }

    .template-list {
      display: flex;
      flex-direction: column;
    }

    .loader-button, input[type="submit"] {
      cursor: pointer;
    }

    .add-components-buttons {
      list-style: none;
    }

    .add-components-buttons button {
      max-width: 10em;
      cursor: pointer;
    }
  </style>
`


class LoaderSidebar extends HTMLElement {

  ALLOWED_ATTRIBUTES = ['x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height']

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
        <section class="selected-component">
          <h1>Selected Component</h1>
          <h2 class="name"></h2>
          <section class="attributes"></section>
        </section>
        <section class="add-components">
          <h1>Add Components</h1>
          <ul class="add-components-buttons">
            <li class="add-button-container">
              <button id="wire-segment">Wire Segment</button>
            </li>
            <li class="add-button-container">
              <button id="power-source">Power Source</button>
            </li>
            <li class="add-button-container">
              <button id="ground-connection">Ground</button>
            </li>
            <li class="add-button-container">
              <button id="simple-switch">Switch</button>
            </li>
            <li class="add-button-container">
              <button id="throw-switch">Throw Switch</button>
            </li>
            <li class="add-button-container">
              <button id="wire-coil">Wire Coil</button>
            </li>
            <li class="add-button-container">
              <button id="simple-bulb">Bulb</button>
            </li>
            <li class="add-button-container">
              <button id="simple-relay">Relay</button>
            </li>
            <li class="add-button-container">
              <button id="inverter-relay">Inverter Relay</button>
            </li>
          </ul>
        </section>
      </section>
    `

    this.appendChild(template.content)

    this.form = this.querySelector('form')
    this.formSection = this.querySelector('.form-container')
    this.serverInfoSection = this.querySelector('.template-server-info')
    this.serverURLTitle = this.serverInfoSection.querySelector('#server-url-title')
    this.templateList = this.querySelector('.template-list')
    this.handleLoadTemplates = this.handleLoadTemplates.bind(this)
    this.handleAddComponent = this.handleAddComponent.bind(this)
    this.form.onsubmit = this.handleLoadTemplates
    this.querySelectorAll('.add-components-buttons button')
      .forEach(button => button.onclick = this.handleAddComponent)
    this.selectedComponent = null
    this.selectedComponentName = this.querySelector('.selected-component .name')
    this.selectedComponentAttributes = this.querySelector('.selected-component .attributes')
    this.attributeEventHandlers = []
  }

  handleAddComponent (ev) {
    this.loader.addComponent(ev.target.id)
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
      this.loader.baseURL = this.baseURL
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
      this.loader.setTitle(url)
    })
  }

  handleSelectComponent (component) {
    this.selectedComponent = component
    this.selectedComponentName.textContent = component.tagName.replace('-', ' ')

    while (this.selectedComponentAttributes.firstChild) {
      this.selectedComponentAttributes.removeChild(this.selectedComponentAttributes.firstChild)
    }
    for (const attrName of this.ALLOWED_ATTRIBUTES) {
      if (component.hasAttribute(attrName)) this.handleBindAttribute(attrName)
    }
  }

  handleBindAttribute (attrName) {
    const attributeControl = document.createElement('attribute-control')
    this.selectedComponentAttributes.appendChild(attributeControl)
    attributeControl.registerAttribute(this.selectedComponent, attrName)
  }
}

window.customElements.define('loader-sidebar', LoaderSidebar)

export default LoaderSidebar
