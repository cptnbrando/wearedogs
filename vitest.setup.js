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
