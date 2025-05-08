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
    console.log("Browser action clicked!");
  }
);

chrome.runtime.onMessageExternal.addListener(                 // Listen for messages from the content script
  async function(request, sender, sendResponse) {                   // Store captured function call data
    
    try {
      console.log('Received:', request.action, request, sender.url); // LOG
      
      if (request.action === 'getConfig') {
        const configUrl = chrome.runtime.getURL('config/config.json');
        const statusUrl = chrome.runtime.getURL('config/status.json');

        try {
          // Fetch both files concurrently
          const [configResponse, statusResponse] = await Promise.all([
            fetch(configUrl),
            fetch(statusUrl)
          ]);

          // Check for errors in both responses
          if (!configResponse.ok) {
            throw new Error(`Failed to fetch config: ${configResponse.statusText}`);
          }
          if (!statusResponse.ok) {
            throw new Error(`Failed to fetch status: ${statusResponse.statusText}`);
          }

          // Parse JSON responses
          const [config, status] = await Promise.all([
            configResponse.json(),
            statusResponse.json()
          ]);
          // Send the successful response
          sendResponse({ success: true, config, status });
        } catch (error) {
          console.error('Error fetching configuration:', error);
          sendResponse({ success: false, error: error.message });
        }

        // Indicate that the response will be sent asynchronously
        return true;
      }

    } catch (error) {
      console.error("Error handling action, ", error);
      sendResponse({ success: false, error: error.message });
    }
});




