import http from 'http'
import { Rect } from './image'
const hasOnlyStringOrNumberValue = (obj: { [key: string]: unknown }): obj is { [key: string]: string | number } => {
  return Object.keys(obj).every((value) => {
    if ((typeof obj[value] === 'number') || (typeof obj[value] === 'string')) return true
    return false
  })
}
export const isObject = (value: unknown): value is { [key: string]: unknown } => {
  return typeof value === 'object' && value !== null
}
export const handleBadRequest = (res: http.ServerResponse, message: string) => {
  res.writeHead(400)
  res.end(message)
  return undefined
}
export const hasOptionalSize = (value: { [key: string]: unknown }): value is { size?: Rect } => {
  if (value.size === undefined) return true
  if (isObject(value.size) &&
   typeof value.size.width === 'number' &&
   typeof value.size.height === 'number') return true
  return false
}
export const getStatusCode = (obj: { [key: string]: unknown }) => {
  let statusCode = 200
  if (typeof obj.status === 'number') {
    statusCode = obj.status
  }
  return statusCode
}
export const getHeaders = (res: http.ServerResponse, obj: { [key: string]: unknown }, isCorsPreflight: boolean = false) => {
  if (obj.headers !== undefined) {
    if (!isObject(obj.headers)) {
      return handleBadRequest(res, `the value of headers${isCorsPreflight ? ' of corsPreflight ' : ' '}must be an object`)
    }
    if (!hasOnlyStringOrNumberValue(obj.headers)) {
      return handleBadRequest(res, `each header value${isCorsPreflight ? ' of corsPreflight ' : ' '}must be string or number`)
    }
  }
  return obj.headers
}
