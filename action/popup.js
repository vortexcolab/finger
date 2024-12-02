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

// global functions
function isEmpty(variable) {
  // Verifica se a variável é nula ou indefinida
  if (variable === null || variable === undefined) {
      return true;
  }

  // Verifica se é um array
  if (Array.isArray(variable)) {
      return variable.length === 0;
  }

  // Verifica se é um objeto
  if (typeof variable === 'object') {
      return Object.keys(variable).length === 0;
  }

  // Para outros tipos de variáveis (string, number, etc.), considerar como não vazio
  return false;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Log the message received from the background script
  console.log("Message received in action script (popup):", message);
  
  if (message.action == 'action_reload') {
    sendResponse({success: true});
    window.location.reload();
  } else if (message.action == 'is_alive?') {
    sendResponse({success: true});
  } else if (message.action == 'cname_attempt') {
    let resp = window.confirm(message.data.hostname + ' redirected to the cname ' + message.data.cnameTarget + ', block next time?');
    if (resp == true) {
      sendResponse({block: true});
    } else {
      sendResponse({block: false});
    }
  }
  // Send a response back to the background script (if needed)
  sendResponse("Message received in action script (popup).");
  return true;
});

document.addEventListener('DOMContentLoaded', function () {

  chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
    let current = tabs[0];
    incognito = current.incognito;
    let url = current.url;
    const hostname = new URL(url).hostname;

    chrome.storage.local.get(url).then((result) => {
      var contentSettingsObj;

      if (!isEmpty(result)) {
        contentSettingsObj = JSON.parse(result[url]);

        if (contentSettingsObj.camera.enabled && !contentSettingsObj.camera.muted) {
          document.getElementById('camera-green').style.display = 'none';
          document.getElementById('camera-yellow-muted').style.display = 'none';
          document.getElementById('camera-yellow').style.display = 'none';
          document.getElementById('camera-red').style.display = 'flex';
        } else if (!contentSettingsObj.camera.enabled) {
          document.getElementById('camera-green').style.display = 'none';
          document.getElementById('camera-yellow').style.display = 'flex';
          document.getElementById('camera-yellow-muted').style.display = 'none';
          document.getElementById('camera-red').style.display = 'none';
        } else if (contentSettingsObj.camera.muted) {
          document.getElementById('camera-green').style.display = 'none';
          document.getElementById('camera-yellow').style.display = 'none';
          document.getElementById('camera-yellow-muted').style.display = 'flex';
          document.getElementById('camera-red').style.display = 'none';
        } else {
          document.getElementById('camera-green').style.display = 'flex';
          document.getElementById('camera-yellow').style.display = 'none';
          document.getElementById('camera-yellow-muted').style.display = 'none';
          document.getElementById('camera-red').style.display = 'none';
        }

        if (contentSettingsObj.audio.enabled && !contentSettingsObj.audio.muted) {
            document.getElementById('audio-green').style.display = 'none';
            document.getElementById('audio-yellow-muted').style.display = 'none';
            document.getElementById('audio-yellow').style.display = 'none';
            document.getElementById('audio-red').style.display = 'flex';
        } else if (contentSettingsObj.audio.enabled) {
            document.getElementById('audio-green').style.display = 'none';
            document.getElementById('audio-yellow').style.display = 'flex';
            document.getElementById('audio-yellow-muted').style.display = 'none';
            document.getElementById('audio-red').style.display = 'none';
        } else if (contentSettingsObj.audio.muted) {
            document.getElementById('audio-green').style.display = 'none';
            document.getElementById('audio-yellow-muted').style.display = 'flex';
            document.getElementById('audio-yellow').style.display = 'none';
            document.getElementById('audio-red').style.display = 'none';
        } else {
            document.getElementById('audio-green').style.display = 'flex';
            document.getElementById('audio-yellow').style.display = 'none';
            document.getElementById('audio-yellow-muted').style.display = 'none';
            document.getElementById('audio-red').style.display = 'none';
        }

        document.getElementById('url').innerHTML = hostname;
  
        let elem = document.getElementById('contentSettings');
        types.forEach(function (type) {
          let child = document.createElement('p');
          child.innerHTML = type + ":" + contentSettingsObj.permissions[type];
          elem.appendChild(child);
        });
  
        // Font Metrics
        let fontmetricsElem = document.querySelector("#fontMetrics .result");
        fontmetricsElem.innerHTML= contentSettingsObj.fontMetrics.status;

        (contentSettingsObj.fontMetrics.status === "very high") ? 
        fontmetricsElem.style.backgroundColor = "DarkRed" :
        (contentSettingsObj.fontMetrics.status === "high") ?
        fontmetricsElem.style.backgroundColor = "DarkOrange" :
        (contentSettingsObj.fontMetrics.status === "medium") ?
        fontmetricsElem.style.backgroundColor = "Cornsilk" :
        (contentSettingsObj.fontMetrics.status === "low") ?
        fontmetricsElem.style.backgroundColor = "Azure" : fontmetricsElem.style.backgroundColor = "Green";
  
        // Canvas Metrics
        let canvasElem = document.querySelector("#canvasFingerprint .result");
        canvasElem.innerHTML = contentSettingsObj.canvas.status;
        (contentSettingsObj.canvas.status === "very high") ?
        canvasElem.style.backgroundColor = "DarkRed":
        (contentSettingsObj.canvas.status === "medium") ?
        canvasElem.style.backgroundColor = "Cornsilk" : canvasElem.style.backgroundColor = "Green";

        // Audio Fingerprint
        let audioctxElem = document.querySelector("#audioFingerprint .result");
        audioctxElem.innerHTML = contentSettingsObj.audioctx.status;
        (contentSettingsObj.audioctx.status === "very high") ?
        audioctxElem.style.backgroundColor = "DarkRed" :
        (contentSettingsObj.audioctx.status === "high") ?
        audioctxElem.style.backgroundColor = "DarkOrange" :         
        (contentSettingsObj.audioctx.status === "medium") ?
        audioctxElem.style.backgroundColor = "Cornsilk" :
        (contentSettingsObj.audioctx.status === "low") ?
        audioctxElem.innerHTML= "Azure" : audioctxElem.style.backgroundColor = "Green";
        
        // Screen Fingerprint
        let screenElem = document.querySelector("#screenFingerprint .result");
        screenElem.innerHTML = contentSettingsObj.screen.status;
        (contentSettingsObj.screen.status === "very high") ?
        screenElem.style.backgroundColor = "DarkRed" :
        (contentSettingsObj.screen.status === "medium") ?
        screenElem.style.backgroundColor = "Cornsilk": screenElem.style.backgroundColor = "Green";

        // Timezone Fingerprint
        let timezoneElem = document.querySelector("#timezoneFingerprint .result");
        timezoneElem.innerHTML = contentSettingsObj.timezone.status;
        (contentSettingsObj.timezone.status === "very high") ?
        timezoneElem.style.backgroundColor = "DarkRed" : timezoneElem.style.backgroundColor = "Green";

        // Hardware Concurrency Fingerprint
        let hwConcurrencyElem = document.querySelector("#hwConcurrencyFingerprint .result");
        hwConcurrencyElem.innerHTML = contentSettingsObj.hardwareConcurrency.status;
        (contentSettingsObj.hardwareConcurrency.status === "very high") ?
        hwConcurrencyElem.style.backgroundColor = "DarkRed": hwConcurrencyElem.style.backgroundColor = "Green";

        // Plugin Enumeration Fingerprint
        let pluginEnumElem = document.querySelector("#pluginEnumerationFingerprint .result");
        pluginEnumElem.innerHTML = contentSettingsObj.pluginEnumeration.status;

        (contentSettingsObj.pluginEnumeration.status === "very high") ?
        pluginEnumElem.style.backgroundColor = "DarkRed":
        (contentSettingsObj.pluginEnumeration.status === "high") ?
        pluginEnumElem.style.backgroundColor = "DarkOrange":
        (contentSettingsObj.pluginEnumeration.status === "medium") ?
        pluginEnumElem.style.backgroundColor = "Cornsilk":
        (contentSettingsObj.pluginEnumeration.status === "low") ?
        pluginEnumElem.style.backgroundColor = "Azure": pluginEnumElem.style.backgroundColor = "Green";

        // Cache Fingerprint
        let cacheElem = document.querySelector("#cacheFingerprint .result");
        cacheElem.innerHTML = contentSettingsObj.cache.status;

        (contentSettingsObj.cache.status === "very high") ?
        cacheElem.style.backgroundColor = "DarkRed":
        (contentSettingsObj.cache.status == "medium") ?
        cacheElem.style.backgroundColor = "Cornsilk": cacheElem.style.backgroundColor = "Green";

        // Animation Fingerprint
        let animationElem = document.querySelector("#animationFingerprint .result");
        animationElem.innerHTML = contentSettingsObj.animation.status;
        (contentSettingsObj.animation.status === "very high") ?
        animationElem.style.backgroundColor = "DarkRed": 
        animationElem.style.backgroundColor = "Green";

        // Font Enumeration Fingerprint
        let fontEnumElem = document.querySelector("#fontEnumerationFingerprint .result");
        fontEnumElem.innerHTML = contentSettingsObj.fontEnumeration.status;
        (contentSettingsObj.fontEnumeration.status === "very high") ?
        fontEnumElem.style.backgroundColor = "DarkRed":
        (contentSettingsObj.fontEnumeration.status === "high") ?
        fontEnumElem.style.backgroundColor = "DarkOrange":
        (contentSettingsObj.fontEnumeration.status === "medium") ?
        fontEnumElem.style.backgroundColor = "Cornsilk":
        (contentSettingsObj.fontEnumeration.status === "low") ?
        fontEnumElem.style.backgroundColor = "Azure": fontEnumElem.style.backgroundColor = "Green";


        // Battery Fingerprint
        let batteryElem = document.querySelector("#batteryFingerprint .result");
        batteryElem.innerHTML = contentSettingsObj.battery.status;
        (contentSettingsObj.battery.status === "very high") ?
        batteryElem.style.backgroundColor = "DarkRed":
        (contentSettingsObj.battery.status === "high") ?
        batteryElem.style.backgroundColor = "DarkOrange":
        (contentSettingsObj.battery.status === "medium") ?
        batteryElem.style.backgroundColor = "Cornsilk":
        (contentSettingsObj.battery.status === "low") ?
        batteryElem.style.backgroundColor = "Azure": batteryElem.style.backgroundColor = "Green";


        // maxTouchPoints Fingerprint
        let maxTouchPointsElem = document.querySelector("#maxTouchPointsFingerprint .result");
        maxTouchPointsElem.innerHTML = contentSettingsObj.maxTouchPoints.status;
        (contentSettingsObj.maxTouchPoints.status === "very high") ?
        maxTouchPointsElem.style.backgroundColor = "DarkRed":
        maxTouchPointsElem.style.backgroundColor = "Green";

      } else {
        console.log("Empty");
        b = true;
        setTimeout(() => {
          if (b) {
            b = false;
            document.body.innerHTML = "<h1 style='min-width: 200px;min-height:100px;'>Nothing have been loaded yet ...   &#x23f3;</h1>";
          } else {
            document.body.innerHTML = "<h1 style='min-width: 200px;min-height:100px;'>Nothing have been loaded yet ...   &#x231B;</h1>";
          }
        }, 2000);
      }

    });
  });
});


window.addEventListener('beforeunload', function (e) {
  chrome.action.setPopup(
      {popup: "action/main.html"}
    )
});