import http from 'http'
import { Rect } from './image'

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
export const getHeaders = (obj: { [key: string]: unknown }, isCorsPreflight: boolean = false) => {
  if (obj.headers !== undefined) {
    if (!Array.isArray(obj.headers)) {
      throw new Error(`the value of headers${isCorsPreflight ? ' of corsPreflight ' : ' '}must be an array`)
    }
    obj.headers.forEach(header => {
      if (!Array.isArray(header)) {
        throw new Error(`the format of each header${isCorsPreflight ? ' of corsPreflight ' : ' '}must be an array`)
      }
      if (header.length < 2) {
        throw new Error(`each header array length${isCorsPreflight ? ' of corsPreflight ' : ' '}must be at least 2`)
      }
      header.forEach(item => {
        if (typeof item !== 'string') {
          throw new Error(`elements of header array${isCorsPreflight ? ' of corsPreflight ' : ' '}must be string`)
        }
      })
    })
  }
  return obj.headers as string[][] | undefined
}
