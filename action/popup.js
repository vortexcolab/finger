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
    window.location.reload();
  } else if (message.action == 'is_alive?') {
    sendResponse({success: true});
  } else if (message.action == 'cname_attempt') {
    console.log("cname_attempt");
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

  chrome.tabs.query({ highlighted: true}, function (tabs) {
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

        console.log(contentSettingsObj);
        document.getElementById('url').innerHTML = hostname;
  
        let elem = document.getElementById('contentSettings');
        types.forEach(function (type) {
          let child = document.createElement('p');
          child.innerHTML = type + ":" + contentSettingsObj.permissions[type];
          elem.appendChild(child);
        });
  
        // Font Metrics
        let elem3 = document.querySelector("#fontMetrics .result");
        // Rating = SUM(FontFamily, OffSetWidth, OffSetHeight)
        let rating = Object.values(contentSettingsObj.fontMetrics).reduce((total, currentValue) => total + currentValue, 0);
        if (rating < 5 ) {
          elem3.innerHTML= "safe";
          elem3.style.backgroundColor = "Green";
        } else if (rating < 50 ) {
          elem3.innerHTML= "low";
          elem3.style.backgroundColor = "Azure";
        } else if (rating < 200) {
          elem3.innerHTML= "medium";
          elem3.style.backgroundColor = "Cornsilk";
        } else if (rating < 800) {
          elem3.innerHTML= "high";
          elem3.style.backgroundColor = "DarkOrange";
        } else {
          elem3.innerHTML= "very high";
          elem3.style.backgroundColor = "DarkRed";
        }
  
        // Canvas Metrics
        let elem4 = document.querySelector("#canvasFingerprint .result");
        if (contentSettingsObj.canvas.present && contentSettingsObj.canvas.toDataURL) {
          elem4.innerHTML= "very high";
          elem4.style.backgroundColor = "DarkRed";
        } else if (contentSettingsObj.canvas.present) {
          elem4.innerHTML= "medium";
          elem4.style.backgroundColor = "Cornsilk";
        } else {
          elem4.innerHTML= "safe";
          elem4.style.backgroundColor = "Green";
        }

        // Audio Fingerprint
        let elem5 = document.querySelector("#audioFingerprint .result");
        if (contentSettingsObj.audioctx.audioContext && contentSettingsObj.audioctx.createOscillator && contentSettingsObj.audioctx.startRendering && contentSettingsObj.audioctx.destination && contentSettingsObj.audioctx.createDynamicsCompressor) {
          elem5.innerHTML= "very high";
          elem5.style.backgroundColor = "DarkRed";
        } else if (contentSettingsObj.audioctx.audioContext || contentSettingsObj.audioctx.createOscillator || contentSettingsObj.audioctx.startRendering || contentSettingsObj.audioctx.destination || contentSettingsObj.audioctx.createDynamicsCompressor) {
          elem5.innerHTML= "medium";
          elem5.style.backgroundColor = "Cornsilk";
        } else {
          elem5.innerHTML= "safe";
          elem5.style.backgroundColor = "Green";
        }

        // Screen Fingerprint
        let elem6 = document.querySelector("#screenFingerprint .result");
        if (contentSettingsObj.screen.width && contentSettingsObj.screen.height) {
          elem6.innerHTML= "very high";
          elem6.style.backgroundColor = "DarkRed";
        } else if (contentSettingsObj.screen.width || contentSettingsObj.screen.height) {
          elem6.innerHTML= "medium";
          elem6.style.backgroundColor = "Cornsilk";
        } else {
          elem6.innerHTML= "safe";
          elem6.style.backgroundColor = "Green";
        }

        // Timezone Fingerprint
        let elem7 = document.querySelector("#timezoneFingerprint .result");
        if (contentSettingsObj.timezone) {
          elem7.innerHTML= "very high";
          elem7.style.backgroundColor = "DarkRed";
        }  else {
          elem7.innerHTML= "safe";
          elem7.style.backgroundColor = "Green";
        }

        // Hardware Concurrency Fingerprint
        let elem8 = document.querySelector("#hwConcurrencyFingerprint .result");
        if (contentSettingsObj.hardwareConcurrency) {
          elem8.innerHTML= "very high";
          elem8.style.backgroundColor = "DarkRed";
        }  else {
          elem8.innerHTML= "safe";
          elem8.style.backgroundColor = "Green";
        }

        // Plugin Enumeration Fingerprint
        let elem9 = document.querySelector("#pluginEnumerationFingerprint .result");
        let rating2 = 0;

        if (contentSettingsObj.pluginEnumeration.window.onMessage)  rating2++;
        if (contentSettingsObj.pluginEnumeration.window.fetch)  rating2++;
        if (contentSettingsObj.pluginEnumeration.performance.getEntriesByType) rating2++;

        if ( rating2 == 3 ) {
          elem9.innerHTML= "very high";
          elem9.style.backgroundColor = "DarkRed";
        } else if ( rating2 == 2 ) {
          elem9.innerHTML= "high";
          elem9.style.backgroundColor = "DarkOrange";
        } else if ( rating2 == 1 ) {
          elem9.innerHTML= "medium";
          elem9.style.backgroundColor = "Cornsilk";
        } else if ( rating2 == 0 ) {
          elem9.innerHTML= "low";
          elem9.style.backgroundColor = "Azure";
        }

        // Cache Fingerprint
        let elem10 = document.querySelector("#cacheFingerprint .result");

        if (contentSettingsObj.cache.performance.now && contentSettingsObj.cache.typedArrayConstructors) {
          elem10.innerHTML= "very high";
          elem10.style.backgroundColor = "DarkRed";
        } else if (contentSettingsObj.cache.performance.now || contentSettingsObj.cache.typedArrayConstructors) {
          elem10.innerHTML= "medium";
          elem10.style.backgroundColor = "Cornsilk";
        } else {
          elem10.innerHTML= "low";
          elem10.style.backgroundColor = "Azure";
        }

        // Animation Fingerprint
        let elem11 = document.querySelector("#animationFingerprint .result");

        if (contentSettingsObj.animation.window.requestAnimationFrame) {
          elem11.innerHTML= "very high";
          elem11.style.backgroundColor = "DarkRed";
        } else {
          elem11.innerHTML= "safe";
          elem11.style.backgroundColor = "Green";
        }

        // Font Enumeration Fingerprint
        let elem12 = document.querySelector("#fontEnumerationFingerprint .result");
        // Rating = SUM(FontFamily, OffSetWidth, OffSetHeight)
        let rating3 = Object.values(contentSettingsObj.fontEnumeration).reduce((total, currentValue) => total + currentValue, 0);

        if (rating3 == 0) {
          elem12.innerHTML= "safe";
          elem12.style.backgroundColor = "Green";
        } else if (rating3 < 20 ) {
          elem12.innerHTML= "low";
          elem12.style.backgroundColor = "Azure";
        } else if (rating3 < 40) {
          elem12.innerHTML= "medium";
          elem12.style.backgroundColor = "Cornsilk";
        } else if (rating3 < 80) {
          elem12.innerHTML= "high";
          elem12.style.backgroundColor = "DarkOrange";
        } else {
          elem12.innerHTML= "very high";
          elem12.style.backgroundColor = "DarkRed";
        }

        // Battery Fingerprint
        let elem13 = document.querySelector("#batteryFingerprint .result");

        if (contentSettingsObj.battery.level && contentSettingsObj.battery.charging && (contentSettingsObj.battery.dischargingTime || contentSettingsObj.battery.chargingTime)) {
          elem13.innerHTML= "very high";
          elem13.style.backgroundColor = "DarkRed";
        } else if ((contentSettingsObj.battery.level || contentSettingsObj.battery.charging) && (contentSettingsObj.battery.dischargingTime || contentSettingsObj.battery.chargingTime)) {
          elem13.innerHTML= "high";
          elem13.style.backgroundColor = "DarkOrange";
        } else if ((contentSettingsObj.battery.level || contentSettingsObj.battery.charging) || (contentSettingsObj.battery.dischargingTime || contentSettingsObj.battery.chargingTime)) {
          elem13.innerHTML= "medium";
          elem13.style.backgroundColor = "Cornsilk";
        } else if (contentSettingsObj.battery.navigator.getBattery) {
          elem13.innerHTML= "low";
          elem13.style.backgroundColor = "Azure";
        } else {
          elem13.innerHTML= "safe";
          elem13.style.backgroundColor = "Green";
        }


      } else {
        var b = true;
        if (b) {
          document.body.innerHTML = "<h1 style='min-width: 200px;min-height:100px;'>Nothing have been loaded yet ...   &#x23f3;</h1>";
          b = false;
        } else {
          document.body.innerHTML = "<h1 style='min-width: 200px;min-height:100px;'>Nothing have been loaded yet ...   &#x231B;</h1>";
          b = true;
        }
        setTimeout(() => {
          if (b) {
            document.body.innerHTML = "<h1 style='min-width: 200px;min-height:100px;'>Nothing have been loaded yet ...   &#x23f3;</h1>";
            b = false;
          } else {
            document.body.innerHTML = "<h1 style='min-width: 200px;min-height:100px;'>Nothing have been loaded yet ...   &#x231B;</h1>";
            b = true;
          }
          window.location.reload();
        }, 1000);
      }

  
        });
  });
});


window.addEventListener('beforeunload', function (e) {
  chrome.action.setPopup(
      {popup: "action/main.html"}
    )
});