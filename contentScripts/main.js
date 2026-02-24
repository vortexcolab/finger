/**
 *
 * @type {string} 
 */
const extensionId = "dalfinncnmgblohdpgnphdadaibhmajc";

/**
 *
 * @type {number} 
 */
const logLevel = 0;
/**
 *
 * @type {object} 
 */
const config = {};
/**
 *
 * @type {object} 
 */
const fingerstatus = {};

// Inject a small page-context polyfill so page scripts can call Uint8Array.from
;(function injectUint8ArrayFromPolyfill() {
  try {
    const script = document.createElement('script');
    script.textContent = `(() => {
      try {
        if (typeof Uint8Array !== 'undefined' && typeof Uint8Array.from !== 'function') {
          var ArrayFrom = (typeof Array.from === 'function') ? Array.from : function(arr, mapFn, thisArg) {
            var out = [];
            for (var i = 0; i < arr.length; i++) {
              out.push(typeof mapFn === 'function' ? mapFn.call(thisArg, arr[i], i) : arr[i]);
            }
            return out;
          };
          Object.defineProperty(Uint8Array, 'from', {
            value: function(source, mapFn, thisArg) {
              return new Uint8Array(ArrayFrom(source, mapFn, thisArg));
            },
            writable: true,
            configurable: true,
            enumerable: false
          });
        }
      } catch (e) {
        // swallow errors to avoid breaking page
      }
    })();`;
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  } catch (e) {
    // ignore
  }
})();


//(logLevel <= 4) ? console.log("Entraste no main.js "): null;


/** 
 * @description Listen messages, namely "entropyRequest" from the contentScript 'contentScripts/message.js', calculate the current status and return that information.
 *  '/contentScripts/message.js' is a intermediary between MAIN world 'contentScripts/script.js' and the extension background script and action.
 * @author Pedro Correia
 * @date 13/01/2025
 * 
*/

// Listen for messages from the webpage
window.addEventListener("message", (event) => {
  if (event.data.action === "entropyRequest" && event.ports[0]) {
      const port = event.ports[0];
      var data = calculateStatus();
      port.postMessage(data);
    
  }
});


/**
 * @description Calculate the current status.
 * @author Pedro Correia
 * @date 13/01/2025
 * @return  {{ tag: string[], entropy: number }} - An Object containing an array of the tags/techniques that was captured that will be presented in the popup interface, and the registered entropy.
 */
function calculateStatus() {

  // Array to store processed tags
  var tag =[];

  // Intitializer for the base entropy, it is 0 until find a execution flow that have entropy associated, this information is configured in /config/config.json
  var cEntropy = 0;

  // Process methodOverride
  if (config.methodOverride) {
    for (const item of config.methodOverride) {
      if (item.registerType == "presence") {
        // Name have this format "JSInterface.object.method"
        let name = item.name;
        // Parts have this format ["JSInterface", "Object", "method"]
        let parts = name.split('.');
        // Target is a reference to an symbol in the fingerstatus object
        let target = resolvePath(parts.slice(0, -1).join('.'), fingerstatus);
        // MethodName is the method in that Target that we want to intercept
        let methodName = parts[parts.length - 1];

        
        //(logLevel <= 1) ? console.log(target, methodName, item.registerType): null;
        if (item.registerType && item.type != "none" && target[methodName] == true) {
          cEntropy += item.entropy;
          if (item.category.length >= 0)
            tag = [...new Set([...tag, ...item.category])];
        }
      }
    }
  }

  // Process attributeModification
  if (config.attributeModification) {
      for (const item of config.attributeModification) {
        if (item.registerType == "presence") {
          // Name have this format "JSInterface.object.property"
          let name = item.name;
          // Parts have this format ["JSInterface", "Object", "property"]
          let parts = name.split('.');
          // Target is a reference to an symbol in the fingerstatus object
          let target = resolvePath(parts.slice(0, -1).join('.'), fingerstatus);
          // AttributeName is the property in that Target that we want to intercept
          let attributeName = parts[parts.length - 1];

          
          //(logLevel <= 1) ? console.log(target, attributeName, item.registerType): null;
          if (item.registerType && item.type != "none" && target[attributeName] == true) {
            cEntropy += item.entropy;
            if (item.category.length >= 0)
              tag = [...new Set([...tag, ...item.category])];
          }
        }
      }
  }

  // Process the traces related to fingerprint execution flows in the "contentScript/techniques.js" file
  techniques.forEach((tech) => {
    let e = Math.max(...tech.traces.map(elem => elem.getEntropy()));
    
    //(logLevel <= 1) ? console.log("Technique, entropy: ", tech.name, e): null;
    (e > 0) ? tag.push(tech.name) : null;
    cEntropy += e;
  });

 
  //(logLevel <= 1) ? console.log("Entropy: ", cEntropy): null;
  return { entropy: cEntropy, tag: tag};

}


/**
 * @description Get the value of a symbol in the fingerstatus (global object).
 * @author Pedro Correia
 * @date 13/01/2025

 * @return {boolean|number|undefined}  - Return the corresponding value of the symbol 'path' within fingerstatus (global object).
 */


/**
 * @description Get the value of a symbol in the window. However this method is called various times in this file with initValue=fingerStatus (global object).
 * @author Pedro Correia
 * @date 13/01/2025
 * @param {string} path - Path to the symbol, it will be compatible with the format specified in /config/config.json, /config/status.json and /contentScripts/techniques.js.
 * @param {Object} [initValue=window] - This is the value used in the reducer. To access values of Symbols in the fingerstatus it will be equal to fingerStatus.
 * @return {boolean|number|undefined}  - Return the corresponding value of the symbol 'path' within window object. However this method is called various times in this file with initValue=fingerStatus (global object).
 */
function resolvePath(path, initValue = window) {

  if (!path) return window;
  return path.split('.').reduce((obj, part) => (obj ? obj[part] : undefined), initValue);
}

/**
 * @description Update the plugin status for an observed interception. It runs internally.
 * @author Pedro Correia
 * @date 13/01/2025
 * @param {string} registerType - It is consigured to receive 2 values ('ocurrences' or 'presence').
 * @param {string} name - Name of the symbol that FINGER observed the interception.
 */
function updateRegisteredInterceptions(registerType, name, prop) {

  // Parts have this format ["JSInterface", "Object", "property"]
  const parts = name.split('.');
  // Target is a reference to an symbol in the fingerstatus object
  let target = resolvePath(parts.slice(0, -1).join('.'), fingerstatus);
  // Property in Target that FINGER want to register the observed interception
  const property = parts[parts.length - 1];

  if (registerType == "presence") {
    if (prop !== undefined) {
      target[property][prop] = true;
    } else {
      target[property] = true;
    }
  } else if (registerType == "occurrence") {
    if (prop !== undefined) {
      target[property][prop]++;
    } else {
      target[property]++;
    }
  }

}

// category is a list of strings representing the categories configured in /config/config.json
/**
 * @description Check if a given category is blocked based on the current toggles.
 * 
 * @author Pedro Correia
 * @date 13/01/2025
 * @param {string} category - The category to check.
 *  
 * @param {Object} toggles - The current state of the toggles from storage.
 * @return {boolean} - True if the category is blocked, false otherwise.
 */

function isThisCategoryBlocked(category, toggles) {

  category = Array.isArray(category) ? category : [category];

  for (const cat of category) {
    switch (cat) {
      case "fingerprinting":
        if (toggles.blockFingerprinting) return true;
        break; 
      case "audioFingerprinting":
        if (toggles.blockAudioFingerprinting) return true;
        break;
      case "screenFingerprinting":
        if (toggles.blockScreenFingerprinting) return true;
        break;
      case "canvasFingerprinting":
        if (toggles.blockCanvasFingerprinting) return true;
        break;
      case "webGLFingerprinting":
        if (toggles.blockWebGLFingerprinting) return true;
        break; 
      case "fontFingerprinting":
        if (toggles.blockFontFingerprinting) return true;
        break;
      case "timezoneFingerprinting":
        if (toggles.blockTimezoneFingerprinting) return true;
        break;
      default:
        console.warn(`Unknown category: ${cat}`);
    }
  }

  return false;
}

/**
 * @description This function initialized the interceptions to make trought proxy methodology. These intructions was configured previously in '/confi/config.json'.
 * @author Pedro Correia
 * @date 13/01/2025
 * @param {Object} params - It receives an item with varios property,  And name is the expression that we want setup interceptions. 
 * @param {String} params.registerType - The registerType is a string representing 'occurrence' or 'presence'.
 * @param {String} params.name - The name of the expression that we want setup interceptions. 
 * @return {*}  
 */
function addToProxy({ category, registerType, name, attributes }, toggles)  {

  // Parts have this format ["JSInterface", "Object", "method"]
  const parts = name.split('.');
  // Target is a reference to an symbol in the fingerstatus object
  const target = resolvePath(parts.slice(0, -1).join('.'));
  // Property is the method in that Target that we want to intercept
  const property = parts[parts.length - 1];
  // is this category blocked?
  const blockFingerprinting = category.some(cat => toggles[cat]) || toggles['blockFingerprinting'];

  if (!target || !(property in target)) {
    console.warn(`Cannot find method: ${name}`);
    return;
  }

  // Save the original method descriptor
  const originalDescriptor = Object.getOwnPropertyDescriptor(target, property);

  // Create a proxy handler for the style object
  const proxyHandler = {
    get(target, prop, receiver) {
      //(logLevel <= 1) ? console.log(`Accessing .${prop} and ${attributes}`): null;
      if (attributes.includes(prop))
        (blockFingerprinting) ?  undefined : updateRegisteredInterceptions(registerType, name, prop);
      if (typeof target[prop] === 'function') {
        return (blockFingerprinting) ?  undefined : target[prop].bind(target); // Ensure proper `this` context
      }
      return (blockFingerprinting) ?  undefined : Reflect.get(target, prop, receiver);

    },
    set(target, prop, value) {
      //(logLevel <= 1) ? console.log(`Setting .${prop} to ${value} and ${attributes}`): null;
      if (attributes.includes(prop))
        (blockFingerprinting) ?  undefined : updateRegisteredInterceptions(registerType, name, prop);
      return Reflect.set(target, prop, value);
    }
  };

  if (typeof originalDescriptor === 'undefined') {
    console.warn(`This ${target} hasn't property descriptor for ${computedValue}`);
  } else {
    // Define a new property with a proxy on HTMLElement's prototype
    Object.defineProperty(target, property, {
      get() {
        const attr = originalDescriptor.get.call(this);
        return new Proxy(attr, proxyHandler); 
      },
      configurable: true,
      enumerable: true
    });
  }
}



/**
 * @description This function initialized the interceptions to make trought method override methodology. These intructions was configured previously in '/confi/config.json'.
 * @author Pedro Correia
 * @date 13/01/2025
 * @param {Object} params - It receives an item with varios property,  And name is the expression that we want setup interceptions. 
 * @param {String} params.registerType - The registerType is a string representing 'occurrence' or 'presence'.
 * @param {String} params.prototype - True if is a prototype and False if isn't. 
 * @param {String} params.name - The name of the expression that we want setup interceptions. 
 * @param {String} params.isConstructor - True if is a constructor and False if isn't.
 * @return {*}  
 */
function interceptMethod({ category, registerType, prototype, name, isConstructor }, toggles) {
  const parts = name.split('.');
  const target = resolvePath(parts.slice(0, -1).join('.'));
  const methodName = parts[parts.length - 1];
    // is this category blocked?
  const blockFingerprinting = category.some(cat => toggles[cat]) || toggles['blockFingerprinting'];

  if (!target || !(methodName in target)) {
      console.warn(`Cannot find method: ${name}`);
      return;
  }

  const originalMethod = target[methodName];
  const originalDescriptor = Object.getOwnPropertyDescriptor(target, methodName) || {};

  // If prototype, redefine on prototype
  if (prototype) {
      Object.defineProperty(target, methodName, {
          value: function (...args) {
            //(logLevel <= 1) ? console.log(`Intercepted method: ${name}`): null;
              (blockFingerprinting) ?  undefined : updateRegisteredInterceptions(registerType, name);
              return (blockFingerprinting) ? undefined : originalMethod.apply(this, args);
          },
          writable: true,
          configurable: true,
      });
  } else {
      // If not prototype, redefine on the instance
      const wrapper = function (...args) {
        (blockFingerprinting) ? undefined : updateRegisteredInterceptions(registerType, name);
        if (isConstructor) {
          // Preserve subclassing/new.target behavior
          try {
            return Reflect.construct(originalMethod, args, new.target || originalMethod);
          } catch (e) {
            // Fallback to direct construction if Reflect.construct fails
            return new originalMethod(...args);
          }
        }
        return originalMethod.apply(this, args);
      };

      // If this wraps a constructor, preserve the original prototype so
      // `Constructor.prototype` continues to point to the original prototype
      // object (important for built-ins like Uint8Array).
      if (isConstructor && originalMethod && originalMethod.prototype) {
        try {
          Object.defineProperty(wrapper, 'prototype', {
            value: originalMethod.prototype,
            writable: false,
            configurable: true,
            enumerable: false
          });
        } catch (e) {
          // If environment prevents redefining prototype, fall back to assignment
          try { wrapper.prototype = originalMethod.prototype; } catch (e) { /* ignore */ }
        }
      }
      // Copy static properties (like Uint8Array.from) from the original constructor
      if (isConstructor && originalMethod) {
        try {
          const staticKeys = Object.getOwnPropertyNames(originalMethod).concat(Object.getOwnPropertySymbols(originalMethod));
          for (const key of staticKeys) {
            if (key === 'prototype') continue;
            try {
              const desc = Object.getOwnPropertyDescriptor(originalMethod, key);
              Object.defineProperty(wrapper, key, desc);
            } catch (e) {
              // ignore individual property copy failures
            }
          }
        } catch (e) {
          // ignore failures copying static properties
        }
      }

      // If this is a global constructor (e.g., window.Uint8Array), define a getter
      // so mere reads register presence. Otherwise, replace the value as before.
      try {
        if (isConstructor && (target === window || target === globalThis)) {
          Object.defineProperty(target, methodName, {
            get() {
              (blockFingerprinting) ? undefined : updateRegisteredInterceptions(registerType, name);
              return wrapper;
            },
            set(v) {
              // allow user code to replace the constructor
              try { Object.defineProperty(target, methodName, { value: v, writable: true, configurable: true }); } catch (e) { target[methodName] = v; }
            },
            configurable: typeof originalDescriptor.configurable === 'boolean' ? originalDescriptor.configurable : true,
            enumerable: typeof originalDescriptor.enumerable === 'boolean' ? originalDescriptor.enumerable : false
          });
        } else {
          Object.defineProperty(target, methodName, {
            value: wrapper,
            writable: true,
            configurable: true
          });
        }
      } catch (e) {
        // Fallback if defineProperty fails
        try { target[methodName] = wrapper; } catch (ee) { /* ignore */ }
      }
  }
}

/**
 * Port-based communication: use runtime.connect() without hardcoding extension id
 */
/**
  Explicação(colocar no commit):

  1. Verificação do prototype:
  O prototype de um objeto como HTMLElement não é a forma correta de obter o valor original de uma propriedade diretamente. O correto seria acessar a descrição da propriedade usando Object.getOwnPropertyDescriptor diretamente do objeto ou de seu protótipo, mas há um ponto que você precisa melhorar na lógica do código.

  2. Acesso ao Descritor da Propriedade:
  Você está tentando acessar originalValue.value, mas Object.getOwnPropertyDescriptor retorna um descritor de propriedade, que possui as chaves value, get, set, etc. Se o descritor não tiver um get ou set definido, a propriedade value é usada.

  3. Problema na Lógica do prototype:
  Ao tentar usar a variável prototype, você pode acabar confundindo a lógica de como obter a propriedade original de um objeto e de seu protótipo.

*/

/**
 * @description This function initialized the interceptions to make trought property modification methodology. These intructions was configured previously in '/confi/config.json'.
 * @author Pedro Correia
 * @date 13/01/2025
 * @param {Object} params - It receives an item with varios property,  And name is the expression that we want setup interceptions. 
 * @param {String} params.registerType - The registerType is a string representing 'occurrence' or 'presence'.
 * @param {String} params.name - The name of the expression that we want setup interceptions. 
 * @return {*}  
 */
function interceptAttribute({ category, registerType,  name }, toggles) {
  const parts = name.split('.');
  const target = resolvePath(parts.slice(0, -1).join('.'));
  const attributeName = parts[parts.length - 1];
  // is this category blocked?
  const blockFingerprinting = category.some(cat => toggles[cat]) || toggles['blockFingerprinting'];

  if (!target || !(attributeName in target)) {
      console.warn(`Cannot find attribute: ${name}`);
      return;
  }

  //(logLevel <= 1) ? console.log(target, attributeName): null;

  const hasDescriptor = typeof Object.getOwnPropertyDescriptor(target, attributeName) !== 'undefined';
  if (!hasDescriptor) {
    console.warn(`This ${target} hasn't property descriptor for ${attributeName}`);
  }
  // Modify attribute with getter/setter
  const originalValue = (hasDescriptor) ? Object.getOwnPropertyDescriptor(target, attributeName): target[attributeName];
  Object.defineProperty(target, attributeName, {
      get() {
          //(logLevel <= 1) ? console.log(`Intercepted attribute: ${name}`): null;
          (blockFingerprinting) ?  undefined : updateRegisteredInterceptions(registerType, name);
          return (blockFingerprinting) ? undefined : (originalValue.hasOwnProperty('get')) ? originalValue.get.call(this) : (typeof originalValue.value === 'function') ? originalValue.call(this) : originalValue;
      },
      set(value) {
          //(logLevel <= 1) ? console.log(`Modified attribute: ${name}, New value: ${value}`): null;
          (blockFingerprinting) ?  undefined : updateRegisteredInterceptions(registerType, name);
          if (originalValue.hasOwnProperty('set')) {
            originalValue.set.call(this, value);
          } else {
            originalValue.value = value;
          }
      },
      configurable: true,
  });

}



/**
 * @description Apply the initial configurations. 
 * @author Pedro Correia
 * @date 13/01/2025
 * @param {*} config - Contents of the file "/config/config.json"
 */
async function applyConfig(config, toggles) {

  //console.log("Toggles from storage: ", toggles);
  
  // Process methodOverride
  if (config.methodOverride) {
      for (const item of config.methodOverride) {
        interceptMethod(item, toggles);
      }
  }

  // Process attributeModification
  if (config.attributeModification) {
      for (const item of config.attributeModification) {
        interceptAttribute(item, toggles);
      }
  }

  // Handle proxy (if needed later)
  if (config.proxy && config.proxy.length > 0) {
      for (const item of config.proxy) {
        //(logLevel <= 1) ? //console.log("Proxy: ", item): null;
        addToProxy(item, toggles);
      }
  }
}

(function () {

  // Get initial config (one-shot message to background)
  chrome.runtime.sendMessage(extensionId, { action: 'getConfig' }, response => {
    if (response && response.success) {
      Object.assign(config, response.config);
      Object.assign(fingerstatus, response.status);
      applyConfig(config, response.toggles);
      console.log("Configuration applied successfully.");
    } else {
      console.error("Error fetching config:", response ? response.error : "Unknown error");
    }
  });
})();