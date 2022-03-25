import { html } from '../lib/utils.ts';

export default function header(currentPath: string) {
  return html`
    <header>
      <h1>
        <a href="/">
          <img alt="Logo: Snail with stylized letters 'BRN'" src="/public/images/logo.svg" width="120" />
        </a>
      </h1>
      <nav>
        <ul>
          <li class="${currentPath === '/ssr' ? 'active' : ''}">
            <a href="/ssr">
              SSR
            </a>
          </li>
          <li class="${currentPath === '/dynamic' ? 'active' : ''}">
            <a href="/dynamic">
              Dynamic
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `;
}
