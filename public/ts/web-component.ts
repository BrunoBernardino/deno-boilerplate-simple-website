import AppButton from './app-button.ts';

document.addEventListener('app-loaded', () => {
  customElements.define('app-button', AppButton, { extends: 'button' });
});
