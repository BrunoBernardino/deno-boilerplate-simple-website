import { basicLayoutResponse, escapeHtml, escapeInput, html, PageContentResult } from '../lib/utils.ts';

export async function pageAction(request: Request, match: URLPatternResult) {
  if (request.method !== 'POST') {
    return new Response('Not Implemented', { status: 501 });
  }

  let errorMessage = '';
  let submittedRandomValue = '';

  try {
    const formData = await request.formData();
    submittedRandomValue = (formData.get('randomValue') as string).toLocaleLowerCase().trim();

    if (!submittedRandomValue) {
      throw new Error('A random value is required');
    }

    if (!submittedRandomValue.includes('something')) {
      throw new Error('The random value needs to have "something" in it');
    }
  } catch (error) {
    errorMessage = error.toString();
  }

  const errorHtml = errorMessage
    ? html`
    <section class="error">
      <h3>Error!</h3>
      <p>${errorMessage}</p>
    </section>
  `
    : '';
  const successHtml = !errorMessage
    ? html`
    <section class="success">
      <h3>Success!</h3>
      <p>You submitted "${escapeHtml(submittedRandomValue)}" successfully.</p>
    </section>
  `
    : '';

  const htmlContent = generateHtmlContent(errorHtml || successHtml, errorMessage ? submittedRandomValue : '');

  return basicLayoutResponse(htmlContent, {
    currentPath: match.pathname.input,
    titlePrefix: 'Dynamic',
  });
}

export function pageContent() {
  const htmlContent = generateHtmlContent();

  return {
    htmlContent,
    titlePrefix: 'Dynamic',
  } as PageContentResult;
}

function generateHtmlContent(notificationHtml = '', randomValue = '') {
  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        This page is dynamic (wooooo)!
      </h1>
      ${notificationHtml}
      <p>
        That means you can press the button to set its value to a random positive integer (up to 10000), fetched via an API route.
      </p>
      <p>Enjoy it!</p>
      <button id="random-button">
        Click me to get a random value!
      </button>
      <p>
        If you want to test a form submission instead, fill out the form below and its button.
      </p>
      <form action="/dynamic" method="POST">
        <fieldset>
          <label for="randomValue">Random Value</label>
          <input id="randomValue" name="randomValue" type="text" placeholder="something" value="${
    escapeInput(randomValue)
  }" />
        </fieldset>
        <button type="submit">Submit this!</button>
      </form>
    </section>
    
    <script type="text/javascript">
      (() => {
        document.addEventListener('app-loaded', () => {
          const randomButton = document.getElementById('random-button');

          const setRandomValue = async () => {
            window.app.showLoading();
            const response = await fetch('/api/v0/random-positive-int');
            const { number } = await response.json();
            // Using template literals here is tricky because the syntax highlight goes a-wire
            randomButton.innerText = ['Got ', number, '! Click me again!'].join('');
            window.app.hideLoading();
          };

          randomButton.addEventListener('click', setRandomValue);
        });
      })();
    </script>
  `;

  return htmlContent;
}
