import http, { OutgoingHttpHeaders } from 'http'
import { ParsedBody, ParsedCORSPreflight } from './interfaces'
import { createRectangle } from './image'

const app = http.createServer((req, res) => {
  if (req.url === undefined) return res.end()
  const requestURL = new URL(req.url, `http://${req.headers.host}`)
  const params = requestURL.searchParams
  const reqQueryCorsPreflight = params.get('corsPreflight')
  if (
    reqQueryCorsPreflight !== null &&
    req.method === 'OPTIONS' &&
    'access-control-request-method' in req.headers &&
    'origin' in req.headers
  ) {
    const reqParsedCorsPreflight: ParsedCORSPreflight = JSON.parse(
      reqQueryCorsPreflight
    )
    const statusCode = reqParsedCorsPreflight.status || 200
    res.writeHead(statusCode, reqParsedCorsPreflight.headers)
    return res.end()
  }
  const reqQueryHeaders = params.get('headers')
  if (reqQueryHeaders !== null) {
    const reqParsedHeaders: OutgoingHttpHeaders = JSON.parse(reqQueryHeaders)
    res.writeHead(200, reqParsedHeaders)
  }
  const reqQueryBody = params.get('body')
  if (reqQueryBody === null) return res.end()
  const reqParsedBody: ParsedBody = JSON.parse(reqQueryBody)
  if (reqParsedBody.type === 'image') {
    res.write(createRectangle(reqParsedBody.size))
  } else {
    let resBody = ''
    if (typeof reqParsedBody.data === 'object') {
      resBody = JSON.stringify(reqParsedBody.data)
    } else {
      resBody = reqParsedBody.data
    }
    res.write(resBody)
  }
  res.end()
})

export default app
