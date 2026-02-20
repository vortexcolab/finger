chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
      
      if (request.message === "Give me entropy") {

          // Create a message channel
          const channel = new MessageChannel();
          // Post the port to the webpage
          window.postMessage(
              { action: "entropyRequest" },
              request.url,
              [channel.port2] // Transfer the port
          );

          // Listen for responses from the webpage
          channel.port1.onmessage = (event) => {
              //console.log("Entropy received from webpage:", event.data);

              // Send the result back to the extension
              sendResponse({ success: true, data: event.data });
          };

          // Indicate that the response will be sent asynchronously
          return true;
      }
    }
  );

  //console.log("Entras-te no message.js");