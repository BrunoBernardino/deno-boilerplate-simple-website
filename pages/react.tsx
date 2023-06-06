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
      <p>The button starts as if having been clicked ${initialCounterValue} time${
    initialCounterValue === 1 ? '' : 's'
  }.</p>
      <section id="${counterId}">${counterHtml}</section>
    </section>
    
    <script src="https://unpkg.com/@babel/standalone@7.22.4/babel.min.js"></script>
    <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
    <script type="text/babel">
      const { useState, useEffect } = React;

      ${Counter.toString()}

      ReactDOM.hydrateRoot(document.getElementById('${counterId}'), <Counter initialValue={${initialCounterValue}} />);
    </script>
  `;

  return {
    htmlContent,
    titlePrefix: 'React',
  } as PageContentResult;
}
