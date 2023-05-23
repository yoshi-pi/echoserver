import http from 'http';

interface RequestConfig {
  method: string;
  path: string;
  headers?: http.OutgoingHttpHeaders;
}
interface Response {
  res: http.IncomingMessage;
  body: Buffer;
}
export const request = async ({
  method,
  path,
  headers,
}: RequestConfig): Promise<Response> =>
  await new Promise<Response>((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5678,
      path: encodeURI(path),
      method,
      headers,
    };
    const req = http.request(options, (res) => {
      const chunks: Uint8Array[] = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        resolve({ res, body: Buffer.concat(chunks) });
      });
    });
    req.end();
  });
