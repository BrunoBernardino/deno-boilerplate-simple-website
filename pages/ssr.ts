import { generateRandomPositiveInt, html, PageContentResult } from '../lib/utils.ts';

export function pageAction() {
  return new Response('Not Implemented', { status: 501 });
}

export function pageContent() {
  const initialCounterValue = generateRandomPositiveInt(10);

  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        This page was server-side rendered (SSR)!
      </h1>
      <p>
        This is always built when requested, like all other pages, because Deno is generating/returning them!
      </p>
      <p>The button starts as if having been clicked ${initialCounterValue} time${
    initialCounterValue === 1 ? '' : 's'
  }.</p>
      <button id="counter-button">
        This button has been clicked ${initialCounterValue} time${initialCounterValue === 1 ? '' : 's'}!
      </button>
    </section>
    <script type="text/javascript">
      (() => {
        document.addEventListener('app-loaded', () => {
          window.app.setCounterButtonCounter(${initialCounterValue});
        });
      })();
    </script>
  `;

  return {
    htmlContent,
    titlePrefix: 'SSR',
  } as PageContentResult;
}
