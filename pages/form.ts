import { basicLayoutResponse, escapeHtml, html, PageContentResult } from '../lib/utils.ts';

const titlePrefix = 'Form';

export async function pageAction(request: Request, match: URLPatternResult) {
  if (request.method !== 'POST') {
    return new Response('Not Implemented', { status: 501 });
  }

  let errorMessage = '';
  let submittedRandomValue = '';

  try {
    const formData = await request.formData();
    submittedRandomValue = (formData.get('random-value') as string).toLocaleLowerCase().trim();

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
    titlePrefix,
  });
}

export function pageContent() {
  const htmlContent = generateHtmlContent();

  return {
    htmlContent,
    titlePrefix,
  } as PageContentResult;
}

function generateHtmlContent(notificationHtml = '', randomValue = '') {
  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        This page has an old-school form (whoa)!
      </h1>
      ${notificationHtml}
      <p>
        Just fill out the form below and submit it.
      </p>
      <p>
        No client-side JS required.
      </p>
      <form action="/form" method="POST">
        <fieldset>
          <label for="random-value">Random Value</label>
          <input id="random-value" name="random-value" type="text" placeholder="something" value="${
    escapeHtml(randomValue)
  }" />
        </fieldset>
        <button type="submit">Submit it!</button>
      </form>
    </section>
  `;

  return htmlContent;
}
