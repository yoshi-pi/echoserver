import { request } from './request'
import { imageSize } from 'image-size'

describe('Test the root path', () => {
  test('It should respond with the specified headers', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "headers": [["content-type", "application/json"], ["a", "a"]]}'
    })
    expect(res.headers['content-type']).toBe('application/json')
    expect(res.headers.a).toBe('a')
    expect(body.length).toBe(0)
  })
  test('It should respond with a body that contains the specified text data', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "text", "data": "hello"}}'
    })
    expect(body.toString()).toBe('hello')
  })
  test('It should respond with the specified headers and body at the same time', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "headers": [["content-type", "application/json"]], "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    })
    expect(res.headers['content-type']).toBe('application/json')
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}')
  })
  test('It should respond with a body that contains the trimmed JSON data', async () => {
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
      path: '/?query={ "status": 404, "headers": [["content-type", "application/json"]], "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
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
  test('It should respond in the same way to any request methods', async () => {
    let { res, body } = await request({
      method: 'post',
      path: '/?query={ "headers": [["content-type", "application/json"]], "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    })
    expect(res.headers['content-type']).toBe('application/json')
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}');
    ({ res, body } = await request({
      method: 'put',
      path: '/?query={ "headers": [["Content-Type", "application/json"]], "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    }))
    expect(res.headers['content-type']).toBe('application/json')
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}');
    ({ res, body } = await request({
      method: 'delete',
      path: '/?query={ "headers": [["Content-Type", "application/json"]], "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}}'
    }))
    expect(res.headers['content-type']).toBe('application/json')
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}')
  })
  test('It should respond with the specified CORS preflight headers if the request method is OPTIONS and the request headers have the Access-Control-Request-Method and Origin headers', async () => {
    const path = `/?query={
      "headers": [["Access-Control-Allow-Origin", "*"], ["Content-Type", "application/json"]], "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}},
      "corsPreflight": {
        "headers": [["Access-Control-Allow-Origin", "*"], ["Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE"]], "status": 204
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
  test('It should respond with the specified CORS preflight headers and a status code of 200 by default if the request method is OPTIONS and the request headers have the Access-Control-Request-Method and Origin headers', async () => {
    const path = `/?query={
      "headers": [["Access-Control-Allow-Origin", "*"], ["Content-Type", "application/json"]],
      "body": {"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}},
      "corsPreflight": {
        "headers": [["Access-Control-Allow-Origin", "*"], ["Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE"]]
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
  test('It should respond with a status code of 400 when the query string is an invalid JSON string', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query=invalidJSON'
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the query value must be a valid JSON string')
  })
  test('It should respond with a status code of 400 when the query string is not a JSON object', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query="not object"'
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the query value must be a JSON object')
  })
  test('It should respond with a status code of 400 when the the value of corsPreflight is not an object, the request method is OPTIONS and the request headers have the Access-Control-Request-Method and Origin headers', async () => {
    const path = '/?query={"corsPreflight": "not object"}'
    const { res, body } = await request({
      method: 'options',
      path,
      headers: {
        'Access-Control-Request-Method': 'GET',
        Origin: 'http://test.test'
      }
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the value of corsPreflight must be an object')
  })
  test('It should respond with a status code of 400 when the value of headers of corsPreflight is not an array, the request method is OPTIONS and the request headers have the Access-Control-Request-Method and Origin headers', async () => {
    const path = `/?query={
      "corsPreflight": {
        "headers": "not array"
      }
    }`
    const { res, body } = await request({
      method: 'options',
      path,
      headers: {
        'Access-Control-Request-Method': 'GET',
        Origin: 'http://test.test'
      }
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the value of headers of corsPreflight must be an array')
  })
  test('It should respond with a status code of 400 when the format of each header of corsPreflight is not an array, the request method is OPTIONS and the request headers have the Access-Control-Request-Method and Origin headers', async () => {
    const path = `/?query={
      "corsPreflight": {
        "headers": ["not array"]
      }
    }`
    const { res, body } = await request({
      method: 'options',
      path,
      headers: {
        'Access-Control-Request-Method': 'GET',
        Origin: 'http://test.test'
      }
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the format of each header of corsPreflight must be an array')
  })
  test('It should respond with a status code of 400 when each header array length of corsPreflight is less than 2, the request method is OPTIONS and the request headers have the Access-Control-Request-Method and Origin headers', async () => {
    const path = `/?query={
      "corsPreflight": {
        "headers": [["one"]]
      }
    }`
    const { res, body } = await request({
      method: 'options',
      path,
      headers: {
        'Access-Control-Request-Method': 'GET',
        Origin: 'http://test.test'
      }
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('each header array length of corsPreflight must be at least 2')
  })
  test('It should respond with a status code of 400 when elements of header array of corsPreflight are not string, the request method is OPTIONS and the request headers have the Access-Control-Request-Method and Origin headers', async () => {
    const path = `/?query={
      "corsPreflight": {
        "headers": [["Access-Control-Allow-Origin", 123]]
      }
    }`
    const { res, body } = await request({
      method: 'options',
      path,
      headers: {
        'Access-Control-Request-Method': 'GET',
        Origin: 'http://test.test'
      }
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('elements of header array of corsPreflight must be string')
  })
  test('It should respond with a status code of 400 when the value of headers is not an array', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "headers": "not array"}'
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the value of headers must be an array')
  })
  test('It should respond with a status code of 400 when the format of each header is not an array', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={"headers": ["not array"]}'
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the format of each header must be an array')
  })
  test('It should respond with a status code of 400 when each header array length is less than 2', async () => {
    const { res, body } = await request({
      method: 'get',
      path: `/?query={
        "headers": [["one"]]
      }`
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('each header array length must be at least 2')
  })
  test('It should respond with a status code of 400 when elements of header array are not string', async () => {
    const { res, body } = await request({
      method: 'get',
      path: `/?query={
        "headers": [["content-type", 123]]
      }`
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('elements of header array must be string')
  })
  test('It should respond with a status code of 400 when the value of body is not an object', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "body": "not object"}'
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the value of body must be an object')
  })
  test('It should respond with a status code of 400 when the value of size is not an object that holds width and height as number', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "image", "size": "not an object that holds width and height as number"}}'
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the value of size must be an object that holds width and height as number')
  })
  test('It should respond with a status code of 400 when the value of type is neither text nor image', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?query={ "body": {"type": "neither text nor image", "data": "hello"}}'
    })
    expect(res.statusCode).toBe(400)
    expect(body.toString()).toBe('the value of type must be either text or image')
  })
})
