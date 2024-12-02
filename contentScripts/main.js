// The ID of the extension we want to talk to.
const extensionId = "mlljmejlaloeaofagliclpnmpeooljcc";
// LOG LEVEL: 0 - low, 1 - medium, 2 - high, 4 - intensive
const logLevel = 4;

let videoTrack, audioTrack, trackAudioProxy, trackVideoProxy;

(logLevel <= 1) ? console.log("Entraste no main.js "): null;

// Global Status Obj
const fingerStatus = {
  fontMetrics: {signal: true, status: undefined, offsetWidth: 0, offsetHeight: 0, scrollWidth: 0, scrollHeight: 0, getBoundingClientRect: 0, window: {getComputedStyle: 0}},
  canvas: {signal: true, status: undefined, present: false, getContext: false, toDataURL: false},
  audioctx: {signal: true, status: undefined, audioContext: false, createOscillator: false, oscillator: {start: false, type: false, frequency: {value: false}}, createDynamicsCompressor: false, destination: false, startRendering: false, dynamicsCompressorNode: {connect: false, threshold: false, knee: false, ratio: false, reduction: false, attack: false, release: false}},
  screen: {signal: true, status: undefined, width: false, height: false},
  timezone: {signal: true, status: undefined, present: false},
  hardwareConcurrency: {signal: true, status: undefined, present: false},
  pluginEnumeration: {signal: true, status: undefined, window: {onmessage: false, fetch: 0}, performance: { getEntriesByType: false }},
  cache: {signal: true, status: undefined, performance: {now: false}, typedArrayConstructors: false},
  animation: {signal: true, status: undefined, window: {requestAnimationFrame: false}},
  fontEnumeration: {signal: true, status: undefined, total: 0,top: 0, left: 0, position: 0, textContent: 0, fontFamily: 0, canvasmeasureText: 0, canvasfont: 0},
  battery: {signal: true, status: undefined, charging: false, chargingTime: false, dischargingTime: false, level: false, navigator: {getBattery: false}},
  maxTouchPoints: {signal: true, status: undefined, present: false}
}

function waitForSignal(name) {
  return new Promise(resolve => {
    const checkSignal = () => {
      if (fingerStatus[name].signal) {
        fingerStatus[name].signal = false;
        console.log(fingerStatus[name].signal);
        resolve();
      } else {
        setTimeout(checkSignal, 50); // Check again after 100 milliseconds
      }
    };
    checkSignal();
  });
}

// Create a function to dispatch custom events
function dispatchEnabledChangeEvent(track, enabled) {
  const event = new Event('enabledchange');
  event.enabled = enabled;
  track.dispatchEvent(event);
}

function sendMessage(action, status) {
  if (fingerStatus[action].status != status) {
    waitForSignal(action).then( () => {
      if (fingerStatus[action].status != status) {
        chrome.runtime.sendMessage(extensionId, { action: action, data: status }, (response) => {
          if (response.success) {
            fingerStatus[action].status = status;
          } else {
            console.error(`Unable to get a successfull response from background script for ${action},${status}`)
          }
          fingerStatus[action].signal = true;
        });
      } else {
        fingerStatus[action].signal = true;
      }
    });
  }
}

function updateFontMetricsStatus() {
  if (fingerStatus.fontMetrics.total < 5) {
    sendMessage('fontMetrics', 'safe');
  } else if (fingerStatus.fontMetrics.total < 50) {
    sendMessage('fontMetrics', 'low');
  } else if (fingerStatus.fontMetrics.total < 200) {
    sendMessage('fontMetrics', 'medium');
  } else if (fingerStatus.fontMetrics.total < 800) {
    sendMessage('fontMetrics', 'high');
  } else {
    sendMessage('fontMetrics', 'very high');
  }
}

function updateFontEnumerationStatus() {

  let rating = Object.values(fingerStatus.fontEnumeration).reduce((total, currentValue) => Number.isInteger(currentValue) ?
   total + currentValue : total, 0);

  if (rating == 0) {
    sendMessage('fontEnumeration', 'safe');
  } else if (rating < 20) {
    sendMessage('fontEnumeration', 'low');
  } else if (rating < 40) {
    sendMessage('fontEnumeration', 'medium');
  } else if (rating < 80) {
    sendMessage('fontEnumeration', 'high');
  } else {
    sendMessage('fontEnumeration', 'very high');
  }
}

function updateCanvasStatus() {

  if (fingerStatus.canvas.present && fingerStatus.canvas.toDataURL) {
    sendMessage('canvas', 'very high');
  } else if (fingerStatus.canvas.present) {
    sendMessage('canvas', 'medium');
  } else {
    sendMessage('canvas', 'safe');
  }
}



function updateAudioctxStatus() {

  if (fingerStatus.audioctx.audioContext && fingerStatus.audioctx.startRendering 
    && fingerStatus.audioctx.createOscillator && fingerStatus.audioctx.createDynamicsCompressor
    && fingerStatus.audioctx.oscillator.type && fingerStatus.audioctx.oscillator.frequency.value
    && fingerStatus.destination) {
    sendMessage('audioctx', 'very high');
  } else if (fingerStatus.audioctx.audioContext && fingerStatus.audioctx.startRendering 
    && (fingerStatus.audioctx.createOscillator || fingerStatus.audioctx.createDynamicsCompressor)
    && (fingerStatus.audioctx.oscillator.type || fingerStatus.audioctx.oscillator.frequency.value)
    && fingerStatus.audioctx.destination) {
    sendMessage('audioctx', 'high');
  } else if (fingerStatus.audioctx.audioContext && fingerStatus.audioctx.startRendering) {
    sendMessage('audioctx', 'medium');
  } else {
    sendMessage('audioctx', 'safe');
  }
}

function updateScreenStatus() {

  if (fingerStatus.screen.width && fingerStatus.screen.height) {
    sendMessage('screen', 'very high');
  } else if (fingerStatus.screen.width || fingerStatus.screen.height) {
    sendMessage('screen', 'medium');
  } else {
    sendMessage('screen', 'safe');
  }
}

function updateTimezoneStatus() {

  if (fingerStatus.timezone.present) {
    sendMessage('timezone', 'very high');
  }  else {
    sendMessage('timezone', 'safe');
  }
}

function updateHardwareConcurrencyStatus() {
  if (fingerStatus.hardwareConcurrency.present) {
    sendMessage('hardwareConcurrency', 'very high');
  }  else {
    sendMessage('hardwareConcurrency', 'safe');
  }
}

function updateMaxTouchPointsStatus() {
  if (fingerStatus.maxTouchPoints.present) {
    sendMessage('maxTouchPoints', 'very high');
  } else {
    sendMessage('maxTouchPoints', 'safe');
  }
}

function updatePluginEnumerationStatus() {
  let rating = 0;

  if (fingerStatus.pluginEnumeration.window.onmessage)  rating++;
  if (fingerStatus.pluginEnumeration.window.fetch > 0)  rating++;
  if (fingerStatus.pluginEnumeration.performance.getEntriesByType) rating++;

  if (fingerStatus.pluginEnumeration.window.fetch > 100 || rating == 3) {
    sendMessage('pluginEnumeration', 'very high');
  } else if (fingerStatus.pluginEnumeration.window.fetch > 50 || fingerStatus.pluginEnumeration.performance.getEntriesByType) {
    sendMessage('pluginEnumeration', 'high');
  } else if (fingerStatus.pluginEnumeration.window.fetch > 30 || rating == 2) {
    sendMessage('pluginEnumeration', 'medium');
  } else if (rating == 1) {
    sendMessage('pluginEnumeration', 'low');
  } else if ( rating == 0 ) {
    sendMessage('pluginEnumeration', 'safe');
  }
}

function updateCacheStatus() {
  if (fingerStatus.cache.performance.now && fingerStatus.cache.typedArrayConstructors) {
    sendMessage('cache', 'very high');
  } else if (fingerStatus.cache.performance.now || fingerStatus.cache.typedArrayConstructors) {
    sendMessage('cache', 'medium');
  } else {
    sendMessage('cache', 'safe');
  }
}

function updateAnimationStatus() {
  if (fingerStatus.animation.window.requestAnimationFrame) {
    sendMessage('animation', 'very high');
  } else {
    sendMessage('animation', 'safe');
  }
}

function updateBatteryStatus() {
  if (fingerStatus.battery.level && fingerStatus.battery.charging && (fingerStatus.battery.dischargingTime || fingerStatus.battery.chargingTime)) {
    sendMessage('battery', 'very high');
  } else if ((fingerStatus.battery.level || fingerStatus.battery.charging) && (fingerStatus.battery.dischargingTime || fingerStatus.battery.chargingTime)) {
    sendMessage('battery', 'high');
  } else if ((fingerStatus.battery.level || fingerStatus.battery.charging) || (fingerStatus.battery.dischargingTime || fingerStatus.battery.chargingTime)) {
    sendMessage('battery', 'medium');
  } else if (fingerStatus.battery.navigator.getBattery) {
    sendMessage('battery', 'low');
  } else {
    sendMessage('battery', 'safe');
  }
}

function updateStatus(technique) {
  const functionName = `update${technique.charAt(0).toUpperCase()}${technique.slice(1)}Status`;
  if (typeof window[functionName] === 'function') {
    window[functionName]();
  }
}

function interceptFontMetrics_AND_FontEnumeration() {

  // local variables
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const originalGetComputedStyle = window.getComputedStyle;
  const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style');
  const styleProxyHandler = {   
    get(target, prop, receiver) {
      (logLevel <= 2) ? console.log(`Accessing style.${prop}`) : null;
      if (['position', 'top', 'left', 'fontFamily'].includes(prop)){
        fingerStatus.fontEnumeration[prop]++; fingerStatus.fontEnumeration.total++;
        updateStatus("fontEnumeration");
      }

      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'function') {
        return value.bind(target);
      }
      return value;
    },
    set(target, prop, value) {
      (logLevel <= 2) ? console.log(`Setting style.${prop} to ${value}`) : null;
      if (['position', 'top', 'left', 'fontFamily'].includes(prop)) {
        fingerStatus.fontEnumeration[prop]++; fingerStatus.fontEnumeration.total++;
        updateStatus("fontEnumeration");
      }
      return Reflect.set(target, prop, value);
    }
  };

  Element.prototype.getBoundingClientRect = function() {
    (logLevel <= 2) ? console.log('getBoundingClientRect intercepted for element:', this) : null;
    fingerStatus.fontMetrics.getBoundingClientRect++;
    fingerStatus.fontMetrics.total++;
    updateStatus("fontMetrics");
    return originalGetBoundingClientRect.apply(this, arguments);
  };

  window.getComputedStyle = function(element, pseudoElt) {
    (logLevel <= 2) ? console.log('getComputedStyle intercepted for element:', element) : null;
    fingerStatus.fontMetrics.window.getComputedStyle++;
    fingerStatus.fontMetrics.total++;
    updateStatus("fontMetrics");
    return originalGetComputedStyle.apply(this, arguments);
  };

  // Utility function to intercept property access
  function interceptPropertyAccess(obj, property) {

    const originalDescriptor = Object.getOwnPropertyDescriptor(obj, property);   
    Object.defineProperty(obj, property, {
      get: function() {
        (logLevel <= 2) ? console.log(`${property} intercepted for element:`, this) : null;
        if (['offsetWidth', 'offsetHeight'].includes(property)) {
          fingerStatus.fontMetrics[property]++; fingerStatus.fontMetrics.total++;
          fingerStatus.fontEnumeration[property]++; fingerStatus.fontEnumeration.total++;
          updateStatus("fontMetrics");  updateStatus("fontEnumeration");
          return originalDescriptor.get.apply(this);
        } else if (['textContent'].includes(property)) {
          fingerStatus.fontMetrics[property]++; fingerStatus.fontMetrics.total++;
          updateStatus("fontMetrics");
          return originalDescriptor.get.apply(this);
        }
      },
      set: function(newValue) {
        if (['textContent'].includes(property)) {
          fingerStatus.fontEnumeration[property]++; fingerStatus.fontEnumeration.total++;
          updateStatus("fontEnumeration");
          return originalDescriptor.set.apply(this, [newValue]);
        }
      },
      configurable: true,
      enumerable: true
    });
  }

  for (const x of ['offsetWidth', 'offsetHeight', 'scrollWidth', 'scrollHeight'])
    interceptPropertyAccess(HTMLElement.prototype, x);
  interceptPropertyAccess(Node.prototype, 'textContent');



  // Define a new style property with a proxy on HTMLElement's prototype
  Object.defineProperty(HTMLElement.prototype, 'style', {
    get() {
      return new Proxy(originalDescriptor.get.call(this), styleProxyHandler);
    },
    configurable: true,
    enumerable: true
  });
  
  // Canvas font enumeration
  // Intercept the 'font' property
  const originalFontDescriptor = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'font');
  
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'font', {
    get() {
      (logLevel <= 2) ? console.log('Accessing CanvasRenderingContext2D.font') : null;
      fingerStatus.fontEnumeration.canvasfont++; fingerStatus.fontEnumeration.total++;
      updateStatus("fontEnumeration");
      return originalFontDescriptor.get.call(this);
    },
    set(value) {
      (logLevel <= 2) ? console.log('Setting CanvasRenderingContext2D.font to', value) : null;
      fingerStatus.fontEnumeration.canvasfont++; fingerStatus.fontEnumeration.total++;
      updateStatus("fontEnumeration");
      originalFontDescriptor.set.call(this, value);
    },
    configurable: true,
    enumerable: true
  });

  // Intercept the 'measureText' method
  const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;

  CanvasRenderingContext2D.prototype.measureText = function(...args) {
    (logLevel <= 2) ? console.log('Calling CanvasRenderingContext2D.measureText with arguments:', args) : null;
    fingerStatus.fontEnumeration.measureText++; fingerStatus.fontEnumeration.total++;
    updateStatus("fontEnumeration");
    return originalMeasureText.apply(this, args);
  };
  
}

// Capture function calls
function interceptUserMedia() {

  // Save the original getUserMedia method
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  // Override getUserMedia method
  navigator.mediaDevices.getUserMedia = async function(constraints) {
    (logLevel <= 2) ? console.log('Custom code executed in getUserMedia'): null;

    // Call the original getUserMedia method with the provided constraints
    return originalGetUserMedia.call(navigator.mediaDevices, constraints).then(async function(stream) {
      (logLevel <= 2) ? console.log('Custom handling of MediaStream:', stream): null;

      // Get video and audio tracks
      videoTrack = stream.getVideoTracks()[0];
      audioTrack = stream.getAudioTracks()[0];

      if (videoTrack && audioTrack)
        chrome.runtime.sendMessage(extensionId, { action: 'navigator.mediaDevices.getUserMedia', data: {audio: {muted: audioTrack.muted, enabled: audioTrack.enabled}, video: {muted: videoTrack.muted, enabled: videoTrack.enabled}} });
      else if (videoTrack)
        chrome.runtime.sendMessage(extensionId, { action: 'navigator.mediaDevices.getUserMedia', data: {audio: null, video: {muted: videoTrack.muted, enabled: videoTrack.enabled}} });
      else if (audioTrack)
        chrome.runtime.sendMessage(extensionId, { action: 'navigator.mediaDevices.getUserMedia', data: {audio: {muted: audioTrack.muted, enabled: audioTrack.enabled}, video: null} });


      // Define setter for enabled property on videoTrack and audioTrack
      Object.defineProperty(videoTrack, 'enabled', {
        set: function(value) {
          if (this.enabled !== value) {
            dispatchEnabledChangeEvent(this, value);
          }
          this._enabled = value;
        },
        get: function() {
          return this._enabled;
        }
      });

      Object.defineProperty(audioTrack, 'enabled', {
        set: function(value) {
          if (this.enabled !== value) {
            dispatchEnabledChangeEvent(this, value);
          }
          this._enabled = value;
        },
        get: function() {
          return this._enabled;
        }
      });

      // Add event listener for custom 'enabledchange' event
      videoTrack.addEventListener('enabledchange', function(event) {
        (logLevel <= 2) ? console.log(`Video Enabled state changed to: ${event.enabled}`) : null;
        if (event.enabled)
          chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'enabled'});
        else
          chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'disabled'});   
      });
      audioTrack.addEventListener('enabledchange', function(event) {
        (logLevel <= 2) ? console.log(`Audio Enabled state changed to: ${event.enabled}`) : null;
        if (event.enabled)
          chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'enabled'});
        else
          chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'disabled'});        
      });

      // Add event listeners for video track
      videoTrack.onmute = function(event) {
        (logLevel <= 2) ? console.log("Camera muted.") : null;
        chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'muted' });
      };
      videoTrack.onunmute = function(event) {
        (logLevel <= 2) ? console.log("Camera unmuted.") : null;
        chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'unmuted' });
      };
      videoTrack.onended = function(event) {
        (logLevel <= 2) ? console.log("Camera ended.") : null;
        chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'ended' });
      };

      // Add event listeners for audio track
      audioTrack.onmute = function(event) {
        (logLevel <= 2) ? console.log("Audio muted.") : null;
        chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'muted' });
      };
      audioTrack.onunmute = function(event) {
        (logLevel <= 2) ? console.log("Audio unmuted.") : null;
        chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'unmuted' });
      };
      audioTrack.onended = function(event) {
        (logLevel <= 2) ? console.log("Audio ended.") : null;
        chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'ended' });
      };

      (logLevel <= 2) ? console.log('Custom handling of MediaStream:', videoTrack) : null;
      return stream;
    })
    .catch(function(error) {
      console.error('Error accessing the camera:', error);
      throw error;
    });
  };    
}

function interceptCanvasFingerprint() {

  /*
    CANVAS CONTEXT

    document.createElement('canvas')
    document.getElementsByTagName('canva')
    HTMLCanvasElement.getContext(..)
    HTMLCanvasElement.toDataURL
    CanvasRenderingContext2D.rect(..)
    CanvasRenderingContext2D.isPointInPath(..)
    HTMLCanvasElement.width
    HTMLCanvasElement.height
    CanvasRenderingContext2D.textBaseline
    CanvasRenderingContext2D.fillStyle
    CanvasRenderingContext2D.fillRect
    CanvasRenderingContext2D.font
    CanvasRenderingContext2D.fillText
    CanvasRenderingContext2D.globalCompositeOperation
    CanvasRenderingContext2D.beginPath()
    CanvasRenderingContext2D.arc()
    CanvasRenderingContext2D.closePath()
    CanvasRenderingContext2D.fill()
  */

  const originalCreateElement = document.createElement;
  document.createElement = function(elem) {
    if (elem === "canvas") {
      fingerStatus.canvas.present = true;
      updateStatus("canvas");
    }
    return originalCreateElement.call(document, elem);
  };

  const originalGetElementsByTagName = document.getElementsByTagName;
  document.getElementsByTagName = function(elem) {
    if (elem === "canvas") {
      fingerStatus.canvas.present = true;
      updateStatus("canvas");  
    }
    return originalGetElementsByTagName.call(document, elem);
  };

  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(contextType, ...args) {
    fingerStatus.canvas.getContext = true;
    updateStatus("canvas");
    const context = originalGetContext.apply(this, [contextType, ...args]);
    return context;
  };

  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
    fingerStatus.canvas.toDataURL = true;
    updateStatus("canvas");
    const dataURL = originalToDataURL.apply(this, arguments);
    return dataURL;
  };

}

function interceptAudioFingerprint() {

  /*

    AUDIO CONTEXT

    window.OfflineAudioContext()
    window.webkitOfflineAudioContext()
    AudioContextObject.createOscillator()
    oscillatorNodeObject.type
    oscillatorNodeObject.frequency.value
    dynamicCompressorNodeObject.createDynamicsCompressor()
    dynamicCompressorNodeObject.threshold
    dynamicCompressorNodeObject.threshold.value
    dynamicCompressorNodeObject.knee
    dynamicCompressorNodeObject.knee.value
    dynamicCompressorNodeObject.ratio
    dynamicCompressorNodeObject.ratio.value
    dynamicCompressorNodeObject.reduction
    dynamicCompressorNodeObject.reduction.value
    dynamicCompressorNodeObject.attack
    dynamicCompressorNodeObject.attack.value
    dynamicCompressorNodeObject.release
    dynamicCompressorNodeObject.release.value
    oscillatorNodeObject.connect(dynamicCompressorNodeObject)
    dynamicCompressorNodeObject.connect(..)
    AudioContextObject.destination
    oscillatorNodeObject.start(..)
    AudioContextObject.startRendering(..)
    AudioContextObject.oncomplete(..)

      audioctx: {audioContext: false, createOscillator: false, 
      oscillator: {type: false, frequency: {value: false}},
       createDynamicsCompressor: false, destination: false, startRendering: false},

  */

  // Salva uma referência ao construtor original de AudioContext
  const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
  
  // Substitui o construtor AudioContext
  window.AudioContext = function() {
    // Cria uma nova instância do AudioContext
    const audioContext = new OriginalAudioContext();
    // update finger status for audioctx
    fingerStatus.audioctx.audioContext = true;
    updateStatus("audioctx");
    // Retorna a nova instância do AudioContext
    return audioContext;
  };
  
  // Save the original OfflineAudioContext constructor
  const OriginalOfflineAudioContext = window.OfflineAudioContext;

  // Override the OfflineAudioContext constructor
  window.OfflineAudioContext = function(numberOfChannels, length, sampleRate) {
    // Create a new instance of the original OfflineAudioContext
    const offlineAudioContext = new OriginalOfflineAudioContext(numberOfChannels, length, sampleRate);
    
    // Log the creation of OfflineAudioContext
    // update finger status for audioctx
    fingerStatus.audioctx.audioContext = true;
    updateStatus("audioctx");
    // Intercept the startRendering method of the new instance
    const originalStartRendering = offlineAudioContext.startRendering;
    offlineAudioContext.startRendering = function(...args) {
      (logLevel <= 2) ? console.log('Intercepted startRendering call') : null;
      (logLevel <= 2) ? console.log('Arguments:', args) : null;

      // update finger status for audioctx
      fingerStatus.audioctx.startRendering = true;
      updateStatus("audioctx");
      // Call the original method and handle the promise
      const result = originalStartRendering.apply(this, args);
      return result
        .then(res => {
          (logLevel <= 2) ? console.log('Rendering completed successfully') : null;
          return res;
        })
        .catch(err => {
          console.error('Rendering failed:', err);
          throw err;
        });
    };

    // Return the new instance
    return offlineAudioContext;
  };

  // Save a reference to the original createOscillator method
  const originalCreateOscillator = BaseAudioContext.prototype.createOscillator;

  // Override the createOscillator method
  BaseAudioContext.prototype.createOscillator = function() {
    // Log the usage of createOscillator
    (logLevel <= 2) ? console.log('BaseAudioContext.createOscillator() was called') : null;
    // send message
    // update finger status for audioctx
    fingerStatus.audioctx.createOscillator = true;
    updateStatus("audioctx");
    // Call the original method and return its result
    return originalCreateOscillator.apply(this, arguments);
  };

  // Salvar uma referência aos métodos getter originais
  const originalTypeSetter = Object.getOwnPropertyDescriptor(OscillatorNode.prototype, 'type').set;
  const originalFrequencySetter = Object.getOwnPropertyDescriptor(AudioParam.prototype, 'value').set;

  // Substituir o método getter para oscillatorNodeObject.type
  Object.defineProperty(OscillatorNode.prototype, 'type', {
    set: function(newValue) {
      // Registrar o acesso a oscillatorNodeObject.type
      (logLevel <= 2) ? console.log('Acesso a oscillatorNodeObject.type interceptado') : null;
      // update finger status for audioctx
      fingerStatus.audioctx.oscillator.type = true;
      updateStatus("audioctx");
      // Retornar o valor original
      return originalTypeSetter.call(this, newValue);
    }
  });

  // Substituir o método getter para oscillatorNodeObject.frequency.value
  Object.defineProperty(AudioParam.prototype, 'value', {
    set: function(newValue) {
      // Registrar o acesso a oscillatorNodeObject.frequency.value
      (logLevel <= 2) ? console.log('Acesso a oscillatorNodeObject.frequency.value interceptado') : null;
      // update finger status for audioctx
      fingerStatus.audioctx.oscillator.frequency.value = true;
      updateStatus("audioctx");
      // Retornar o valor original
      return originalFrequencySetter.call(this, newValue);
    }
  });


  // Save a reference to the original createDynamicsCompressor method
  const originalCreateDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;

  // Override the createDynamicsCompressor method
  AudioContext.prototype.createDynamicsCompressor = function() {
    // Log the creation of a DynamicsCompressorNode object
    (logLevel <= 2) ? console.log('DynamicsCompressorNode object was created') : null;
    // update finger status for audioctx
    fingerStatus.audioctx.createDynamicsCompressor = true;
    updateStatus("audioctx");
    // Call the original method and return its result
    return originalCreateDynamicsCompressor.apply(this, arguments);
  };

  // Save a reference to the original constructor of DynamicsCompressorNode
  const OriginalDynamicsCompressorNode = window.DynamicsCompressorNode;

  // Override the constructor of DynamicsCompressorNode
  window.DynamicsCompressorNode = function() {
    // Create a new instance of DynamicsCompressorNode
    const dynamicsCompressorNode = new OriginalDynamicsCompressorNode();
    // Define setter methods for the properties you want to monitor
    Object.defineProperty(dynamicsCompressorNode.threshold, 'value', {
      set: function(newValue) {
        // Log the change to threshold value
        (logLevel <= 2) ? console.log('Threshold value changed to:', newValue) : null;
          // update finger status for audioctx
          fingerStatus.audioctx.dynamicsCompressorNode.threshold = true;
          updateStatus("audioctx");
          // Set the new value
        dynamicsCompressorNode.threshold.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.knee, 'value', {
      set: function(newValue) {
        // Log the change to knee value
        (logLevel <= 2) ? console.log('Knee value changed to:', newValue) : null;
        // update finger status for audioctx
        fingerStatus.audioctx.dynamicsCompressorNode.knee = true;
        updateStatus("audioctx");
        // Set the new value
        dynamicsCompressorNode.knee.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.ratio, 'value', {
      set: function(newValue) {
        // Log the change to ratio value
        (logLevel <= 2) ? console.log('Ratio value changed to:', newValue) : null;
        // update finger status for audioctx
        fingerStatus.audioctx.dynamicsCompressorNode.ratio = true;
        updateStatus("audioctx");
        // Set the new value
        dynamicsCompressorNode.ratio.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.reduction, 'value', {
      set: function(newValue) {
        // Log the change to reduction value
        (logLevel <= 2) ? console.log('Reduction value changed to:', newValue) : null;
        // update finger status for audioctx
        fingerStatus.audioctx.dynamicsCompressorNode.reduction = true;
        updateStatus("audioctx");
        // Set the new value
        dynamicsCompressorNode.reduction.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.attack, 'value', {
      set: function(newValue) {
        // Log the change to attack value
        (logLevel <= 2) ? console.log('Attack value changed to:', newValue) : null;
        // update finger status for audioctx
        fingerStatus.audioctx.dynamicsCompressorNode.attack = true;
        updateStatus("audioctx");
        // Set the new value
        dynamicsCompressorNode.attack.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.release, 'value', {
      set: function(newValue) {
        // Log the change to release value
        (logLevel <= 2) ? console.log('Release value changed to:', newValue) : null;
        // update finger status for audioctx
        fingerStatus.audioctx.dynamicsCompressorNode.release = true;
        updateStatus("audioctx");
        // Set the new value
        dynamicsCompressorNode.release.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    // Return the new instance of DynamicsCompressorNode
    return dynamicsCompressorNode;
  };

  // Save a reference to the original connect method
  const originalConnect = OscillatorNode.prototype.connect;
  // Override the connect method
  OscillatorNode.prototype.connect = function(destination, output, input) {
    // Log the usage of connect
    (logLevel <= 2) ? console.log('OscillatorNode.connect() was called'): null;
    // update finger status for audioctx
    fingerStatus.audioctx.dynamicsCompressorNode.connect = true;
    updateStatus("audioctx");// Call the original method with the provided arguments
    return originalConnect.call(this, destination, output, input);
  };


  // Save a reference to the original connect method
  const originalDynamicsCompressorConnect = DynamicsCompressorNode.prototype.connect;

  // Override the connect method
  DynamicsCompressorNode.prototype.connect = function(destination, output, input) {
    // Log the usage of connect
    (logLevel <= 2) ? console.log('DynamicsCompressorNode.connect() was called') : null;
    // update finger status for audioctx
    fingerStatus.audioctx.dynamicsCompressorNode.connect = true;
    updateStatus("audioctx");
    // Call the original method with the provided arguments
    return originalDynamicsCompressorConnect.call(this, destination, output, input);
  };

  // Save the original destination property
  const originalDestinationSetter = Object.getOwnPropertyDescriptor(BaseAudioContext.prototype, 'destination');

  Object.defineProperty(BaseAudioContext.prototype, 'destination', {
    get: function() {
      // Log the access to destination
      (logLevel <= 2) ? console.log('Access to AudioContext.destination intercepted') : null;
      // update finger status for audioctx
      fingerStatus.audioctx.destination = true;
      updateStatus("audioctx");// Return the original destination
      return originalDestinationSetter.get.call(this);
    }
  });

  // Override the destination property with a custom one
  // Save a reference to the original start method of OscillatorNode
  const originalStart = OscillatorNode.prototype.start;
  OscillatorNode.prototype.start = function() {
    // Log the usage of start
    (logLevel <= 2) ? console.log('OscillatorNode.start() was called') : null;
    // update finger status for audioctx
    fingerStatus.audioctx.oscillator.start = true;
    updateStatus("audioctx");
    // Call the original method with the provided arguments
    return originalStart.apply(this, arguments);
  };

}

function interceptScreenFingerprint() {

  /*
  Description: Intercepting reads of screen properties can be quite challenging because JavaScript does not provide direct hooks or interception mechanisms 
  for property reads. However, you can achieve this by using a technique called property getters.
  In JavaScript, you can define a special kind of method called a getter that is invoked when a specific property is accessed.
  By defining getters for screen properties, you can intercept and log any reads of those properties.
  */


  function interceptPropertyAccess(obj, property) {
    // Save original screen property values
    const originalDescriptor = obj[property];
    
    // Overriding getters for screen width and height
    Object.defineProperty(obj, property, {
      get: function() {
        // Register access at screen height
        (logLevel <= 2) ? console.log(`Acesso à ${property} do monitor interceptado`) : null;
        // update finger status for screen
        fingerStatus.screen.width = true;
        updateStatus("screen");
        // Return the original value
        return originalDescriptor;
      }
    });
  }

  for (const property of ['width', 'height','colorDepth', 'pixelDepth', 'availWidth', 'availHeight']) {
    interceptPropertyAccess(window.screen, property)
  }

  for (const property of ['innerHeight', 'innerWidth', 'outerHeight', 'outerWidth', 'screenX', 'screenY', 'scrollX',
     'scrollY', 'pageXOffset', 'pageYoffset', 'devicePixelRatio']) {
    interceptPropertyAccess(window, property)
  }
}

function interceptTimezoneFingerprint() {

  /*

    JavaScript

    timezone

  */

  // Save the original getTimezoneOffset method
  const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;

  // Override the getTimezoneOffset method
  Date.prototype.getTimezoneOffset = function() {
    // Log the access to getTimezoneOffset
    (logLevel <= 2) ? console.log('Access to Date.prototype.getTimezoneOffset intercepted') : null;
    // update finger status for timezone
    fingerStatus.timezone = true;
    updateStatus("timezone");
    // Call the original method and return its result
    return originalGetTimezoneOffset.call(this);
  };

}

function interceptHardwareConcurrency() {
  // Salvar o valor original de Navigator.hardwareConcurrency
  const originalHardwareConcurrency = navigator.hardwareConcurrency;

  // Substituir o getter para Navigator.hardwareConcurrency
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    get: function() {
      // Registrar o acesso ao hardwareConcurrency
      (logLevel <= 2) ? console.log('Acesso a Navigator.hardwareConcurrency interceptado') : null;
      // update finger status for hardware concurrency
      fingerStatus.hardwareConcurrency = true;
      updateStatus("hardwareConcurrency");
      // Retornar o valor original
      return originalHardwareConcurrency;
    }
  });

}

function interceptMaxTouchPoints() {
  // Salvar o valor original de navigator.maxTouchPoints
  const originalMaxTouchPoints = navigator.maxTouchPoints;

  // Substituir o getter para navigator.maxTouchPoints
  Object.defineProperty(navigator, 'maxTouchPoints', {
    get: function() {
      // Registrar o acesso a maxTouchPoints
      (logLevel <= 2) ? console.log('Acesso a navigator.maxTouchPoints interceptado') : null;
      // update finger status for screen
      fingerStatus.maxTouchPoints.present = true;
      updateStatus("maxTouchPoints");
      // Retornar o valor original
      return originalMaxTouchPoints;
    }
  });
}

function interceptPluginEnumerationFingerprint() {

  // ***WAR-Based Extension Enumeration***
  // Step 1: Save the original fetch method
  const originalFetch = window.fetch;

  // Step 2: Override the fetch method
  window.fetch = function(input, init) {
      // Convert input to a URL object for easier manipulation
      let url;
      (logLevel <= 2) ? console.log(input) : null;
      if (input[0] === '/')
         url = typeof input === 'string' ? new URL(document.location.origin + input) : input instanceof Request ? new URL(input.url) : input;
      else
         url = typeof input === 'string' ? new URL(input) : input instanceof Request ? new URL(input.url) : input;

        (logLevel <= 2) ? console.log(url.protocol) : null;
      // Check if the URL starts with 'chrome://'
      if (url.protocol === 'chrome:' || url.protocol === 'chrome-extension:') {
          (logLevel <= 2) ? console.log('Intercepted fetch for chrome:// protocol:', url.href) : null;
          // update finger status for plugin enumeration
          fingerStatus.pluginEnumeration.window.fetch = true;
          updateStatus("pluginEnumeration");  
        }

      // Call the original fetch method for other URLs
      return originalFetch.apply(this, arguments);
  };

  const originalOnMessageDescriptor = Object.getOwnPropertyDescriptor(window, 'onmessage');

  // Step 2: Define a custom setter for window.onmessage
  Object.defineProperty(window, 'onmessage', {
      set: function(newHandler) {
          (logLevel <= 2) ? console.log('window.onmessage was set:', newHandler) : null;
  
          // update finger status for plugin enumeration
          fingerStatus.pluginEnumeration.window.onmessage = true;
          updateStatus("pluginEnumeration");

          // Call the original setter if it exists, or directly set the handler
          if (originalOnMessageDescriptor && originalOnMessageDescriptor.set) {
              originalOnMessageDescriptor.set.call(window, newHandler);
          } else {
              // Directly set the value if no original setter exists
              originalOnMessageDescriptor.value = newHandler;
          }
      },
      get: function() {
          // Return the original value if it exists, or null if not
          return originalOnMessageDescriptor ? originalOnMessageDescriptor.value : null;
      },
      configurable: true
  });
  
  // ***Inter-communication Extension-Based Enumeration***
  // Step 1: Save the original method
  const originalGetEntriesByType = performance.getEntriesByType;

  // Step 2: Override the method
  performance.getEntriesByType = function(type) {
      // Call the original method
      const entries = originalGetEntriesByType.call(performance, type);

      // Intercept and process the entries if the type is "resource"
      if (type === "resource") {

          // update finger status for plugin enumeration
          fingerStatus.pluginEnumeration.performance.getEntriesByType = true;
          updateStatus("pluginEnumeration");  
      }

      // Return the (possibly modified) entries
      return entries;
  };

}

function interceptCacheFingerprint() {

  /*
    CACHE BASED SIDE-CHANNELS

    // mandatory
    performance.now()


    TypedArrayObject
    TypedArray.from()
    TypedArray.of()
    IntArrayObject
    IntArray8Object
    Uint8ClampedArray
    Int16Array
    Uint16Array
    Int32Array
    Uint32Array
    Float32Array
    Float64Array
    BigInt64Array
    BigUint64Array

  */

  // Save the original performance.now method
  const originalPerformanceNow = performance.now;
  // Override the performance.now method
  performance.now = function() {
    // Log the invocation of performance.now
    (logLevel <= 2) ? console.log('performance.now() was called') : null;

    // update finger status for cache
    fingerStatus.cache.performance.now = true;
    updateStatus("cache");  
    // Call the original method and return its result
    return originalPerformanceNow.apply(performance, arguments);
  };

  // Define a list of TypedArray constructors
  const typedArrayConstructors = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array
  ];

  // Iterate over each TypedArray constructor and intercept its static methods
  typedArrayConstructors.forEach(constructor => {

    // Salva o construtor original
    const originalConstructor = constructor;

    // Substitui o construtor
    window[constructor.name] = function() {
      // Loga a inicialização do TypedArray
      (logLevel <= 2) ? console.log(`${constructor.name} was initialized`) : null;
      // update finger status for typed Array Constructors
      fingerStatus.typedArrayConstructors = true;
      updateStatus("cache"); 
      // Chama o construtor original com os argumentos fornecidos
      return new originalConstructor(...arguments);
    };

  });

}

function interceptAnimationFingerprint() {
  // Salva a função original requestAnimationFrame
  const originalRequestAnimationFrame = window.requestAnimationFrame;

  // Substitui requestAnimationFrame
  window.requestAnimationFrame = function(callback) {
    // Registra a invocação de requestAnimationFrame
    (logLevel <= 2) ? console.log('requestAnimationFrame was called') : null;
    // update finger status for cache
    fingerStatus.animation.window.requestAnimationFrame = true;
    updateStatus("animation"); 
    // Chama a função original com o callback fornecido
    return originalRequestAnimationFrame(callback);
  };
}

function interceptBatteryFingerprint() {
  /*
    navigator.getBattery(): Accesses battery status, which can reveal information about the device.
    Properties: charging (boolean), chargingTime, dischargingTime, level
  */

  // Helper function to intercept properties
  function interceptProperty(proto, prop) {
    let descriptor = Object.getOwnPropertyDescriptor(proto, prop);
    let originalGetter = descriptor ? descriptor.get : null;
    let originalSetter = descriptor ? descriptor.set : null;
    let value;

    Object.defineProperty(proto, prop, {
      get() {
        // update finger status for battery
        fingerStatus.battery[prop] = true;
        updateStatus("battery"); 

        // Call the original getter if exists, otherwise use stored value
        if (originalGetter) {
          let originalValue = originalGetter.call(this);
          (logLevel <= 2) ? console.log(`${prop} accessed: `, originalValue) : null;
          return originalValue;
        } else {
          (logLevel <= 2) ? console.log(`${prop} accessed: `, value) : null;
          return value;
        }
      },
      set(newValue) {
        // Log the change and call original setter or store new value
        (logLevel <= 2) ? console.log(`${prop} changed to: `, newValue) : null;
        if (originalSetter) {
          originalSetter.call(this, newValue);
        } else {
          value = newValue;
        }
      },
      configurable: true,
      enumerable: true
    });
  }

  // Check if navigator.getBattery() is available and intercept its properties
  if (navigator.getBattery) {
    navigator.getBattery().then(function(battery) {
      const batteryProperties = ['charging', 'chargingTime', 'dischargingTime', 'level'];

      for (let prop of batteryProperties) {
        interceptProperty(Object.getPrototypeOf(battery), prop);
      }
    }).catch(function(error) {
      console.error('Error accessing battery:', error);
    });
  } else {
    console.warn('navigator.getBattery() not supported or available.');
  }
}

(function () {
  interceptUserMedia();
  interceptFontMetrics_AND_FontEnumeration();
  interceptCanvasFingerprint();
  interceptAudioFingerprint();
  interceptScreenFingerprint();
  interceptTimezoneFingerprint();
  interceptHardwareConcurrency();
  interceptMaxTouchPoints();
  interceptPluginEnumerationFingerprint();
  interceptCacheFingerprint();
  interceptAnimationFingerprint();
  interceptBatteryFingerprint();
})();

