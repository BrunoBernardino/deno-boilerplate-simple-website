import * as React from 'react';
import { renderToString } from 'react-dom/server';

import { html, PageContentResult } from '/lib/utils.ts';
import Counter from '/components/Counter.tsx';

export function pageAction() {
  return new Response('Not Implemented', { status: 501 });
}

export const counterId = 'counter-container';

export function pageContent(_request: Request, match: URLPatternResult) {
  const initialCounterValue = Number(match.pathname.groups.count || '0');

  const counterReactNode = <Counter initialValue={initialCounterValue} />;

  const counterHtml = renderToString(counterReactNode);

  const htmlContent = html`
    <section class="main-section">
      <h1 class="main-title">
        This page was server-side rendered (SSR) and uses React!
      </h1>
      <p>
        This is always built when requested, like all other pages, because Deno is generating/returning them!
      </p>
      <p>The button starts as if having been clicked ${initialCounterValue} time${initialCounterValue === 1
      ? ''
      : 's'}.</p>
      <section id="${counterId}">${counterHtml}</section>
    </section>

    <script type="module">
    import React from 'https://esm.sh/react@19.1.0';
    import ReactDOM from 'https://esm.sh/react-dom@19.1.0/client';

    const { useState, useEffect } = React; // These are imported in the Counter component directly, so they're needed here, too, as we only hydrate the function, not the file (this wouldn't be needed if we were importing a root "App" component, for example).

    const Counter = ${Counter.toString()}

    ReactDOM.hydrateRoot(document.getElementById('${counterId}'), React.createElement(Counter, { initialValue: ${initialCounterValue} }));
    </script>
  `;

  return {
    htmlContent,
    titlePrefix: 'React',
  } as PageContentResult;
}
