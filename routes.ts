import { serveFile } from 'std/http/file_server.ts';
import {
  basicLayoutResponse,
  generateRandomPositiveInt,
  PageContentResult,
  serveFileWithSass,
  serveFileWithTs,
} from './lib/utils.ts';

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

type PageFunction = (
  request: Request,
  match: URLPatternResult,
) => Response | PageContentResult | Promise<Response | PageContentResult>;

interface Page {
  pageContent: PageFunction;
  pageAction: PageFunction;
}

function createBasicRouteHandler(id: string, pathname: string, isReact = false) {
  return {
    pattern: new URLPattern({ pathname }),
    handler: async (request: Request, match: URLPatternResult) => {
      try {
        const { pageContent, pageAction }: Page = await import(`./pages/${id}.ts${isReact ? 'x' : ''}`);

        if (request.method !== 'GET') {
          return pageAction(request, match) as Response;
        }

        const pageContentResult = await pageContent(request, match);

        if (pageContentResult instanceof Response) {
          return pageContentResult;
        }

        const { htmlContent: htmlContent, titlePrefix } = pageContentResult as PageContentResult;

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

const oneDayInSeconds = 24 * 60 * 60;

const routes: Routes = {
  sitemap: {
    pattern: new URLPattern({ pathname: '/sitemap.xml' }),
    handler: async () => {
      const fileContents = await Deno.readTextFile(`public/sitemap.xml`);

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
    handler: async (request) => {
      const response = await serveFile(request, `public/robots.txt`);
      response.headers.set('cache-control', `max-age=${oneDayInSeconds}, public`);
      return response;
    },
  },
  favicon: {
    pattern: new URLPattern({ pathname: '/favicon.ico' }),
    handler: async (request) => {
      const response = await serveFile(request, `public/images/favicon.ico`);
      response.headers.set('cache-control', `max-age=${oneDayInSeconds}, public`);
      return response;
    },
  },
  public: {
    pattern: new URLPattern({ pathname: '/public/:filePath*' }),
    handler: async (request, match) => {
      const { filePath } = match.pathname.groups;

      try {
        const fullFilePath = `public/${filePath}`;

        const fileExtension = filePath!.split('.').pop()?.toLowerCase();

        let response: Response;

        if (fileExtension === 'ts') {
          response = await serveFileWithTs(request, fullFilePath);
        } else if (fileExtension === 'scss') {
          response = await serveFileWithSass(request, fullFilePath);
        } else {
          response = await serveFile(request, `public/${filePath}`);
        }

        response.headers.set('cache-control', `max-age=${oneDayInSeconds}, public`);
        return response;
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
  webComponent: createBasicRouteHandler('web-component', '/web-component'),
  react: createBasicRouteHandler('react', '/react', true),
  reactWithInitialCount: createBasicRouteHandler('react', '/react/:count', true),
  api_v0_random_positive_int: {
    pattern: new URLPattern({ pathname: '/api/v0/random-positive-int' }),
    handler: () => {
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
