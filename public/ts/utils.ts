declare global {
  interface Window {
    app: App;
  }
}

export interface App {
  showLoading: () => void;
  hideLoading: () => void;
}

export {};
