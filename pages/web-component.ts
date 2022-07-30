import { html, PageContentResult } from '../lib/utils.ts';

export function pageAction() {
  return new Response('Not Implemented', { status: 501 });
}

export function pageContent() {
  const htmlContent = generateHtmlContent();

  return {
    htmlContent,
    titlePrefix: 'Web Component',
  } as PageContentResult;
}

function generateHtmlContent() {
  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        This page uses Web Components and TypeScript (fancy)!
      </h1>
      <p>
        That means you can press the button to set its value to a random positive integer (up to 10000), fetched via an API route.
      </p>
      <p>
        It uses Just-In-Time (JIT) transpiled TypeScript inspired by <a href="https://github.com/ayame113/ts-serve">ts-serve</a>, and <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">Web Components</a>.
      </p>
      <p>Enjoy it!</p>
      <button is="app-button">
        Click me to get a random value!
      </button>
    </section>
    
    <script src="/public/ts/web-component.ts" type="module" defer></script>
  `;

  return htmlContent;
}
