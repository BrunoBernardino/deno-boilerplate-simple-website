import header from '../components/header.ts';
import footer from '../components/footer.ts';
import loading from '../components/loading.ts';

// This allows us to have nice html syntax highlighting in template literals
export const html = String.raw;

export interface PageContentResult {
  htmlContent: string;
  titlePrefix?: string;
}

export const baseUrl = 'https://simple-deno-website-boilerplate.onbrn.com';
export const defaultTitle = 'Simple Deno Website Boilerplate';
export const defaultDescription = 'Welcome to a Simple Deno Website Boilerplate!';

interface BasicLayoutOptions {
  currentPath: string;
  titlePrefix?: string;
  description?: string;
}

function basicLayout(htmlContent: string, { currentPath, titlePrefix, description }: BasicLayoutOptions) {
  let title = defaultTitle;

  if (titlePrefix) {
    title = `${titlePrefix} - Bruno Bernardino`;
  }

  return html`
    <!doctype html>

    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <title>${title}</title>
      <meta name="description" content="${description || defaultDescription}">
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
    </body>
    </html>
    `;
}

export function basicLayoutResponse(htmlContent: string, options: BasicLayoutOptions) {
  return new Response(basicLayout(htmlContent, options), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'content-security-policy':
        'default-src \'self\'; child-src \'none\'; img-src \'self\'; style-src \'self\' \'unsafe-inline\'; script-src \'self\' \'unsafe-inline\';',
      'x-frame-options': 'DENY',
    },
  });
}

export function isRunningLocally(urlPatternResult: URLPatternResult) {
  return urlPatternResult.hostname.input === 'localhost';
}

export function escapeHtml(unsafe: string) {
  return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
    .replaceAll('\'', '&#039;');
}

export function generateRandomPositiveInt(max = 10000) {
  return Math.floor(Math.random() * max);
}

export async function recordPageView(pathname: string) {
  try {
    await fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        domain: baseUrl.replace('https://', ''),
        name: 'pageview',
        url: `${baseUrl}${pathname}`,
      }),
    });
  } catch (error) {
    console.log('Failed to log pageview');
    console.error(error);
  }
}
