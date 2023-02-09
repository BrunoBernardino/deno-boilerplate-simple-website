import { html, PageContentResult } from '/lib/utils.ts';

export function pageAction() {
  return new Response('Not Implemented', { status: 501 });
}

export function pageContent() {
  const htmlContent = generateHtmlContent();

  return {
    htmlContent,
    titlePrefix: 'Dynamic',
  } as PageContentResult;
}

function generateHtmlContent() {
  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        This page is dynamic (wooooo)!
      </h1>
      <p>
        That means you can press the button to set its value to a random positive integer (up to 10000), fetched via an API route.
      </p>
      <p>
        It uses vanilla JavaScript.
      </p>
      <p>Enjoy it!</p>
      <button id="random-button">
        Click me to get a random value!
      </button>
    </section>
    
    <script src="/public/js/dynamic.js" defer></script>
  `;

  return htmlContent;
}
