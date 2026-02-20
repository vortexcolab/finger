// Global variables
/**
 * Description placeholder
 *
 * @type {*}
 */

chrome.action.onClicked.addListener(
  async (tab) => {
    chrome.action.setPopup(
      {popup: "action/main.html"},
      () => {
        chrome.action.openPopup();
      }
    )
    //console.log("Browser action clicked!");
  }
);

chrome.runtime.onMessageExternal.addListener( // Listen for messages from the content script
  function(request, sender, sendResponse) {
    try {
      if (request.action === 'getConfig') {
        const configUrl = chrome.runtime.getURL('config/config.json');
        const statusUrl = chrome.runtime.getURL('config/status.json');

        // Run async work in an IIFE and return true synchronously so the
        // message port remains open while we await network/storage results.
        (async () => {
          try {
            const [configResponse, statusResponse] = await Promise.all([
              fetch(configUrl),
              fetch(statusUrl)
            ]);

            if (!configResponse.ok) {
              throw new Error(`Failed to fetch config: ${configResponse.statusText}`);
            }
            if (!statusResponse.ok) {
              throw new Error(`Failed to fetch status: ${statusResponse.statusText}`);
            }

            const config = await configResponse.json();
            const status = await statusResponse.json();

            // chrome.storage.local.get uses a callback; wrap in a Promise
            const toggles = await new Promise((resolve) => chrome.storage.local.get(null, resolve));

            sendResponse({ success: true, config, status, toggles });
          } catch (error) {
            console.error('Error fetching configuration:', error);
            sendResponse({ success: false, error: error.message });
          }
        })();

        // Indicate that we'll respond asynchronously
        return true;
      }
    } catch (error) {
      console.error('Error handling action, ', error);
      sendResponse({ success: false, error: error.message });
    }
  }
);




