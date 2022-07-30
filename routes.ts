import { readableStreamFromReader } from 'https://deno.land/std@0.149.0/streams/mod.ts';
import { serveFileWithTs } from 'https://deno.land/x/ts_serve@v1.1.0/mod.ts';
import {
  basicLayoutResponse,
  generateRandomPositiveInt,
  isRunningLocally,
  PageContentResult,
  recordPageView,
} from './lib/utils.ts';

// NOTE: This won't be necessary once https://github.com/denoland/deploy_feedback/issues/1 is closed
import * as indexPage from './pages/index.ts';
import * as ssrPage from './pages/ssr.ts';
import * as dynamicPage from './pages/dynamic.ts';
import * as formPage from './pages/form.ts';
import * as webComponentPage from './pages/web-component.ts';
const pages = {
  index: indexPage,
  ssr: ssrPage,
  dynamic: dynamicPage,
  form: formPage,
  webComponent: webComponentPage,
};

export interface Route {
  pattern: URLPattern;
  handler: (
    request: Request,
    match: URLPatternResult,
  ) => Response | Promise<Response>;
}

interface Routes {
  [routeKey: string]: Route;
}

function createBasicRouteHandler(id: string, pathname: string) {
  return {
    pattern: new URLPattern({ pathname }),
    handler: async (request: Request, match: URLPatternResult) => {
      try {
        // NOTE: Use this instead once https://github.com/denoland/deploy_feedback/issues/1 is closed
        // const { pageContent } = await import(`./pages/${id}.ts`);

        // @ts-ignore necessary because of the comment above
        const { pageContent, pageAction } = pages[id];

        if (!request.url.startsWith('http://localhost')) {
          recordPageView(match.pathname.input);
        }

        if (request.method !== 'GET') {
          return pageAction(request, match) as Response;
        }

        const pageContentResult = await pageContent(request, match);

        if (pageContentResult instanceof Response) {
          return pageContentResult;
        }

        const { htmlContent: htmlContent, titlePrefix } = (pageContentResult as PageContentResult);

        return basicLayoutResponse(htmlContent, { currentPath: match.pathname.input, titlePrefix });
      } catch (error) {
        if (error.toString().includes('NotFound')) {
          return new Response('Not Found', { status: 404 });
        }

        console.error(error);

        return new Response('Internal Server Error', { status: 500 });
      }
    },
  };
}

const routes: Routes = {
  sitemap: {
    pattern: new URLPattern({ pathname: '/sitemap.xml' }),
    handler: async (_request) => {
      const file = await Deno.open(`public/sitemap.xml`, { read: true });
      const readableStream = readableStreamFromReader(file);

      const oneDayInSeconds = 24 * 60 * 60;

      return new Response(readableStream, {
        headers: {
          'content-type': 'application/xml',
          'cache-control': `max-age=${oneDayInSeconds}, public`,
        },
      });
    },
  },
  robots: {
    pattern: new URLPattern({ pathname: '/robots.txt' }),
    handler: async (_request) => {
      const file = await Deno.open(`public/robots.txt`, { read: true });
      const readableStream = readableStreamFromReader(file);

      const oneDayInSeconds = 24 * 60 * 60;

      return new Response(readableStream, {
        headers: {
          'content-type': 'text/plain',
          'cache-control': `max-age=${oneDayInSeconds}, public`,
        },
      });
    },
  },
  public: {
    pattern: new URLPattern({ pathname: '/public/:filePath*' }),
    handler: async (request, match) => {
      const { filePath } = match.pathname.groups;

      try {
        const fullFilePath = `public/${filePath}`;
        const file = await Deno.open(fullFilePath, { read: true });
        const readableStream = readableStreamFromReader(file);

        const oneDayInSeconds = isRunningLocally(match) ? 0 : 24 * 60 * 60;

        const headers: ResponseInit['headers'] = {
          'cache-control': `max-age=${oneDayInSeconds}, public`,
        };

        // NOTE: It would be nice to figure out a better way to deduce content-type without dependencies
        const fileExtension = filePath.split('.').pop()?.toLowerCase();

        if (fileExtension === 'js') {
          headers['content-type'] = 'text/javascript';
        } else if (fileExtension === 'css') {
          headers['content-type'] = 'text/css';
        } else if (fileExtension === 'jpg') {
          headers['content-type'] = 'image/jpeg';
        } else if (fileExtension === 'png') {
          headers['content-type'] = 'image/png';
        } else if (fileExtension === 'svg') {
          headers['content-type'] = 'image/svg+xml';
        } else if (fileExtension === 'ts') {
          return serveFileWithTs(request, fullFilePath);
        }

        return new Response(readableStream, {
          headers,
        });
      } catch (error) {
        if (error.toString().includes('NotFound')) {
          return new Response('Not Found', { status: 404 });
        }

        console.error(error);

        return new Response('Internal Server Error', { status: 500 });
      }
    },
  },
  index: createBasicRouteHandler('index', '/'),
  ssr: createBasicRouteHandler('ssr', '/ssr'),
  dynamic: createBasicRouteHandler('dynamic', '/dynamic'),
  form: createBasicRouteHandler('form', '/form'),
  webComponent: createBasicRouteHandler('webComponent', '/web-component'),
  api_v0_random_positive_int: {
    pattern: new URLPattern({ pathname: '/api/v0/random-positive-int' }),
    handler: (_request) => {
      const number = generateRandomPositiveInt();

      return new Response(JSON.stringify({ number }), {
        headers: {
          'content-type': 'application/json',
        },
      });
    },
  },
};

export default routes;
