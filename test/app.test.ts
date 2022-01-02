import { request } from './request'
import { imageSize } from 'image-size'

describe('Test the root path', () => {
  test('It should respond with the specified headers', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "headers": {"content-type": "application/json", "a": "a"}}'
    })
    expect(res.headers['content-type']).toBe('application/json')
    expect(res.headers.a).toBe('a')
    expect(body.length).toBe(0)
  })
  test('It should respond with the a body that contains the specified text data', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "text", "data": "hello"}}'
    })
    expect(body.toString()).toBe('hello')
  })
  test('It should respond with the specified headers and body at the same time', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "headers": {"Content-Type": "application/json"}, "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    })
    expect(res.headers['content-type']).toBe('application/json')
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}')
  })
  test('It should respond with the a body that contains the trimmed JSON data', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    })
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}')
  })
  test('It should respond with a body that contains an image with the specified height and width', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "image", "size": {"width": 400, "height": 200}}}'
    })
    const dimensions = imageSize(body)
    expect(dimensions.height).toBe(200)
    expect(dimensions.width).toBe(400)
  })

  test('It should respond with a body that contains a default image of 200 in height and width', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "image"}}'
    })
    const dimensions = imageSize(body)
    expect(dimensions.height).toBe(200)
    expect(dimensions.width).toBe(200)
  })
  test('It should respond with the specified status code', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "status": 404, "headers": {"Content-Type": "application/json"}, "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    })
    expect(res.statusCode).toBe(404)
    expect(res.headers['content-type']).toBe('application/json')
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}')
  })
  test('It should respond with a status code of 200 by default', async () => {
    const { res } = await request({
      method: 'get',
      path: '/?query={}'
    })
    expect(res.statusCode).toBe(200)
  })
  test('It should respond with the specified CORS preflight headers if the request method is OPTIONS and the request headers has the Access-Control-Request-Method and Origin headers', async () => {
    const path = `/?query={
      "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
      "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}},
      "corsPreflight": {
        "headers": {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, PUT, PATCH, POST, DELETE"
        },
        "status": 204
      }
    }`
    const { res: preflightRes } = await request({
      method: 'options',
      path,
      headers: {
        'Access-Control-Request-Method': 'GET',
        Origin: 'http://test.test'
      }
    })
    expect(preflightRes.statusCode).toBe(204)
    expect(preflightRes.headers['access-control-allow-origin']).toBe('*')
    expect(preflightRes.headers['access-control-allow-methods']).toBe(
      'GET, HEAD, PUT, PATCH, POST, DELETE'
    )
    const { res } = await request({
      method: 'GET',
      path
    })
    expect(res.statusCode).toBe(200)
  })
  test('It should respond with the specified CORS preflight headers and a status code of 200 by default if the request method is OPTIONS and the request headers has the Access-Control-Request-Method and Origin headers', async () => {
    const path = `/?query={
      "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
      "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}},
      "corsPreflight": {
        "headers": {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, PUT, PATCH, POST, DELETE"
        }
      }
    }`
    const { res: preflightRes } = await request({
      method: 'options',
      path,
      headers: {
        'Access-Control-Request-Method': 'GET',
        Origin: 'http://test.test'
      }
    })
    expect(preflightRes.statusCode).toBe(200)
    expect(preflightRes.headers['access-control-allow-origin']).toBe('*')
    expect(preflightRes.headers['access-control-allow-methods']).toBe(
      'GET, HEAD, PUT, PATCH, POST, DELETE'
    )
    const { res } = await request({
      method: 'GET',
      path
    })
    expect(res.statusCode).toBe(200)
  })
})
