import routes, { Route } from './routes.ts';
import * as notFoundPage from './pages/404.ts';
import { basicLayoutResponse } from './lib/utils.ts';

function handler(request: Request) {
  const routeKeys = Object.keys(routes);

  for (const routeKey of routeKeys) {
    const route: Route = routes[routeKey];
    const match = route.pattern.exec(request.url);

    if (match) {
      return route.handler(request, match);
    }
  }

  const { htmlContent, titlePrefix } = notFoundPage.pageContent();

  return basicLayoutResponse(htmlContent, { titlePrefix, currentPath: '/' }, 404);
}

export const abortController = new AbortController();

const PORT = Deno.env.get('PORT') || 8000;

Deno.serve({ port: PORT as number, signal: abortController.signal }, handler);
