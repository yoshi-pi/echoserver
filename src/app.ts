import http from 'http'
import { Query } from './interfaces'
import { createRectangle } from './image'

const app = http.createServer((req, res) => {
  // Setup
  if (req.url === undefined) return res.end()
  const requestURL = new URL(req.url, `http://${req.headers.host}`)
  const query = requestURL.searchParams.get('query')
  if (query === null) return res.end()
  const queryObj: Query = JSON.parse(query)

  // CORS Preflight
  if (
    queryObj.corsPreflight !== undefined &&
    req.method === 'OPTIONS' &&
    'access-control-request-method' in req.headers &&
    'origin' in req.headers
  ) {
    const statusCode = queryObj.corsPreflight.status || 200
    res.writeHead(statusCode, queryObj.corsPreflight.headers)
    return res.end()
  }

  // Status Code and Headers
  const statusCode = queryObj.status || 200
  if (queryObj.headers !== undefined) {
    res.writeHead(statusCode, queryObj.headers)
  } else {
    res.statusCode = statusCode
  }

  // Body
  if (queryObj.body === undefined) return res.end()
  // image body
  if (queryObj.body.type === 'image') {
    return res.end(createRectangle(queryObj.body.size))
  }
  // text body
  if (queryObj.body.type === 'text') {
    let resBody = ''
    if (typeof queryObj.body.data === 'object') {
      resBody = JSON.stringify(queryObj.body.data)
    } else {
      resBody = queryObj.body.data
    }
    return res.end(resBody)
  }
})

export default app
