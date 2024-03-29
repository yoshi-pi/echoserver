import http from 'http';
import path from 'path';
import fs from 'fs';
import {
  handleBadRequest,
  isObject,
  hasOptionalSize,
  getStatusCode,
  getHeaders,
} from './utils';
import { createRectangle } from './image';
import { decompressFromEncodedURIComponent } from 'lz-string';

const STATIC_PATH = path.join(process.cwd(), './apps/frontend/public');
const prepareFile = async (
  url: string
): Promise<{
  found: boolean;
  ext: string;
  stream: fs.ReadStream;
}> => {
  const paths = [STATIC_PATH, url];
  if (url.endsWith('/')) paths.push('index.html');
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(
    () => true,
    () => false
  );
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : `${STATIC_PATH}/404.html`;
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { found, ext, stream };
};
const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const app = http.createServer((req, res) => {
  // Setup
  if (req.url === undefined) {
    handleBadRequest(res, 'url is undefined');
    return;
  }
  const requestURL = new URL(req.url, `http://${req.headers.host ?? ''}`);
  if (requestURL.pathname === '/server') {
    let queryObj: unknown;
    const query = requestURL.searchParams.get('query');
    const response = requestURL.searchParams.get('response');
    // for old version
    if (query !== null) {
      try {
        queryObj = JSON.parse(query);
      } catch {
        handleBadRequest(res, 'the query value must be a valid JSON string');
        return;
      }
      if (!isObject(queryObj)) {
        handleBadRequest(res, 'the query value must be a JSON object');
        return;
      }
    } else {
      // for new version
      if (response === null) {
        handleBadRequest(res, 'There is no query');
        return;
      }
      try {
        queryObj = JSON.parse(decompressFromEncodedURIComponent(response));
      } catch {
        handleBadRequest(res, 'the query value must be a valid JSON string');
        return;
      }
      if (!isObject(queryObj)) {
        handleBadRequest(res, 'the query value must be a JSON object');
        return;
      }
    }

    // CORS Preflight
    if (
      queryObj.corsPreflight !== undefined &&
      req.method === 'OPTIONS' &&
      'access-control-request-method' in req.headers &&
      'origin' in req.headers
    ) {
      const corsPreflightObj = queryObj.corsPreflight;
      if (!isObject(corsPreflightObj)) {
        handleBadRequest(res, 'the value of corsPreflight must be an object');
        return;
      }
      const statusCode = getStatusCode(corsPreflightObj);
      try {
        const headers = getHeaders(corsPreflightObj, true);
        res.writeHead(statusCode, headers);
        return res.end();
      } catch (error) {
        if (error instanceof Error) {
          handleBadRequest(res, error.message);
          return;
        }
      }
    }

    // Status Code and Headers
    const statusCode = getStatusCode(queryObj);
    let headers: string[][] | undefined;
    try {
      headers = getHeaders(queryObj);
    } catch (error) {
      if (error instanceof Error) {
        handleBadRequest(res, error.message);
        return;
      }
    }

    // Body
    if (queryObj.body === undefined) {
      try {
        res.writeHead(statusCode, headers);
        return res.end();
      } catch (error) {
        if (error instanceof Error) {
          handleBadRequest(res, error.message);
          return;
        }
      }
    }
    if (!isObject(queryObj.body)) {
      handleBadRequest(res, 'the value of body must be an object');
      return;
    }
    // image body
    if (queryObj.body.type === 'image') {
      if (!hasOptionalSize(queryObj.body)) {
        handleBadRequest(
          res,
          'the value of size must be an object that holds width and height as number'
        );
        return;
      }
      try {
        res.writeHead(statusCode, headers);
      } catch (error) {
        if (error instanceof Error) {
          handleBadRequest(res, error.message);
          return;
        }
      }
      let mimeType: string | undefined;
      headers?.forEach((header) => {
        if (header[0].toLowerCase() === 'content-type') {
          mimeType = header[1];
        }
      });
      return res.end(createRectangle(queryObj.body.size, mimeType));
    }
    // text body
    if (queryObj.body.type === 'text') {
      let resBody: unknown;
      if (typeof queryObj.body.data === 'object') {
        resBody = JSON.stringify(queryObj.body.data);
      } else {
        resBody = queryObj.body.data;
      }
      try {
        res.writeHead(statusCode, headers);
        return res.end(resBody);
      } catch (error) {
        if (error instanceof Error) {
          handleBadRequest(res, error.message);
          return;
        }
      }
    }
    handleBadRequest(res, 'the value of type must be either text or image');
  } else {
    prepareFile(req.url)
      .then((file) => {
        const statusCode = file.found ? 200 : 404;
        const mimeType =
          MIME_TYPES[file.ext as keyof typeof MIME_TYPES] ?? MIME_TYPES.default;
        res.writeHead(statusCode, { 'Content-Type': mimeType });
        file.stream.pipe(res);
      })
      .catch(() => {
        throw new Error('somthing wrong');
      });
  }
});

export default app;
