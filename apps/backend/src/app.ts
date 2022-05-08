import http from 'http'
import { handleBadRequest, isObject, hasOptionalSize, getStatusCode, getHeaders } from './utils'
import { createRectangle } from './image'

const app = http.createServer((req, res) => {
  // Setup
  if (req.url === undefined) return res.end()
  const requestURL = new URL(req.url, `http://${req.headers.host}`)
  const query = requestURL.searchParams.get('query')
  if (query === null) return res.end()
  let queryObj: unknown
  try {
    queryObj = JSON.parse(query)
  } catch {
    return handleBadRequest(res, 'the query value must be a valid JSON string')
  }
  if (!isObject(queryObj)) {
    return handleBadRequest(res, 'the query value must be a JSON object')
  }

  // CORS Preflight
  if (
    queryObj.corsPreflight !== undefined &&
    req.method === 'OPTIONS' &&
    'access-control-request-method' in req.headers &&
    'origin' in req.headers
  ) {
    const corsPreflightObj = queryObj.corsPreflight
    if (!isObject(corsPreflightObj)) {
      return handleBadRequest(res, 'the value of corsPreflight must be an object')
    }
    const statusCode = getStatusCode(corsPreflightObj)
    try {
      const headers = getHeaders(corsPreflightObj, true)
      res.writeHead(statusCode, headers)
      return res.end()
    } catch (error) {
      if (error instanceof Error) return handleBadRequest(res, error.message)
    }
  }

  // Status Code and Headers
  const statusCode = getStatusCode(queryObj)
  let headers: string[][] | undefined
  try {
    headers = getHeaders(queryObj)
  } catch (error) {
    if (error instanceof Error) return handleBadRequest(res, error.message)
  }

  // Body
  if (queryObj.body === undefined) {
    res.writeHead(statusCode, headers)
    return res.end()
  }
  if (!isObject(queryObj.body)) {
    return handleBadRequest(res, 'the value of body must be an object')
  }
  // image body
  if (queryObj.body.type === 'image') {
    if (!hasOptionalSize(queryObj.body)) {
      return handleBadRequest(res, 'the value of size must be an object that holds width and height as number')
    }
    res.writeHead(statusCode, headers)
    return res.end(createRectangle(queryObj.body.size))
  }
  // text body
  if (queryObj.body.type === 'text') {
    let resBody: unknown
    if (typeof queryObj.body.data === 'object') {
      resBody = JSON.stringify(queryObj.body.data)
    } else {
      resBody = queryObj.body.data
    }
    res.writeHead(statusCode, headers)
    return res.end(resBody)
  }
  return handleBadRequest(res, 'the value of type must be either text or image')
})

export default app
