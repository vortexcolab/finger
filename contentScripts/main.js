// The ID of the extension we want to talk to.
const extensionId = "fdggdpcbakcgdghnjgpiipcenllgmgpc";
// LOG LEVEL: 0 - low, 1 - medium, 2 - high, 4 - intensive
const logLevel = 4;
const config = {};
const fingerstatus = {};


(logLevel <= 1) ? console.log("Entraste no main.js "): null;


window.addEventListener("message", (event) => {
  if (event.data.action === "entropyRequest" && event.ports[0]) {
    const port = event.ports[0];
    var data = calculateStatus();
    console.log("BATEU", data);
    // Send entropy data back to the content script via the port
    port.postMessage(data);
  }
});


function calculateStatus() {

  var tag =[];
  var cEntropy = 0;

  // Process methodOverride
  if (config.methodOverride) {
    for (const item of config.methodOverride) {
      if (item.registerType == "presence") {
        let name = item.name;
        let parts = name.split('.');
        let target = resolvePath(parts.slice(0, -1).join('.'), fingerstatus);
        let methodName = parts[parts.length - 1];

        console.log(target, methodName, item.registerType);
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
          let name = item.name;
          let parts = name.split('.');
          let target = resolvePath(parts.slice(0, -1).join('.'), fingerstatus);
          let methodName = parts[parts.length - 1];

          console.log(target, methodName, item.registerType);
          if (item.registerType && item.type != "none" && target[methodName] == true) {
            cEntropy += item.entropy;
            if (item.category.length >= 0)
              tag = [...new Set([...tag, ...item.category])];
          }
        }
      }
  }

  // Process techniques
  if (config.techniques) {
    for (const item of config.techniques) {
      let arr = [];
      for (const e of item.traces) {
        arr.push(eval(e.eval));
      }
      console.log("arr: ", arr);
      cEntropy += Math.max(...arr);
    }

  }

  techniques.forEach((tech) => {
    let e = Math.max(...tech.traces.map(elem => elem.getEntropy()));
    console.log("here ", tech.name, e);
    (e > 0) ? tag.push(tech.name) : null;
    cEntropy += e;
  });

  console.log("Entropy: ", cEntropy);
  return { entropy: cEntropy, tag: tag};

}

function get(path) {
  if (!path) return fingerstatus;
  return path.split('.').reduce((obj, part) => (obj ? obj[part] : undefined), fingerstatus);
}

function resolvePath(path, initValue = window) {
  if (!path) return window;
  return path.split('.').reduce((obj, part) => (obj ? obj[part] : undefined), initValue);
}

function updateRegisteredInterceptions(registerType, name) {
  // Get a reference to the nested value
  const parts = name.split('.');
  let valueRef = resolvePath(parts.slice(0, -1).join('.'), fingerstatus);
  const methodName = parts[parts.length - 1];

  if (registerType == "presence") {
    valueRef[methodName] = true;
  } else if (registerType == "occurrence") {
    valueRef[methodName]++;
  }

}

function addToProxy({ registerType, category, prototype, name, isConstructor, entropy })  {
  const parts = name.split('.');
  const target = resolvePath(parts.slice(0, -2).join('.'));
  const methodName = parts[parts.length - 2];
  const attribute = parts[parts.length - 1];

  if (!target || !(methodName in target)) {
    console.warn(`Cannot find method: ${name}`);
    return;
  }

  // Save the original method descriptor
  const originalDescriptor = Object.getOwnPropertyDescriptor(target, methodName);

  // Create a proxy handler for the style object
  const proxyHandler = {
    get(target, prop, receiver) {
      console.log(`Accessing .${prop}`);
      if (prop == attribute)
        updateRegisteredInterceptions(registerType, name);
      // Use the target directly and bind the context if necessary
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'function') {
        return value.bind(target); // Ensure proper `this` context
      }
      return value;
    },
    set(target, prop, value) {
      console.log(`Setting .${prop} to ${value}`);
      if (prop == attribute)
        updateRegisteredInterceptions(registerType, name);
      return Reflect.set(target, prop, value);
    }
  };

  if (typeof originalDescriptor === 'undefined') {
    console.warn(`This ${target} hasn't property descriptor for ${attribute}`);
  } else {
    // Define a new property with a proxy on HTMLElement's prototype
    Object.defineProperty(target, methodName, {
      get() {
        return (originalDescriptor.hasOwnProperty('get')) ? new Proxy(originalDescriptor.get.call(this), proxyHandler) : (typeof originalDescriptor.value === 'function') ? new Proxy(originalDescriptor.value.call(this), proxyHandler) : new Proxy(originalDescriptor.value, proxyHandler);
      },
      set() {
        return (originalDescriptor.hasOwnProperty('set')) ? new Proxy(originalDescriptor.set.call(this), proxyHandler) : (typeof originalDescriptor.value === 'function') ? new Proxy(originalDescriptor.value.call(this), proxyHandler) : new Proxy(originalDescriptor.value, proxyHandler);
      },
      configurable: true,
      enumerable: true
    });
  }
}

function interceptMethod({ registerType, category, prototype, name, isConstructor, entropy }) {
  const parts = name.split('.');
  const target = resolvePath(parts.slice(0, -1).join('.'));
  const methodName = parts[parts.length - 1];

  console.log(`parts: ${parts}`);

  if (!target || !(methodName in target)) {
      console.warn(`Cannot find method: ${name}`);
      return;
  }

  const originalMethod = target[methodName];

  // If prototype, redefine on prototype
  if (prototype) {
      Object.defineProperty(target, methodName, {
          value: function (...args) {
              console.log(`Intercepted method: ${name}`);
              updateRegisteredInterceptions(registerType, name);
              return originalMethod.apply(this, args);
          },
          writable: true,
          configurable: true,
      });
  } else {
      // If not prototype, redefine on the instance
      target[methodName] = function (...args) {
          console.log(`Intercepted method: ${name}`);
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

function interceptAttribute({ registerType, category, prototype, name, isConstructor, entropy }) {
  const parts = name.split('.');
  const target = resolvePath(parts.slice(0, -1).join('.'));
  const attributeName = parts[parts.length - 1];

  if (!target || !(attributeName in target)) {
      console.warn(`Cannot find attribute: ${name}`);
      return;
  }

  console.log(target, attributeName);

  const hasDescriptor = typeof Object.getOwnPropertyDescriptor(target, attributeName) !== 'undefined';
  if (!hasDescriptor) {
    console.warn(`This ${target} hasn't property descriptor for ${attributeName}`);
  }
  // Modify attribute with getter/setter
  const originalValue = (hasDescriptor) ? Object.getOwnPropertyDescriptor(target, attributeName): target[attributeName];
  Object.defineProperty(target, attributeName, {
      get() {
          console.log(`Intercepted attribute: ${name}`);
          updateRegisteredInterceptions(registerType, name);
          return (originalValue.hasOwnProperty('get')) ? originalValue.get.call(this) : (typeof originalValue.value === 'function') ? originalValue.call(this) : originalValue;
      },
      set(value) {
          console.log(`Modified attribute: ${name}, New value: ${value}`);
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

/*

var port = chrome.runtime.connect(extensionId, {includeTlsChannelId: true, name: "optionalName"});
// port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  if (msg.question === "What is the fingerprinting status?") {
    alert("HELLO");
    console.log("HELLO");
    const status = calculateStatus();
    port.postMessage({answer: status});
  }
  //else if (msg.question === "Madame who?")
    //port.postMessage({answer: "Madame... Bovary"});
});

*/