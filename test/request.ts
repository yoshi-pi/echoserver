import http from 'http';
interface RequestConfig {
  method: string;
  path: string;
}
interface Response {
  res: http.IncomingMessage;
  body: Buffer;
}
export const request = ({ method, path }: RequestConfig) => {
  return new Promise<Response>(async (resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5678,
      path: encodeURI(path),
      method,
    };
    let req = http.request(options, (res) => {
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
};
