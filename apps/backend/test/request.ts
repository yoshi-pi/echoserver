import http from 'http';
import { compressToEncodedURIComponent } from 'lz-string';

interface RequestConfig {
  method: string;
  query: string;
  headers?: http.OutgoingHttpHeaders;
}
interface Response {
  res: http.IncomingMessage;
  body: Buffer;
}
export const request = async ({
  method,
  query,
  headers,
}: RequestConfig): Promise<Response> =>
  await new Promise<Response>((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5678,
      path: `/server?response=${compressToEncodedURIComponent(query)}`,
      method,
      headers,
    };
    const req = http.request(options, (res) => {
      const chunks: Uint8Array[] = [];
      res.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        resolve({ res, body: Buffer.concat(chunks) });
      });
    });
    req.end();
  });
