import { html, PageContentResult } from '/lib/utils.ts';

export function pageAction() {
  return new Response('Not Implemented', { status: 501 });
}

export function pageContent() {
  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        404 - Not Found
      </h1>
      <p style="text-align: center; margin-top: 3rem;">The page you are looking for does not exist. <a href="/">Go home</a>.</p>
    </section>
  `;

  return {
    htmlContent,
    titlePrefix: 'Not Found',
  } as PageContentResult;
}
