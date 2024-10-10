// Global variables
var activeTab, signal = true, signal2 = true, rule = true;

const types = [
  'cookies',
  'images',
  'javascript',
  'location',
  'popups',
  'notifications',
  'microphone',
  'camera',
  'automaticDownloads'
];

// Global functions
function mainObj() {

  this.permissions = {
    cookies: undefined,
    images: undefined,
    javascript: undefined,
    location: undefined,
    popups: undefined,
    notifications: undefined,
    microphone: undefined,
    camera: undefined,
    automaticDownloads: undefined
  };
  this.url = "";
  this.calls = [];
  this.camera = {enabled: undefined, muted: undefined};
  this.audio = {enabled: undefined, muted: undefined};
  this.cname = [];
  this.fontMetrics = {offsetWidth: 0, offsetHeight: 0, scrollWidth: 0, scrollHeight: 0, getBoundingClientRect: 0, window: {getComputedStyle: 0}};
  this.canvas = {present: false, getContext: false, toDataURL: false};
  this.audioctx = {audioContext: false, createOscillator: false, oscillator: {type: false, frequency: {value: false}}, createDynamicsCompressor: false, destination: false, startRendering: false};
  this.screen = {width: false, height: false};
  this.timezone = false;
  this.hardwareConcurrency = false;
  this.pluginEnumeration = {window: {onmessage: false, fetch: 0}, performance: { getEntriesByType: false }};
  this.cache = {performance: {now: false}, typedArrayConstructors: false};
  this.animation = {window: {requestAnimationFrame: false}};
  this.fontEnumeration = {top: 0, left: 0, position: 0, textContent: 0, fontFamily: 0, canvasmeasureText: 0, canvasfont: 0};
  this.battery = {charging: false, chargingTime: false, dischargingTime: false, level: false, navigator: {getBattery: false}};
  this.maxTouchPoints = {present: false}
}

function parseNested(str) {
  try {
      return JSON.parse(str, (_, val) => {
          if (typeof val === 'string')
              return parseNested(val)
          return val
      })
  } catch (exc) {
      return str
  }
}

function waitForSignal() {
  return new Promise(resolve => {
    const checkSignal = () => {
      if (signal && signal2) {
        signal = false;
        signal2 = false;
        console.log(signal, signal2);
        resolve();
      } else {
        setTimeout(checkSignal, 30); // Check again after 100 milliseconds
      }
    };
    checkSignal();
  });
}

function waitForRule() {
  return new Promise(resolve => {
    const checkRule = () => {
      if (rule) {
        rule = false;
        console.log(rule);
        resolve();
      } else {
        setTimeout(checkRule, 30); // Check again after 100 milliseconds
      }
    };
    checkRule();
  });
}

function parseResultToMainObj(result, url) {

  let tmp_obj;
  if (result === undefined || result === null) {
    tmp_obj = new mainObj();
    tmp_obj.url = url;
  } else {
    tmp_obj = parseNested(result);
  }
  return tmp_obj;
}

function setObj(obj, popup = true){
  chrome.storage.local.set(obj).then(() => {
    signal2 = true;
    console.log("I setted the object");
    if (popup) {
      chrome.action.setPopup(
        {popup: "action/main.html"}
      )
      // Send a message to the background or service worker
      chrome.runtime.sendMessage({ action: "action_reload" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Error:", chrome.runtime.lastError.message);
          // Optionally, handle specific error cases
          if (chrome.runtime.lastError.message === "No SW") {
            console.error("Service worker is not available.");
            // Consider retrying or notifying the user
          }
          //chrome.action.openPopup(); // Opening popup as an alternative action  HERE https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/User_actions
        } else if (!response) {
          console.log("action_reload got no response!");
          //chrome.action.openPopup();
        } else {
          console.log("Response from action script (popup):", response);
        }
      });

    }
  });
}

/* 

    WEB REQUESTS

*/


chrome.webRequest.onBeforeRequest.addListener(
  async function(details) {
    const { url } = details;
    
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const protocol = urlObj.protocol;


    if ('dns.google' == hostname || protocol == "file:") {
      return;
    }

    try {
      // Fetch DNS information to check for CNAME record
      const response = await fetch(`https://dns.google/resolve?name=${hostname}&type=CNAME`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();      
      const answers = data.Answer;

      if (answers && answers.length > 0 && answers[0].type === 5) {
        const cnameTarget = answers[0].data;
      
        console.log(`CNAME record found for ${hostname}: ${cnameTarget}`);

        chrome.action.setPopup(
          {popup: "action/main.html"}
        )
        chrome.runtime.sendMessage({ action: "is_alive?" }, response => {
          if (chrome.runtime.lastError) {
            console.log("Error:", chrome.runtime.lastError.message);
            chrome.action.openPopup();
          } else if (!response) {
            chrome.action.openPopup();
          }
          chrome.runtime.sendMessage({ action: "cname_attempt", data: {hostname: hostname, cnameTarget: cnameTarget} }, response => {
            if (chrome.runtime.lastError) {
              console.error("Error:", chrome.runtime.lastError.message);
            } else if (!response) {
              console.log("cname_attempt got no response!");
            } else if (response.block) {
              waitForRule().then(function () {
                chrome.declarativeNetRequest.getDynamicRules(rules => { 
                  let maxId = 1;
                  console.log((rules));
                    for (const rule of rules) {
                      console.log(rule);
                      if (rule.id >= maxId) {
                        maxId = rule.id + 1;
                      }
                    }
                  // add a dynamic rule
                  chrome.declarativeNetRequest.updateDynamicRules({
                    addRules: [{
                      id: maxId,
                      priority: 1,
                      action: { type: 'block' },
                      condition: {
                        excludedRequestDomains: [cnameTarget],
                        resourceTypes: ["main_frame"]
                      }
                    }]
                  }, () => {rule= true;console.log(`I update a dynamic rule!, ${hostname}: ${cnameTarget} `)});
                });
              });
            } else if (!response.block) {
              waitForRule().then(function () {
                chrome.declarativeNetRequest.getDynamicRules(rules => { 
                  let maxId = 1;
                  console.log(JSON.stringify(rules));
                    for (const rule of rules) {
                      console.log(rule);
                      if (rule.id >= maxId) {
                        maxId = rule.id + 1;
                      }
                    }
                  // add a dynamic rule
                  chrome.declarativeNetRequest.updateDynamicRules({
                    addRules: [{
                      id: maxId,
                      priority: 1,
                      action: { type: 'allowAllRequests' },
                      condition: {
                        excludedRequestDomains: [cnameTarget],
                        resourceTypes: ["main_frame"]
                      }
                    }]
                  }, () => {rule= true;console.log(`I update a dynamic rule!, ${hostname}: ${cnameTarget} `)});
                });
              });
            }
            else {
              return;
            }
          });
        });
      }
    } catch (error) {
      console.error("Error detecting CNAME:", error);
    }
  },
  {urls: ["https://*/*", "http://*/*"], types: [ "main_frame", "sub_frame", "script", "image", "stylesheet", "object", "xmlhttprequest", "other" ]}
);




function mediaDevices_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction


    if (data.audio) {
      tmp_obj.audio.muted = data.audio.muted;
      tmp_obj.audio.enabled = data.audio.enabled;
      tmp_obj.audio.id = data.audio.id;
    }
    if (data.video) {
      tmp_obj.camera.muted = data.video.muted;
      tmp_obj.camera.enabled = data.video.enabled;
      tmp_obj.camera.id = data.video.id;
    }

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj getUserMedia', parseNested(obj[url]));
    setObj(obj);      // obj set
  });

}

function camera_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction
    
    if (data == 'enabled') {
      tmp_obj.camera.enabled = true;
    } else if (data == 'disabled') {
      tmp_obj.camera.enabled = false;
    } else if (data == 'muted') {
      tmp_obj.camera.muted = true;
    } else if (data == 'unmuted') {
      tmp_obj.camera.muted = false;
    } else if (data == 'ended') {
      delete tmp_obj.camera; 
    }
    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);
    
    console.log('obj camera', parseNested(obj[url]));

    setObj(obj);      // obj set
  });

}

function microphone_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == 'enabled') {
      tmp_obj.audio.enabled = true;
    } else if (data == 'disabled') {
      tmp_obj.audio.enabled = false;
    } else if (data == 'muted') {
      tmp_obj.audio.muted = true;
    } else if (data == 'unmuted') {
      tmp_obj.audio.muted = false;
    } else if (data == 'ended') {
      delete tmp_obj.audio
    }
    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj microfone', parseNested(obj[url]));

    setObj(obj);      // obj set
  });

}

function fontMetrics_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    console.log('parsed storage', tmp_obj);
    if (data == 'offsetWidth')  tmp_obj.fontMetrics.offsetWidth++;
    else if (data == 'offsetHeight')  tmp_obj.fontMetrics.offsetHeight++;
    else if (data == 'scrollWidth')  tmp_obj.fontMetrics.scrollWidth++;
    else if (data == 'scrollHeight')  tmp_obj.fontMetrics.scrollHeight++;
    else if (data == 'getComputedStyle')  tmp_obj.fontMetrics.getComputedStyle++;
    else if (data == 'getBoundingClientRect')  tmp_obj.fontMetrics.getBoundingClientRect++;

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj fontMetrics', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });

}

function canvas_ActionHandler(url, data) {


  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    console.log('parsed storage', tmp_obj);
    if (data == 'document.createElement' || data == 'document.getElementsByTagName') {
      tmp_obj.canvas.present = true;
    } else if (data == 'HTMLCanvasElement.getContext') {
      tmp_obj.canvas.present = true;
    } else if (data == 'HTMLCanvasElement.toDataURL') {
      tmp_obj.canvas.toDataURL = true;
    }
    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj canvas', parseNested(obj[url]));

    setObj(obj, false);       // obj set
  });
}

function audioctx_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == 'window.AudioContext' || data == 'window.OfflineAudioContext') {
      tmp_obj.audioctx.audioContext = true;
    } else if (data == 'BaseAudioContext.createOscillator') {
      tmp_obj.audioctx.createOscillator = true;
    } else if (data == 'oscillatorNodeObject.type') {
      tmp_obj.audioctx.oscillator.type = true;
    } else if (data == 'oscillatorNodeObject.frequency.value') {
      tmp_obj.audioctx.oscillator.frequency.value = true;
    } else if (data == 'DynamicsCompressorNode') {
      tmp_obj.audioctx.createDynamicsCompressor = true;
    } else if (data == 'AudioContext.destination') {
      tmp_obj.audioctx.destination = true;
    } else if (data == 'AudioContext.startRendering') {
      tmp_obj.audioctx.startRendering = true;
    }

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj audio ctx ', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });
}

function screen_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == 'width') {
      tmp_obj.screen.width = true;
    } else if (data == 'height') {
      tmp_obj.screen.height = true;
    }

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj screen fp ', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });


}

function timezone_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == '1') {
      tmp_obj.timezone = true;
    } 

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj timezone fp ', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });
}

function hwConcurrency_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == '1') {
      tmp_obj.hardwareConcurrency = true;
    } 

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj hardwareConcurrency fp ', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });
}

function pluginEnumeration_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == 'window.onmessage') {
      tmp_obj.pluginEnumeration.window.onmessage = true;
    } else if (data == 'window.fetch') {
      tmp_obj.pluginEnumeration.window.fetch = tmp_obj.pluginEnumeration.window.fetch + 1;
    } else if (data == 'performance.getEntriesByType') {
      tmp_obj.pluginEnumeration.performance.getEntriesByType = true;
    }

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj pluginEnumeration fp ', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });
}

function cache_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == 'performance.now') {
      tmp_obj.cache.performance.now = true;
    } else {
      tmp_obj.cache.typedArrayConstructors = true;
    }

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj cache fp ', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });
}

function animation_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == 'window.requestAnimationFrame') {
      tmp_obj.animation.window.requestAnimationFrame = true;
    }

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj animation fp ', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });
}

function fontEnumeration_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    if (data == 'top') tmp_obj.fontEnumeration.top++;
    else if (data == 'fontFamily') tmp_obj.fontEnumeration.fontFamily++;
    else if (data == 'textContent') tmp_obj.fontEnumeration.textContent++;
    else if (data == 'position') tmp_obj.fontEnumeration.position++;
    else if (data == 'left') tmp_obj.fontEnumeration.left++;
    else if (data == 'canvasContext.measureText') tmp_obj.fontEnumeration.canvasmeasureText++;
    else if (data == 'canvasContext.font') tmp_obj.fontEnumeration.canvasfont++;

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj font enumeration fp ', parseNested(obj[url]));

    setObj(obj, false);      // obj set
  });
}

function maxTouchPoints_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction
    
    if (data == '1') 
      tmp_obj.maxTouchPoints.present = true;

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj maxtouchpoints fp ', parseNested(obj[url]));

    setObj(obj);      // obj set
  });
}

function battery_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    signal = true;
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction
    
    if (data == '1') 
      tmp_obj.battery.charging = true;
    else if (data == 'chargingTime') 
        tmp_obj.battery.chargingTime = true;
    else if (data == 'dischargingTime') 
        tmp_obj.battery.dischargingTime = true;
    else if (data == 'level') 
        tmp_obj.battery.level = true;
    else if (data == 'navigator.getBattery') 
        tmp_obj.battery.navigator.getBattery = true;

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    console.log('obj baterry fp ', parseNested(obj[url]));

    setObj(obj);      // obj set
  });
}

chrome.runtime.onMessageExternal.addListener(                 // Listen for messages from the content script
  function(request, sender, sendResponse) {                   // Store captured function call data
    
    try {
      console.log('received: ' + request.action, request);    // LOG
      console.log(signal, signal2);

      const action = request.action;
      switch (action) {
        case 'navigator.mediaDevices.getUserMedia':
          waitForSignal().then(() => {
              mediaDevices_ActionHandler(sender.url, request.data);
          });
        break;
        case 'camera':
          waitForSignal().then(() => {
              camera_ActionHandler(sender.url, request.data);
          });
        break;
        case 'microphone':
          waitForSignal().then(() => {
              microphone_ActionHandler(sender.url, request.data);
          });
        break;
        case 'font-metrics':
          waitForSignal().then(() => {
              fontMetrics_ActionHandler(sender.url, request.data);
          });
        break;
        case 'canvas':
          waitForSignal().then(() => {
              canvas_ActionHandler(sender.url, request.data);
          });
        break;
        case 'audioctx':
          waitForSignal().then(() => {
              audioctx_ActionHandler(sender.url, request.data);
          });
        break;
        case 'screen':
          waitForSignal().then(() => {
              screen_ActionHandler(sender.url, request.data);
          });
        break;
        case 'timezone':
          waitForSignal().then(() => {
              timezone_ActionHandler(sender.url, request.data);
          });
        break;
        case 'hardwareConcurrency':
          waitForSignal().then(() => {
              hwConcurrency_ActionHandler(sender.url, request.data);
          });
        break;
        case 'plugin-enumeration':
          waitForSignal().then(() => {
              pluginEnumeration_ActionHandler(sender.url, request.data);
          });
        break;
        case 'cache':
          waitForSignal().then(() => {
              cache_ActionHandler(sender.url, request.data);
          });
        break;
        case 'animation':
          waitForSignal().then(() => {
              animation_ActionHandler(sender.url, request.data);
          });
        break;
        case 'font-enumeration':
          waitForSignal().then(() => {
              fontEnumeration_ActionHandler(sender.url, request.data);
          });
        break;
        case 'battery':
          waitForSignal().then(() => {
              battery_ActionHandler(sender.url, request.data);
          });
        break;
        case 'maxTouchPoints':
          waitForSignal().then(() => {
              maxTouchPoints_ActionHandler(sender.url, request.data);
          });
        break;
      }
      sendResponse({success: true});
    } catch (error) {
      console.error("Error handling action, ", error);
    }
});


chrome.tabs.onActivated.addListener(

  (info) => {
    
    chrome.tabs.get(info.tabId, function (tab) {
      waitForSignal().then(() => {
          chrome.storage.local.get([tab.url]).then((result) => {
            signal = true;
            let tmp_obj = parseResultToMainObj(result[tab.url]);          // obj construction

            let promises = types.map(type => {
              return new Promise((resolve, reject) => {
                if (chrome.contentSettings[type]) {
                  chrome.contentSettings[type].get({ primaryUrl: tab.url }, function(details) {
                    if (typeof details === "undefined") {
                      resolve();
                    } else {
                      tmp_obj.permissions[type] = details.setting;
                      resolve();
                    }
                  });
                } else {
                  resolve();
                }
              });
            });

            Promise.all(promises).then(() => {
              let obj = {};
              obj[tab.url] = JSON.stringify(tmp_obj);
              console.log('ContentSetting for ', parseNested(obj[tab.url]));
              setObj(obj);      // obj set
            });
          });
      });
    });
  }
);

chrome.runtime.onInstalled.addListener(function() {

  // clear local storage
  chrome.storage.local.clear();

});

// Listen for tab refreshes
chrome.webNavigation.onCommitted.addListener(function(details) {

  chrome.tabs.get(details.tabId, function (tab) {
    console.log("tab url: ", tab.url);
    if (!tab.url.startsWith('http')) {
            console.log("RIGHT HERE");
      return;
    } else {
      if (details.transitionType === 'reload') {
        console.log('Tab refreshed:', details.tabId);
        // Perform any action you need here
        waitForSignal().then(() => {
          chrome.tabs.get(details.tabId, function (tab) {
            // clear local storage
            console.log(tab.url);
            chrome.storage.local.remove(tab.url).then((result) => {  signal = true, signal2 = true; console.log("REMOVED") });
        });
    
        });
      }
    }
  });


});

// Listen for tab closures
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  console.log('Tab closed:', tabId);
  chrome.tabs.get(tabId, function (tab) {
    console.log("tab url: ", tab.url);
    if (!tab.url.startsWith('http'))
      return;
    else {
      waitForSignal().then(() => {
        chrome.tabs.get(tabId, function (tab) {
          // clear local storage
          console.log(tab.url);
          chrome.storage.local.remove(tab.url).then((result) => {  signal = true, signal2 = true; console.log("REMOVED") });
        });
      });
    }
  });


});

// Listen for tab closures
chrome.tabs.onReplaced.addListener(function(tabId, removeInfo) {
  console.log('Tab replaced:', tabId);
  chrome.tabs.get(tabId, function (tab) {
    console.log("tab url: ", tab.url);
    if (!tab.url.startsWith('http'))
      return;
    else {
      waitForSignal().then(() => {
        chrome.tabs.get(tabId, function (tab) {
          // clear local storage
          console.log(tab.url);
          chrome.storage.local.remove(tab.url).then((result) => { signal = true, signal2 = true; console.log("REMOVED") });
        });
      });
    }
  });

});





