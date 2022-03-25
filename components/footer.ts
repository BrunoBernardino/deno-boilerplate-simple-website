import { html } from '../lib/utils.ts';

export default function footer() {
  return html`
    <footer>
      <nav>
        <ul>
          <li>
            view source in <a href="https://github.com/BrunoBernardino/deno-boilerplate-simple-website">GitHub</a>
          </li>
        </ul>
      </nav>

      <h3>
        by <a href="https://brunobernardino.com">Bruno Bernardino</a>
      </h3>
    </footer>
  `;
}
