import { html, PageContentResult } from '../lib/utils.ts';

export function pageAction() {
  return new Response('Not Implemented', { status: 501 });
}

export function pageContent() {
  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        Welcome to a Simple Deno Website Boilerplate!
      </h1>
      <p>
        This is a simple boilerplate for a Deno website, deployed
        with Deno Deploy.
      </p>
      <p>Click the button, have some fun.</p>
      <button id="counter-button">
        Loading...
      </button>
    </section>
  `;

  return {
    htmlContent,
    titlePrefix: '',
  } as PageContentResult;
}
