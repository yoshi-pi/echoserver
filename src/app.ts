import http from 'http'
import { Query } from './interfaces'
import { createRectangle } from './image'

const app = http.createServer((req, res) => {
  if (req.url === undefined) return res.end()
  const requestURL = new URL(req.url, `http://${req.headers.host}`)
  const query = requestURL.searchParams.get('query')
  if (query === null) return res.end()
  const queryObj: Query = JSON.parse(query)
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
  if (queryObj.headers !== undefined) {
    res.writeHead(200, queryObj.headers)
  }
  if (queryObj.body === undefined) return res.end()
  if (queryObj.body.type === 'image') {
    return res.end(createRectangle(queryObj.body.size))
  }
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
