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

// Make Uint8Array.from non-function to trigger polyfill path
try {
  if (typeof window.Uint8Array.from === 'function') {
    try { delete window.Uint8Array.from; } catch (e) {
      try { Object.defineProperty(window.Uint8Array, 'from', { value: undefined, configurable: true, writable: true }); } catch (e) { }
    }
  }
} catch (e) { }

console.log('Before typeof Uint8Array.from =>', typeof window.Uint8Array.from);

// Provide a minimal chrome.runtime mock used by content script
global.chrome = { runtime: { sendMessage: (id, msg, cb) => { if (cb) cb({ success: false }); } } };

// Require the content script (it will run and inject the small polyfill script)
require(path.join(__dirname, '..', 'contentScripts', 'main.js'));

setTimeout(() => {
  console.log('After typeof Uint8Array.from =>', typeof window.Uint8Array.from);
  if (typeof window.Uint8Array.from === 'function') {
    console.log('Polyfill applied: PASS');
    process.exit(0);
  } else {
    console.error('Polyfill not applied: FAIL');
    process.exit(2);
  }
}, 200);
