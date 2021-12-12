import { request } from './request';
import { imageSize } from 'image-size';

describe('Test the root path', () => {
  test('It should respond with only headers', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?headers={"content-type": "application/json", "a": "a"}',
    });
    expect(res.headers['content-type']).toBe('application/json');
    expect(res.headers['a']).toBe('a');
    expect(body.length).toBe(0);
  });
  test('It should respond with text body', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?body={"type": "text", "data": "hello"}',
    });
    expect(body.toString()).toBe('hello');
  });
  test('It should respond with the trimmed JSON body', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?body={"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}',
    });
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}');
  });
  test('It should respond with headers and body', async () => {
    const { res, body } = await request({
      method: 'get',
      path: '/?headers={"Content-Type": "application/json"}&body={"type": "text", "data": {"name": "echo-server", "author": "yoshipi"}}',
    });
    expect(res.headers['content-type']).toBe('application/json');
    expect(body.toString()).toBe('{"name":"echo-server","author":"yoshipi"}');
  });
  test('It should respond with image body', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?body={"type": "image", "size": {"width": 400, "height": 200}}',
    });
    const dimensions = imageSize(body);
    expect(dimensions.height).toBe(200);
    expect(dimensions.width).toBe(400);
  });
  test('It should respond with default image body', async () => {
    const { body } = await request({
      method: 'get',
      path: '/?body={"type": "image"}',
    });
    const dimensions = imageSize(body);
    expect(dimensions.height).toBe(200);
    expect(dimensions.width).toBe(200);
  });
});
