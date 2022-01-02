import { request } from './request'
import { imageSize } from 'image-size'

describe('Test the root path', () => {
  test('It should respond with only headers', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "headers": {"content-type": "application/json", "a": "a"}}'
    })
    expect(res.headers['content-type']).toBe('application/json')
    expect(res.headers.a).toBe('a')
    expect(body.length).toBe(0)
  })
  test('It should respond with text body', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "text", "data": "hello"}}'
    })
    expect(body.toString()).toBe('hello')
  })
  test('It should respond with the trimmed JSON body', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    })
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}')
  })
  test('It should respond with headers and body', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "headers": {"Content-Type": "application/json"}, "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    })
    expect(res.headers['content-type']).toBe('application/json')
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}')
  })
  test('It should respond with image body', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "image", "size": {"width": 400, "height": 200}}}'
    })
    const dimensions = imageSize(body)
    expect(dimensions.height).toBe(200)
    expect(dimensions.width).toBe(400)
  })
  test('It should respond with default image body', async () => {
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
  test('It should respond with the 200 status code by defualt', async () => {
    const { res } = await request({
      method: 'get',
      path: '/?query={}'
    })
    expect(res.statusCode).toBe(200)
  })
  test('It works with CORS preflight', async () => {
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
  test('It works with CORS preflight without status', async () => {
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
