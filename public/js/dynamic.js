(() => {
  document.addEventListener('app-loaded', () => {
    const randomButton = document.getElementById('random-button');

    const setRandomValue = async () => {
      window.app.showLoading();
      const response = await fetch('/api/v0/random-positive-int');
      const { number } = await response.json();
      randomButton.innerText = `Got ${number}! Click me again!`;
      window.app.hideLoading();
    };

    randomButton.addEventListener('click', setRandomValue);
  });
})();
