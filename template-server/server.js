import { readdirSync } from 'fs'
import { createServer } from 'http'

const htmlContentType = { 'Content-Type': 'text/html' }

const handleRequest = (req, res) => {
  if (req.url !== '/') {
    res.writeHead(404, htmlContentType)
    res.end('not found')
  } else if (req.method === 'GET')
    handleGet(req, res)
  else if (req.method === 'POST')
    handlePost(req, res)
}

const handleGet = (req, res) => {
  res.writeHead(200, htmlContentType)
  res.end(JSON.stringify(readdirSync('./templates')))
}

const handlePost = (req, res) => {
  let body = ''

  req.on('data', data => {
    body += data
  })

  req.on('end', () => {
    const parsedBody = JSON.parse(body)
    console.log(parsedBody)
    res.writeHead(201, htmlContentType)
    res.end()
  })
}

const server = createServer(handleRequest)

const port = process.env.PORT || 3127

server.listen(port)
console.log(`ready on port ${port}`)
