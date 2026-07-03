import 'whatwg-fetch';

Object.defineProperty(window, 'fetch', {
  writable: true,
  value: globalThis.fetch
});
