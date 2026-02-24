const { JSDOM } = require('jsdom');
const path = require('path');

const dom = new JSDOM(`<!doctype html><html><head></head><body></body></html>`, {
  runScripts: 'dangerously',
  resources: 'usable'
});

const { window } = dom;
global.window = window;
global.document = window.document;
global.Node = window.Node;
global.Element = window.Element;
global.HTMLElement = window.HTMLElement;
global.navigator = window.navigator;
global.location = window.location;
global.getComputedStyle = window.getComputedStyle;
global.console = console;
global.Uint8Array = window.Uint8Array;

// Mock chrome.runtime to return config and status so applyConfig runs
global.chrome = { runtime: { sendMessage: (id, msg, cb) => {
  try {
    const cfg = require(path.join(__dirname, '..', 'config', 'config.json'));
    const status = { window: { Uint8Array: false } };
    const toggles = { blockFingerprinting: false };
    if (cb) cb({ success: true, config: cfg, status: status, toggles: toggles });
  } catch (e) {
    if (cb) cb({ success: false });
  }
} } };

// Require the content script (it will run and install hooks)
require(path.join(__dirname, '..', 'contentScripts', 'main.js'));

// Simulate a polyfill that runs after the hook: define `from` on the original constructor
setTimeout(() => {
  try {
    if (typeof window.Uint8Array.from !== 'function') {
      Object.defineProperty(window.Uint8Array, 'from', {
        value: function(source, mapFn, thisArg) {
          return new window.Uint8Array(Array.from(source, mapFn, thisArg));
        },
        writable: true,
        configurable: true
      });
    }
  } catch (e) {}

  // Give the polyfill a moment before assertions
}, 50);

setTimeout(() => {
  try {
    // Test 1: wrapper exists and has static `from`
    if (typeof window.Uint8Array !== 'function') throw new Error('Uint8Array is not a function');
    if (typeof window.Uint8Array.from !== 'function') throw new Error('Uint8Array.from missing');

    // Test 2: construct behavior
    const a = new window.Uint8Array(3);
    if (!(a instanceof window.Uint8Array)) throw new Error('instanceof check failed for new Uint8Array');
    if (a.length !== 3) throw new Error('constructed length mismatch');

    // Test 3: subclassing
    class Sub extends window.Uint8Array {}
    const s = new Sub(2);
    if (!(s instanceof Sub)) throw new Error('subclass instanceof Sub failed');
    if (!(s instanceof window.Uint8Array)) throw new Error('subclass instanceof Uint8Array failed');

    console.log('Constructor tests: PASS');
    process.exit(0);
  } catch (e) {
    console.error('Constructor tests: FAIL -', e.message);
    process.exit(2);
  }
}, 200);
