// jest.polyfills.js
// Polyfill TextEncoder/TextDecoder and setImmediate for Jest environment
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
// Robust fix for whatwg-url AsyncIterator prototype issue in Jest/Node environment
(function fixAsyncGeneratorPrototype() {
  try {
    const fn = async function* () {};
    const AsyncGeneratorFunctionPrototype = Object.getPrototypeOf(fn);
    if (AsyncGeneratorFunctionPrototype && !AsyncGeneratorFunctionPrototype.prototype) {
      // Create a dummy prototype that matches the expected structure
      const AsyncGeneratorPrototype = Object.create(Object.prototype);
      Object.defineProperty(AsyncGeneratorFunctionPrototype, 'prototype', {
        value: AsyncGeneratorPrototype,
        writable: true,
        configurable: true,
      });
      // And the prototype of that prototype
      const AsyncIteratorPrototype = Object.create(Object.prototype);
      Object.setPrototypeOf(AsyncGeneratorPrototype, AsyncIteratorPrototype);
    }
  } catch (e) {
    // Ignore errors during polyfill
  }
})();

if (typeof setImmediate === 'undefined') {
  const { setImmediate } = require('timers');
  global.setImmediate = setImmediate;
}
