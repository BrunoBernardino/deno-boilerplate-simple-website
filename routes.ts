import { serveFile } from 'https://deno.land/std@0.161.0/http/file_server.ts';
import {
  basicLayoutResponse,
  generateRandomPositiveInt,
  PageContentResult,
  recordPageView,
  serveFileWithTs,
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
      const fileContents = await Deno.readTextFile(`public/sitemap.xml`);

      const oneDayInSeconds = 24 * 60 * 60;

      return new Response(fileContents, {
        headers: {
          'content-type': 'application/xml; charset=utf-8',
          'cache-control': `max-age=${oneDayInSeconds}, public`,
        },
      });
    },
  },
  robots: {
    pattern: new URLPattern({ pathname: '/robots.txt' }),
    handler: async (_request) => {
      const fileContents = await Deno.readTextFile(`public/robots.txt`);

      const oneDayInSeconds = 24 * 60 * 60;

      return new Response(fileContents, {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': `max-age=${oneDayInSeconds}, public`,
        },
      });
    },
  },
  public: {
    pattern: new URLPattern({ pathname: '/public/:filePath*' }),
    handler: (request, match) => {
      const { filePath } = match.pathname.groups;

      try {
        const fullFilePath = `public/${filePath}`;

        const fileExtension = filePath.split('.').pop()?.toLowerCase();

        if (fileExtension === 'ts') {
          return serveFileWithTs(request, fullFilePath);
        }

        return serveFile(request, fullFilePath);
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
          'content-type': 'application/json; charset=utf-8',
        },
      });
    },
  },
};

export default routes;
