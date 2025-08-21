/**
 *
 * @type {string} 
 */
const extensionId = "mmlnehmaeemkbacmlonfenhgjedjolfc";

/**
 *
 * @type {number} 
 */
const logLevel = 4;
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


(logLevel <= 4) ? console.log("Entraste no main.js "): null;


/** 
 * @description Listen messages, namely "entropyRequest" from the contentScript 'contentScripts/message.js', calculate the current status and return that information.
 *  '/contentScripts/message.js' is a intermediary between MAIN world 'contentScripts/script.js' and the extension background script and action.
 * @author Pedro Correia
 * @date 13/01/2025
 * 
*/
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

        
        (logLevel <= 1) ? console.log(target, methodName, item.registerType): null;
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

          
          (logLevel <= 1) ? console.log(target, attributeName, item.registerType): null;
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
    
    (logLevel <= 1) ? console.log("Technique, entropy: ", tech.name, e): null;
    (e > 0) ? tag.push(tech.name) : null;
    cEntropy += e;
  });

 
  (logLevel <= 1) ? console.log("Entropy: ", cEntropy): null;
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

/**
 * @description This function initialized the interceptions to make trought proxy methodology. These intructions was configured previously in '/confi/config.json'.
 * @author Pedro Correia
 * @date 13/01/2025
 * @param {Object} params - It receives an item with varios property,  And name is the expression that we want setup interceptions. 
 * @param {String} params.registerType - The registerType is a string representing 'occurrence' or 'presence'.
 * @param {String} params.name - The name of the expression that we want setup interceptions. 
 * @return {*}  
 */
function addToProxy({ registerType, name, attributes })  {

  // Parts have this format ["JSInterface", "Object", "method"]
  const parts = name.split('.');
  // Target is a reference to an symbol in the fingerstatus object
  const target = resolvePath(parts.slice(0, -1).join('.'));
  // Property is the method in that Target that we want to intercept
  const property = parts[parts.length - 1];

  if (!target || !(property in target)) {
    console.warn(`Cannot find method: ${name}`);
    return;
  }

  // Save the original method descriptor
  const originalDescriptor = Object.getOwnPropertyDescriptor(target, property);

  // Create a proxy handler for the style object
  const proxyHandler = {
    get(target, prop, receiver) {
      (logLevel <= 1) ? console.log(`Accessing .${prop} and ${attributes}`): null;
      if (attributes.includes(prop))
        updateRegisteredInterceptions(registerType, name, prop);
      if (typeof target[prop] === 'function') {
        return target[prop].bind(target); // Ensure proper `this` context
      }
      return Reflect.get(target, prop, receiver);

    },
    set(target, prop, value) {
      (logLevel <= 1) ? console.log(`Setting .${prop} to ${value} and ${attributes}`): null;
      if (attributes.includes(prop))
        updateRegisteredInterceptions(registerType, name, prop);
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
function interceptMethod({ registerType, prototype, name, isConstructor }) {
  const parts = name.split('.');
  const target = resolvePath(parts.slice(0, -1).join('.'));
  const methodName = parts[parts.length - 1];

  if (!target || !(methodName in target)) {
      console.warn(`Cannot find method: ${name}`);
      return;
  }

  const originalMethod = target[methodName];

  // If prototype, redefine on prototype
  if (prototype) {
      Object.defineProperty(target, methodName, {
          value: function (...args) {
            (logLevel <= 1) ? console.log(`Intercepted method: ${name}`): null;
              updateRegisteredInterceptions(registerType, name);
              return originalMethod.apply(this, args);
          },
          writable: true,
          configurable: true,
      });
  } else {
      // If not prototype, redefine on the instance
      target[methodName] = function (...args) {
        (logLevel <= 1) ? console.log(`Intercepted method: ${name}`): null;
          updateRegisteredInterceptions(registerType, name);
          return (isConstructor) ? new originalMethod(...args): originalMethod.apply(this, args);
      };
  }
}

/*
  Info: Você está tentando acessar originalValue.value, mas Object.getOwnPropertyDescriptor retorna um descritor de propriedade, que possui as chaves value, get, set, etc.
   Se o descritor não tiver um get ou set definido, a propriedade value é usada.

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
function interceptAttribute({ registerType,  name }) {
  const parts = name.split('.');
  const target = resolvePath(parts.slice(0, -1).join('.'));
  const attributeName = parts[parts.length - 1];

  if (!target || !(attributeName in target)) {
      console.warn(`Cannot find attribute: ${name}`);
      return;
  }

  (logLevel <= 1) ? console.log(target, attributeName): null;

  const hasDescriptor = typeof Object.getOwnPropertyDescriptor(target, attributeName) !== 'undefined';
  if (!hasDescriptor) {
    console.warn(`This ${target} hasn't property descriptor for ${attributeName}`);
  }
  // Modify attribute with getter/setter
  const originalValue = (hasDescriptor) ? Object.getOwnPropertyDescriptor(target, attributeName): target[attributeName];
  Object.defineProperty(target, attributeName, {
      get() {
          (logLevel <= 1) ? console.log(`Intercepted attribute: ${name}`): null;
          updateRegisteredInterceptions(registerType, name);
          return (originalValue.hasOwnProperty('get')) ? originalValue.get.call(this) : (typeof originalValue.value === 'function') ? originalValue.call(this) : originalValue;
      },
      set(value) {
          (logLevel <= 1) ? console.log(`Modified attribute: ${name}, New value: ${value}`): null;
          updateRegisteredInterceptions(registerType, name);
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
function applyConfig(config) {
  
  // Process methodOverride
  if (config.methodOverride) {
      for (const item of config.methodOverride) {
        interceptMethod(item);
      }
  }

  // Process attributeModification
  if (config.attributeModification) {
      for (const item of config.attributeModification) {
        interceptAttribute(item);
      }
  }

  // Handle proxy (if needed later)
  if (config.proxy && config.proxy.length > 0) {
      for (const item of config.proxy) {
        (logLevel <= 1) ? console.log("Proxy: ", item): null;
        addToProxy(item);
      }
  }
}

(function () {

  chrome.runtime.sendMessage(extensionId, { action: 'getConfig' }, response => {
    if (response && response.success) {
      Object.assign(config, response.config);
      Object.assign(fingerstatus, response.status);
      applyConfig(config);
      console.log("Configuration applied successfully.");
    } else {
      console.error("Error fetching config:", response ? response.error : "Unknown error");
    }
  });
})();