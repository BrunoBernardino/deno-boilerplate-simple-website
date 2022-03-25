import { html, PageContentResult } from '../lib/utils.ts';

export function pageContent() {
  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        This page is dynamic (wooooo)!
      </h1>
      <p>
        That means you can press the button to set its value to a random positive integer (up to 10000), fetched via an API route.
      </p>
      <p>Enjoy it!</p>
      <button id="random-button">
        Click me to get a random value!
      </button>
    </section>
    
    <script type="text/javascript">
      (() => {
        document.addEventListener('app-loaded', () => {
          const randomButton = document.getElementById('random-button');

          const setRandomValue = async () => {
            const response = await fetch('/api/v0/random-positive-int');
            const { number } = await response.json();
            // Using template literals here is tricky because the syntax highlight goes a-wire
            randomButton.innerText = ['Got ', number, '! Click me again!'].join('');
          };

          randomButton.addEventListener('click', setRandomValue);
        });
      })();
    </script>
  `;

  return {
    htmlContent,
    titlePrefix: 'Dynamic',
  } as PageContentResult;
}
