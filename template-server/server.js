import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { createServer } from 'http'

const htmlContentType = { 'Content-Type': 'text/html' }

const accessHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type'
}

const handleOPTIONS = (req, res) => {
  res.writeHead(204, accessHeaders)
  res.end()
}

const handleGET = (req, res) => {
  const [path, rawParams] = req.url.split('?')

  const params = (
    rawParams ?
      rawParams.split('&').reduce((result, current) => {
        const [key, val] = current.split('=')
        return { ...result, key: val }
      }, {})
      : {})

  try {
    if (path === '/') {
      res.writeHead(200, { ...htmlContentType, ...accessHeaders })
      const templates = readdirSync('./templates').filter(fileName => {
        const parts = fileName.split('.')
        const extension = parts[parts.length - 1]
        return extension === 'html'
      })
      res.end(JSON.stringify(templates))
    } else {
      const fileName = path.slice(1)

      if (!fileName) {
        handleFailure(res, 'correct file path needed', 404)
      }

      try {
        const content = readFileSync(`./templates/${fileName}`)
        res.writeHead(200, { ...htmlContentType, ...accessHeaders })
        res.end(content)
      } catch (e) {
        if (e.code === 'ENOENT')
          handleFailure(res, 'correct file path needed', 404)
        else
          handleFailure(res, e)
      }
    }
  } catch (e) {
    handleFailure(res, e)
  }
}

const handlePOST = (req, res) => {

  if (req.url == '/') {
    let body = ''
    req.on('data', datum => { body += datum })

    req.on('end', () => {
      try {
        const { name, content } = JSON.parse(body)
        writeFileSync(`./templates/${name}.html`, content)
        res.writeHead(201, { ...htmlContentType, ...accessHeaders })
        res.end(content)
      } catch (e) {
        handleFailure(res, e)
      }
    })
  } else res.writeHead(404) && res.end()
}

const handleFailure = (res, error, status=500) => {
  console.error(error)
  res.writeHead(status, { ...htmlContentType, ...accessHeaders })
  res.end(error.toString())
}

const handlers = {
  'GET': handleGET,
  'POST': handlePOST,
  'OPTIONS': handleOPTIONS
}

const handleRequest = (req, res) => {
  try {
    handlers[req.method](req, res)
  } catch (e) {
    res.writeHead(405, htmlContentType)
    res.end(e.toString())
  } finally {
    console.log(req.method, req.url, res.statusCode)
  }
}

const server = createServer(handleRequest)

const port = process.env.PORT || 3127

server.listen(port)
console.log(`ready on port ${port}`)
