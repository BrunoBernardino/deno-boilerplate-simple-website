(() => {
  function initializeApp() {
    window.app = {};
    initializeLoading();
    initializeCounterButton();

    document.dispatchEvent(new Event('app-loaded'));

    window.app.hideLoading();
  }

  function initializeLoading() {
    const loadingComponent = document.getElementById('loading');

    window.app.showLoading = () => loadingComponent.classList.remove('hide');
    window.app.hideLoading = () => loadingComponent.classList.add('hide');
  }

  function initializeCounterButton() {
    let counter = 0;

    const generateButtonText = (counter) => {
      return `This button has been clicked ${counter} time${counter !== 1 ? 's' : ''}!`;
    };

    const counterButton = document.getElementById('counter-button');

    if (counterButton) {
      const setCounter = (newCounter) => {
        counter = newCounter;
        counterButton.innerText = generateButtonText(counter);
      };

      window.app.setCounterButtonCounter = setCounter;

      counterButton.innerText = generateButtonText(counter);

      counterButton.addEventListener('click', () => {
        setCounter(++counter);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
  });
})();
