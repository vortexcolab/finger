console.log("Entraste no main.js ");
// The ID of the extension we want to talk to.
const extensionId = "ikmmgeeobocffhlighopbganadpmmeee";

let videoTrack, audioTrack, trackAudioProxy, trackVideoProxy;


// Create a function to dispatch custom events
function dispatchEnabledChangeEvent(track, enabled) {
  const event = new Event('enabledchange');
  event.enabled = enabled;
  track.dispatchEvent(event);
}

// Capture function calls
function interceptUserMedia() {

  // Save the original getUserMedia method
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  // Override getUserMedia method
  navigator.mediaDevices.getUserMedia = async function(constraints) {
    console.log('Custom code executed in getUserMedia');

    // Call the original getUserMedia method with the provided constraints
    return originalGetUserMedia.call(navigator.mediaDevices, constraints).then(async function(stream) {
      console.log('Custom handling of MediaStream:', stream);

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
        console.log(`Video Enabled state changed to: ${event.enabled}`);
        if (event.enabled)
          chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'enabled'});
        else
          chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'disabled'});   
      });
      audioTrack.addEventListener('enabledchange', function(event) {
        console.log(`Audio Enabled state changed to: ${event.enabled}`);
        if (event.enabled)
          chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'enabled'});
        else
          chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'disabled'});        
      });

      // Add event listeners for video track
      videoTrack.onmute = function(event) {
        console.log("Camera muted.");
        chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'muted' });
      };
      videoTrack.onunmute = function(event) {
        console.log("Camera unmuted.");
        chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'unmuted' });
      };
      videoTrack.onended = function(event) {
        console.log("Camera ended.");
        chrome.runtime.sendMessage(extensionId, { action: 'camera', data: 'ended' });
      };

      // Add event listeners for audio track
      audioTrack.onmute = function(event) {
        console.log("Audio muted.");
        chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'muted' });
      };
      audioTrack.onunmute = function(event) {
        console.log("Audio unmuted.");
        chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'unmuted' });
      };
      audioTrack.onended = function(event) {
        console.log("Audio ended.");
        chrome.runtime.sendMessage(extensionId, { action: 'microphone', data: 'ended' });
      };

      console.log('Custom handling of MediaStream:', videoTrack);
      return stream;
    })
    .catch(function(error) {
      console.error('Error accessing the camera:', error);
      throw error;
    });
  };    
}

function interceptFontMetrics_AND_FontEnumeration() {

  /*
    FONT METRICS

    Access to:

    // mandatory
    HTMLELEMENT.fontFamily
    HTMLELEMENT.offsetWidth
    HTMLELEMENT.offsetHeight

    3. Methods
     - Proxy Object
     - Method override
     - MutationObservers

  */


      // Intercept getBoundingClientRect
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function() {
    console.log('getBoundingClientRect intercepted for element:', this);
    chrome.runtime.sendMessage(extensionId, { action: 'font-metrics', data: 'getBoundingClientRect' });
    return originalGetBoundingClientRect.apply(this, arguments);
  };

  // Intercept getComputedStyle
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function(element, pseudoElt) {
    console.log('getComputedStyle intercepted for element:', element);
    chrome.runtime.sendMessage(extensionId, { action: 'font-metrics', data: 'getComputedStyle' });
    return originalGetComputedStyle.apply(this, arguments);
  };

  // Utility function to intercept property access
  function interceptPropertyAccess(obj, property) {
    const originalDescriptor = Object.getOwnPropertyDescriptor(obj, property);
    Object.defineProperty(obj, property, {
      get: function() {
        console.log(`${property} intercepted for element:`, this);
        if (['offsetWidth', 'offsetHeight'].includes(property)) {
          chrome.runtime.sendMessage(extensionId, { action: 'font-enumeration', data: property });
          chrome.runtime.sendMessage(extensionId, { action: 'font-metrics', data: property });
          return originalDescriptor.get.apply(this);
        } else if (!['textContent'].includes(property)) {
          console.log("PROPERTY", property)
          chrome.runtime.sendMessage(extensionId, { action: 'font-metrics', data: property });
          return originalDescriptor.get.apply(this);
        }
      },
      set: function(newValue) {
        if (['textContent'].includes(property)) {
          chrome.runtime.sendMessage(extensionId, { action: 'font-enumeration', data: property });
          return originalDescriptor.set.apply(this, [newValue]);
        }
      },
      configurable: true,
      enumerable: true
    });
  }

  // Intercept offsetWidth, offsetHeight, scrollWidth, scrollHeight
  interceptPropertyAccess(HTMLElement.prototype, 'offsetWidth');
  interceptPropertyAccess(HTMLElement.prototype, 'offsetHeight');
  interceptPropertyAccess(HTMLElement.prototype, 'scrollWidth');
  interceptPropertyAccess(HTMLElement.prototype, 'scrollHeight');
  interceptPropertyAccess(Node.prototype, 'textContent');

  /*

    Font Enumeration
    # based on: https://github.com/fingerprintjs/fingerprintjs/blob/master/src/sources/fonts.ts#L123

    Detect more than 10 hits in the follow procedure

    HTMLElement.style.position
    HTMLElement.style.top
    HTMLElement.style.left
    HTMLElement.style.fontFamily
    HTMLElement.style.textContent

  */

  // Override the style attribute setter to intercept direct style changes
  (function() {
    // Save the original style descriptor
    const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style');
  
    // Create a proxy handler for the style object
    const styleProxyHandler = {
      get(target, prop, receiver) {
        console.log(`Accessing style.${prop}`);
        if (['position', 'top', 'left', 'fontFamily'].includes(prop))
          chrome.runtime.sendMessage(extensionId, { action: 'font-enumeration', data: prop });
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        console.log(`Setting style.${prop} to ${value}`);
        if (['position', 'top', 'left', 'fontFamily'].includes(prop))
          chrome.runtime.sendMessage(extensionId, { action: 'font-enumeration', data: prop });
        return Reflect.set(target, prop, value, receiver);
      }
    };
  
    // Define a new style property with a proxy on HTMLElement's prototype
    Object.defineProperty(HTMLElement.prototype, 'style', {
      get() {
        return new Proxy(originalDescriptor.get.call(this), styleProxyHandler);
      },
      configurable: true,
      enumerable: true
    });
  })();
  
  // Canvas font enumeration
  // Intercept the 'font' property
  const originalFontDescriptor = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'font');
  
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'font', {
    get() {
      console.log('Accessing CanvasRenderingContext2D.font');
      chrome.runtime.sendMessage(extensionId, { action: 'font-enumeration', data: 'canvasContext.font' });
      return originalFontDescriptor.get.call(this);
    },
    set(value) {
      console.log('Setting CanvasRenderingContext2D.font to', value);
      chrome.runtime.sendMessage(extensionId, { action: 'font-enumeration', data: 'canvasContext.font' });
      originalFontDescriptor.set.call(this, value);
    },
    configurable: true,
    enumerable: true
  });

  // Intercept the 'measureText' method
  const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;

  CanvasRenderingContext2D.prototype.measureText = function(...args) {
    console.log('Calling CanvasRenderingContext2D.measureText with arguments:', args);
    chrome.runtime.sendMessage(extensionId, { action: 'font-enumeration', data: 'canvasContext.measureText' });
    const result = originalMeasureText.apply(this, args);
    console.log('measureText result:', result);
    return result;
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
      chrome.runtime.sendMessage(extensionId, { action: 'canvas', data: 'document.createElement' });
    }
    return originalCreateElement.call(document, elem);
  };

  const originalGetElementsByTagName = document.getElementsByTagName;
  document.getElementsByTagName = function(elem) {
    if (elem === "canvas") {
      chrome.runtime.sendMessage(extensionId, { action: 'canvas', data: 'document.getElementsByTagName' });
    }
    return originalGetElementsByTagName.call(document, elem);
  };


  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(contextType, ...args) {
    chrome.runtime.sendMessage(extensionId, { action: 'canvas', data: 'HTMLCanvasElement.getContext' });
    const context = originalGetContext.apply(this, [contextType, ...args]);
    return context;
  };


  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
    chrome.runtime.sendMessage(extensionId, { action: 'canvas', data: 'HTMLCanvasElement.toDataURL' });
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

  */

  // Salva uma referência ao construtor original de AudioContext
  const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
  
  // Substitui o construtor AudioContext
  window.AudioContext = function() {
    // Cria uma nova instância do AudioContext
    const audioContext = new OriginalAudioContext();
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'window.AudioContext' });
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
    console.log('OfflineAudioContext was created');
    chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'window.OfflineAudioContext' });

    // Intercept the startRendering method of the new instance
    const originalStartRendering = offlineAudioContext.startRendering;
    offlineAudioContext.startRendering = function(...args) {
      console.log('Intercepted startRendering call');
      console.log('Arguments:', args);

      // Optionally send a message or log
      chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'AudioContext.startRendering' });

      // Call the original method and handle the promise
      const result = originalStartRendering.apply(this, args);
      return result
        .then(res => {
          console.log('Rendering completed successfully');
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
    console.log('BaseAudioContext.createOscillator() was called');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'BaseAudioContext.createOscillator' });
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
      console.log('Acesso a oscillatorNodeObject.type interceptado');
      // Enviar mensagem
      chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'oscillatorNodeObject.type' });
      // Retornar o valor original
      return originalTypeSetter.call(this, newValue);
    }
  });

  // Substituir o método getter para oscillatorNodeObject.frequency.value
  Object.defineProperty(AudioParam.prototype, 'value', {
    set: function(newValue) {
      // Registrar o acesso a oscillatorNodeObject.frequency.value
      console.log('Acesso a oscillatorNodeObject.frequency.value interceptado');
      // Enviar mensagem
      chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'oscillatorNodeObject.frequency.value' });
      // Retornar o valor original
      return originalFrequencySetter.call(this, newValue);
    }
  });


  // Save a reference to the original createDynamicsCompressor method
  const originalCreateDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;

  // Override the createDynamicsCompressor method
  AudioContext.prototype.createDynamicsCompressor = function() {
    // Log the creation of a DynamicsCompressorNode object
    console.log('DynamicsCompressorNode object was created');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'DynamicsCompressorNode' });
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
        console.log('Threshold value changed to:', newValue);
        // send message
        chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'DynamicsCompressorNode.threshold.value' });
        // Set the new value
        dynamicsCompressorNode.threshold.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.knee, 'value', {
      set: function(newValue) {
        // Log the change to knee value
        console.log('Knee value changed to:', newValue);
        // send message
        chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'DynamicsCompressorNode.knee.value' });
        // Set the new value
        dynamicsCompressorNode.knee.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.ratio, 'value', {
      set: function(newValue) {
        // Log the change to ratio value
        console.log('Ratio value changed to:', newValue);
        // send message
        chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'DynamicsCompressorNode.ratio.value' });
        // Set the new value
        dynamicsCompressorNode.ratio.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.reduction, 'value', {
      set: function(newValue) {
        // Log the change to reduction value
        console.log('Reduction value changed to:', newValue);
        // send message
        chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'DynamicsCompressorNode.reduction.value' });
        // Set the new value
        dynamicsCompressorNode.reduction.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.attack, 'value', {
      set: function(newValue) {
        // Log the change to attack value
        console.log('Attack value changed to:', newValue);
        // send message
        chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'DynamicsCompressorNode.attack.value' });
        // Set the new value
        dynamicsCompressorNode.attack.setValueAtTime(newValue, this.context.currentTime);
      }
    });

    Object.defineProperty(dynamicsCompressorNode.release, 'value', {
      set: function(newValue) {
        // Log the change to release value
        console.log('Release value changed to:', newValue);
        // send message
        chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'DynamicsCompressorNode.release.value' });
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
    console.log('OscillatorNode.connect() was called');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'OscillatorNode.connect' });
    // Call the original method with the provided arguments
    return originalConnect.call(this, destination, output, input);
  };


  // Save a reference to the original connect method
  const originalDynamicsCompressorConnect = DynamicsCompressorNode.prototype.connect;

  // Override the connect method
  DynamicsCompressorNode.prototype.connect = function(destination, output, input) {
    // Log the usage of connect
    console.log('DynamicsCompressorNode.connect() was called');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'DynamicsCompressorNode.connect' });
    // Call the original method with the provided arguments
    return originalDynamicsCompressorConnect.call(this, destination, output, input);
  };

  // Save the original destination property
  const originalDestinationSetter = Object.getOwnPropertyDescriptor(BaseAudioContext.prototype, 'destination');

  Object.defineProperty(BaseAudioContext.prototype, 'destination', {
    get: function() {
      // Log the access to destination
      console.log('Access to AudioContext.destination intercepted');
      // Send message
      chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'AudioContext.destination' });
      // Return the original destination
      return originalDestinationSetter.get.call(this);
    }
  });

  // Override the destination property with a custom one
  // Save a reference to the original start method of OscillatorNode
  const originalStart = OscillatorNode.prototype.start;
  OscillatorNode.prototype.start = function() {
    // Log the usage of start
    console.log('OscillatorNode.start() was called');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'OscillatorNode.start' });
    // Call the original method with the provided arguments
    return originalStart.apply(this, arguments);
  };


  // Save a reference to the original oncomplete method of AudioContext
  const originalOnComplete = AudioContext.prototype.oncomplete;
  // Override the start method of OscillatorNode
  // Override the oncomplete method of AudioContext
  AudioContext.prototype.oncomplete = function() {
    // Log the usage of oncomplete
    console.log('AudioContext.oncomplete() was called');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'audioctx', data: 'AudioContext.oncomplete()' });
    // Call the original method with the provided arguments
    return originalOnComplete.apply(this, arguments);
  };

}


function interceptScreenFingerprint() {

  /*

    JavaScript

    screen resolution
    screen.orientation: Provides information about the screen orientation, revealing device posture.

  */

  /*
  Intercepting reads of screen properties can be quite challenging because JavaScript does not provide direct hooks or interception mechanisms 
  for property reads. However, you can achieve this by using a technique called property getters.
  In JavaScript, you can define a special kind of method called a getter that is invoked when a specific property is accessed.
  By defining getters for screen properties, you can intercept and log any reads of those properties.
  */

  // Salvar os valores originais das propriedades da tela
  const originalScreenWidth = window.screen.width;
  const originalScreenHeight = window.screen.height;

  // Substituir os getters para a largura e altura da tela
  Object.defineProperty(window.screen, 'width', {
    get: function() {
      // Registrar o acesso à largura da tela
      console.log('Acesso à largura da tela interceptado');
      // Enviar mensagem
      chrome.runtime.sendMessage(extensionId, { action: 'screen', data: 'width' });
      // Retornar o valor original
      return originalScreenWidth;
    }
  });

  Object.defineProperty(window.screen, 'height', {
    get: function() {
      // Registrar o acesso à altura da tela
      console.log('Acesso à altura da tela interceptado');
      // Enviar mensagem
      chrome.runtime.sendMessage(extensionId, { action: 'screen', data: 'height' });
      // Retornar o valor original
      return originalScreenHeight;
    }
  });


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
    console.log('Access to Date.prototype.getTimezoneOffset intercepted');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'timezone', data: '1' });
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
      console.log('Acesso a Navigator.hardwareConcurrency interceptado');
      // Enviar mensagem
      chrome.runtime.sendMessage(extensionId, { action: 'hardwareConcurrency', data: '1' });
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
      console.log('Acesso a navigator.maxTouchPoints interceptado');
      // Enviar mensagem
      chrome.runtime.sendMessage(extensionId, { action: 'maxTouchPoints', data: '1' });
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
      console.log(input);
      if (input[0] === '/')
         url = typeof input === 'string' ? new URL(document.location.origin + input) : input instanceof Request ? new URL(input.url) : input;
      else
         url = typeof input === 'string' ? new URL(input) : input instanceof Request ? new URL(input.url) : input;

        console.log(url.protocol)
      // Check if the URL starts with 'chrome://'
      if (url.protocol === 'chrome:' || url.protocol === 'chrome-extension:') {
          console.log('Intercepted fetch for chrome:// protocol:', url.href);
          chrome.runtime.sendMessage(extensionId, { action: 'plugin-enumeration', data: "window.fetch" });
      }

      // Call the original fetch method for other URLs
      return originalFetch.apply(this, arguments);
  };

  const originalOnMessageDescriptor = Object.getOwnPropertyDescriptor(window, 'onmessage');

  // Step 2: Define a custom setter for window.onmessage
  Object.defineProperty(window, 'onmessage', {
      set: function(newHandler) {
          console.log('window.onmessage was set:', newHandler);
  
          chrome.runtime.sendMessage(extensionId, { action: 'plugin-enumeration', data: "window.onmessage" });
  
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

        chrome.runtime.sendMessage(extensionId, { action: 'plugin-enumeration', data: "performance.getEntriesByType" });

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
    console.log('performance.now() was called');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'cache', data: 'performance.now' });
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
      console.log(`${constructor.name} was initialized`);
      // send message
      chrome.runtime.sendMessage(extensionId, { action: 'cache', data: constructor.name });
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
    console.log('requestAnimationFrame was called');
    // send message
    chrome.runtime.sendMessage(extensionId, { action: 'animation', data: 'window.requestAnimationFrame' });
    // Chama a função original com o callback fornecido
    return originalRequestAnimationFrame(callback);
  };
}


function interceptPersistentTracking() {

  /*
    window.localStorage: Stores data that persists across sessions, which can be used to track user activity over time
    indexedDB: Provides a mechanism for storing large amounts of structured data. Usage patterns can be fingerprinted.

  */

}

function interceptGeoLocationReading(){
  /*
    navigator.geolocation: Accesses the device’s location, providing information about the user’s physical location.
  */

    
}

function interceptCookieTraveling(){
  /*
    new XMLHttpRequest(): Used for making HTTP requests. The behavior of these requests can reveal information about the browser
    *inspect if data is cookie like
    fetch('https://example.com/data'): Another method for making HTTP requests, often revealing network and browser configurations.
  */
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
        // Log the access and send message to extension
        chrome.runtime.sendMessage(extensionId, { action: 'battery', data: prop });

        // Call the original getter if exists, otherwise use stored value
        if (originalGetter) {
          let originalValue = originalGetter.call(this);
          console.log(`${prop} accessed: `, originalValue);
          return originalValue;
        } else {
          console.log(`${prop} accessed: `, value);
          return value;
        }
      },
      set(newValue) {
        // Log the change and call original setter or store new value
        console.log(`${prop} changed to: `, newValue);
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

function interceptNetworkConnectionInformation() {
  /*
    navigator.connection: Provides information about the network connection, revealing network type and speed.

  */
}


/*

 new Worker('worker.js'): Web workers can execute JavaScript in the background. Differences in worker behavior can be fingerprinted.
 ?????
 navigator.serviceWorker: Controls network requests and cache management, revealing browser capabilities.
 new FileReader(): Reads the contents of files, revealing file handling capabilities and behaviors.
 ???? onde foste buscar esta ideia?????
 Notification: Manages notifications, providing insights into browser capabilities and user preferences.
 window.history: Accesses the browser’s session history, which can be used to infer browsing habits.
 performance.timing: Provides timing information about navigation and page load, revealing performance characteristics.
 new PaymentRequest(supportedInstruments, details): Initiates a payment request, providing insights into supported payment methods.
 navigator.clipboard: Accesses the clipboard, revealing interaction capabilities.
 navigator.permissions: Manages permissions, revealing granted and denied permissions for various APIs.

 navigator.getGamepads().length: Accesses connected gamepads, revealing connected input devices.
 new AmbientLightSensor(): Accesses ambient light sensor data, revealing environmental conditions.
 navigator.getGamepads(): Accesses connected gamepads, revealing connected input devices.
document.fullscreenElement: Manages fullscreen state, revealing interaction capabilities.
navigator.clipboard: Accesses the clipboard, revealing interaction capabilities.

*/

function interceptWebRTC(){
  // Backup the original RTCPeerConnection
  const OriginalRTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

  if (!OriginalRTCPeerConnection) {
      console.error('WebRTC is not supported in this browser');
      return;
  }

  // Override the RTCPeerConnection
  const ModifiedRTCPeerConnection = function(config) {
      const pc = new OriginalRTCPeerConnection(config);

      // Intercept addIceCandidate
      const originalAddIceCandidate = pc.addIceCandidate.bind(pc);
      pc.addIceCandidate = function(candidate) {
          if (candidate && candidate.candidate) {
              // Log the candidate information
              console.log('Intercepted ICE Candidate:', candidate.candidate);

              // Extract IP or mDNS address
              const ipRegex = /(\d{1,3}\.){3}\d{1,3}/;
              const mDNSRegex = /[a-zA-Z0-9.-]+\.local/;
              const ipMatch = candidate.candidate.match(ipRegex);
              const mDNSMatch = candidate.candidate.match(mDNSRegex);

              if (ipMatch) {
                  console.log('Extracted IP Address:', ipMatch[0]);
              } else if (mDNSMatch) {
                  console.log('Extracted mDNS Address:', mDNSMatch[0]);
              }
          }
          return originalAddIceCandidate(candidate);
      };

      return pc;
  };

  // Apply the modified RTCPeerConnection to the window
  window.RTCPeerConnection = ModifiedRTCPeerConnection;
  window.webkitRTCPeerConnection = ModifiedRTCPeerConnection;
  window.mozRTCPeerConnection = ModifiedRTCPeerConnection;
}

function init() {
  //interceptWebRTC();
  interceptUserMedia();   // NOT considered FINGERPRINT
  interceptFontMetrics_AND_FontEnumeration();   // Covered
  interceptCanvasFingerprint();   // Covered
  interceptAudioFingerprint();    // Covered
  interceptScreenFingerprint();   // Covered
  interceptTimezoneFingerprint();      // Covered
  interceptHardwareConcurrency();      // Covered
  interceptMaxTouchPoints();         // Covered
  interceptPluginEnumerationFingerprint();    // Covered
  interceptCacheFingerprint();             //   MISSING
  interceptAnimationFingerprint();      // Covered
  //interceptPersistentTracking();
  //interceptGeoLocationReading();
  //interceptCookieTraveling();
  interceptBatteryFingerprint();     // Covered 
  //interceptNetworkConnectionInformation();
  //interceptPermissionsEnumerationFingerprint();
}

init();
