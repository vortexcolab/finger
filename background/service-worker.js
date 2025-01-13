// Global variables
/**
 * Description placeholder
 *
 * @type {*}
 */
var activeTab;

chrome.action.onClicked.addListener(
  async (tab) => {
    chrome.action.setPopup(
      {popup: "action/main.html"},
      () => {
        chrome.action.openPopup();
      }
    )
    console.log("Browser action clicked!");

    /*
    // Perform an action, such as sending a message to the content script
    chrome.tabs.sendMessage(tab.id, { message: "Give me entropy", url: tab.url }, (response) => {
      console.log("Response from content script:", response);
      let obj = {};
      obj[tab.url] = JSON.stringify({entropy: response.data.entropy, tag: response.data.tag}); 
      chrome.storage.local.set(obj);
  });
  */
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


chrome.runtime.onInstalled.addListener(function() {

  // clear local storage
  chrome.storage.local.clear();

});

// Listen for tab refreshes
chrome.webNavigation.onCommitted.addListener(function(details) {
    
  chrome.tabs.get(details.tabId, function (tab) {
    if (!tab.url.startsWith('http')) {
      return;
    } else {
      if (details.transitionType === 'reload') {
        console.log('Tab refreshed:', details.tabId, details.windowId);
        // clear local storage
        chrome.storage.local.remove(tab.url).then((result) => { console.log("REMOVED") });
      }
    }
  });
});

// Listen for tab closures
chrome.tabs.onReplaced.addListener(function(tabId, removeInfo) {

  chrome.tabs.get(tabId, function (tab) {
    if (!tab.url.startsWith('http'))
      return;
    else {
      chrome.storage.local.remove(tab.url).then((result) => { console.log("REMOVED") });
    }  
  });

});





