import '@testing-library/jest-dom';

// Mock requestAnimationFrame and cancelAnimationFrame
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock matchMedia
globalThis.matchMedia = globalThis.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock Fullscreen API
if (typeof document !== 'undefined') {
  document.documentElement.requestFullscreen = document.documentElement.requestFullscreen || function() {
    Object.defineProperty(document, 'fullscreenElement', {
      value: document.documentElement,
      writable: true,
      configurable: true
    });
    document.dispatchEvent(new Event('fullscreenchange'));
    return Promise.resolve();
  };

  document.exitFullscreen = document.exitFullscreen || function() {
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      writable: true,
      configurable: true
    });
    document.dispatchEvent(new Event('fullscreenchange'));
    return Promise.resolve();
  };
}

// Mock localStorage for jsdom environment
if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { for (const key in store) delete store[key]; },
    length: 0,
    key: (index) => Object.keys(store)[index] || null
  };
}
