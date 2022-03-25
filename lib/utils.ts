import header from '../components/header.ts';
import footer from '../components/footer.ts';
import loading from '../components/loading.ts';

// This allows us to have nice html syntax highlighting in template literals
export const html = String.raw;

export interface PageContentResult {
  htmlContent: string;
  titlePrefix?: string;
}

interface BasicLayoutOptions {
  currentPath: string;
  titlePrefix?: string;
}

function basicLayout(htmlContent: string, { currentPath, titlePrefix }: BasicLayoutOptions) {
  return html`
    <!doctype html>

    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <title>${titlePrefix ? `${titlePrefix} - ` : ''}Simple Deno Website Boilerplate</title>
      <meta name="description" content="${titlePrefix ? `${titlePrefix} - ` : ''}Simple Deno Website Boilerplate">
      <meta name="author" content="Bruno Bernardino">

      <link rel="icon" href="/public/images/favicon.ico">
      <link rel="icon" href="/public/images/favicon.png" type="image/png">
      <link rel="apple-touch-icon" href="/public/images/favicon.png">

      <link rel="stylesheet" href="/public/css/style.css">
    </head>

    <body>
      ${loading()}
      <section class="wrapper">
        ${header(currentPath)}
        ${htmlContent}
        ${footer()}
      </section>
      <script src="/public/js/script.js" defer></script>
      <script
        src="https://cdn.usefathom.com/script.js"
        site="KUHVJOKD"
        defer
      ></script>
    </body>
    </html>
    `;
}

export function basicLayoutResponse(htmlContent: string, options: BasicLayoutOptions) {
  return new Response(basicLayout(htmlContent, options), {
    headers: {
      'content-type': 'text/html',
    },
  });
}

export function isRunningLocally(urlPatternResult: URLPatternResult) {
  return urlPatternResult.hostname.input === 'localhost';
}

export function generateRandomPositiveInt(max = 10000) {
  return Math.floor(Math.random() * max);
}
