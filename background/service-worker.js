// Global variables
var activeTab, signal = true, signal2 = true, rule = true;
const logLevel = 2; // LOG LEVEL: 0 - low, 1 - medium, 2 - high, 4 - intensive

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
  this.cname = [];
  this.camera = {status: 'safe'};
  this.audio = {status: 'safe'};
  this.fontMetrics = {status: 'safe'};
  this.canvas = {status: 'safe'};
  this.audioctx = {status: 'safe'};
  this.screen = {status: 'safe'};
  this.timezone = {status: 'safe'};
  this.hardwareConcurrency = {status: 'safe'};
  this.pluginEnumeration = {status: 'safe'};
  this.cache =  {status: 'safe'};
  this.animation = {status: 'safe'};
  this.fontEnumeration = {status: 'safe'};
  this.battery = {status: 'safe'};
  this.maxTouchPoints = {status: 'safe'}
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

function setObj(obj, freeGetSignal = false, popup = true){
  chrome.storage.local.set(obj).then(() => {
    signal = freeGetSignal;
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

/*
  details: {
    
    }

*/

/*
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
  {urls: ["https://*\/*", "http://*\/*"], types: [ "main_frame", "sub_frame", "script", "image", "stylesheet", "object", "xmlhttprequest", "other" ]}
);


*/

function mediaDevices_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
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
    setObj(obj, true);      // obj set
  });

}

function camera_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
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

    setObj(obj, true);      // obj set
  });

}

function microphone_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
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

    setObj(obj, true);      // obj set
  });

}

function fontMetrics_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);      

    (logLevel >= 2) ? console.log('font metrics parsed storage', tmp_obj): null;

    (data !== tmp_obj.fontMetrics.status) ? tmp_obj.fontMetrics.status = data: null;
    
    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream font metrics', parseNested(obj[url])) : null;

    setObj(obj, true, false);
  });

}

function canvas_ActionHandler(url, data) {


  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (logLevel >= 2) ? console.log('parsed storage canvas ', tmp_obj) : null;
    (data !== tmp_obj.canvas.status) ? tmp_obj.canvas.status = data: null;    
    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream canvas', parseNested(obj[url])) : null;

    setObj(obj, true, false);       // obj set
  });
}

function audioctx_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (data !== tmp_obj.audioctx.status) ? tmp_obj.audioctx.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream audioctx ', parseNested(obj[url])) : null;

    setObj(obj, true, false);      // obj set
  });
}

function screen_ActionHandler(url, data) {

  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (data !== tmp_obj.screen.status) ? tmp_obj.screen.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream screen ', parseNested(obj[url])) : null;

    setObj(obj, true, false);      // obj set
  });


}

function timezone_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (data !== tmp_obj.timezone.status) ? tmp_obj.timezone.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream timezone ', parseNested(obj[url])) : null;

    setObj(obj, true, false);      // obj set
  });
}

function hwConcurrency_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (data !== tmp_obj.hardwareConcurrency.status) ? tmp_obj.hardwareConcurrency.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream hardwareConcurrency ', parseNested(obj[url])) : null;

    setObj(obj, true, false);      // obj set
  });
}

function pluginEnumeration_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (data !== tmp_obj.pluginEnumeration.status) ? tmp_obj.pluginEnumeration.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream pluginEnumeration ', parseNested(obj[url])) : null;

    setObj(obj, true, false);      // obj set
  });
}

function cache_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (data !== tmp_obj.cache.status) ? tmp_obj.cache.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream cache ', parseNested(obj[url])) : null;

    setObj(obj, true, false);      // obj set
  });
}

function animation_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (data !== tmp_obj.animation.status) ? tmp_obj.animation.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream animation ', parseNested(obj[url])) : null;

    setObj(obj, true, false);      // obj set
  });
}

function fontEnumeration_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction

    (data !== tmp_obj.fontEnumeration.status) ? tmp_obj.fontEnumeration.status = data: null;

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream font enumeration ', parseNested(obj[url])) : null;

    setObj(obj, true, false);      // obj set
  });
}

function maxTouchPoints_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction
    
    (data !== tmp_obj.maxTouchPoints.status) ? tmp_obj.maxTouchPoints.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream maxtouchpoints ', parseNested(obj[url])) : null;

    setObj(obj, true);      // obj set
  });
}

function battery_ActionHandler(url, data) {
  chrome.storage.local.get([url]).then((result) => {
    let tmp_obj = parseResultToMainObj(result[url], url);          // obj construction
    
    (data !== tmp_obj.battery.status) ? tmp_obj.battery.status = data: null;   

    const obj = {};
    obj[url] = JSON.stringify(tmp_obj);

    (logLevel >= 2) ? console.log('memstream baterry ', parseNested(obj[url])) : null;

    setObj(obj, true);      // obj set
  });
}

chrome.runtime.onMessageExternal.addListener(                 // Listen for messages from the content script
  function(request, sender, sendResponse) {                   // Store captured function call data
    
    try {
      console.log('received: ' + request.action, request, sender.url);    // LOG
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
        case 'fontMetrics':
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
        case 'pluginEnumeration':
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
              setObj(obj, true);      // obj set
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
    waitForSignal().then(() => {
        chrome.storage.local.get([tab.url]).then((result) => {

          let tmp_obj = parseResultToMainObj(result[tab.url]);          // obj construction

          let promises = types.map(type => {
            return new Promise((resolve, reject) => {
              if (chrome.contentSettings[type]) {
                chrome.contentSettings[type].get({ primaryUrl: tab.url }, function(info) {
                  if (typeof info === "undefined") {
                    resolve();
                  } else {
                    tmp_obj.permissions[type] = info.setting;
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
            setObj(obj, true);      // obj set
          });
        });
    });
  });

  chrome.tabs.get(details.tabId, function (tab) {
    console.log("tab url: ", tab.url);
    if (!tab.url.startsWith('http')) {
            console.log("RIGHT HERE");
      return;
    } else {
      if (details.transitionType === 'reload') {
        console.log('Tab refreshed:', details.tabId, details.windowId);
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
  /*
    waitForSignal().then(() => {
      chrome.tabs.get(tabId, function (tab) {
        // clear local storage
        console.log("tab url: ", tab.url);
        chrome.storage.local.remove(tab.url).then((result) => {  signal = true, signal2 = true; console.log("REMOVED") });
      });
    });
  */
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





