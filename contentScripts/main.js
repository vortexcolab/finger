// The ID of the extension we want to talk to.
const extensionId = "mlljmejlaloeaofagliclpnmpeooljcc";
// LOG LEVEL: 0 - low, 1 - medium, 2 - high, 4 - intensive
const logLevel = 4;
const tag =[];
const config = {};
const fingerstatus = {};
var cEntropy = 0;


(logLevel <= 1) ? console.log("Entraste no main.js "): null;


window.addEventListener("message", (event) => {
  if (event.data.action === "entropyRequest" && event.ports[0]) {
    const port = event.ports[0];
    calculateStatus();
    // Send entropy data back to the content script via the port
    port.postMessage({ entropy: cEntropy, tag: tag});
  }
});

function calculateStatus() {

    // Process methodOverride
    if (config.methodOverride) {
      for (const item of config.methodOverride) {
        let name = item.name;
        let parts = name.split('.');
        let target = resolvePath(parts.slice(0, -1).join('.'), fingerstatus);
        let methodName = parts[parts.length - 1];

        console.log(target, methodName, item.registerType);
        if (item.registerType && item.type != "none" && target[methodName] == true) {
          cEntropy += item.entropy;
        }

      }
    }

  // Process attributeModification
  if (config.attributeModification) {
      for (const item of config.attributeModification) {
        let name = item.name;
        let parts = name.split('.');
        let target = resolvePath(parts.slice(0, -1).join('.'), fingerstatus);
        let methodName = parts[parts.length - 1];

        console.log(target, methodName, item.registerType);
        if (item.registerType && item.type != "none" && target[methodName] == true) {
          cEntropy += item.entropy;
        }
      }
  }

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
  } else if (registerType == "occurrences") {
    valueRef[methodName]++;
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

function interceptAttribute({ registerType, category, prototype, name, isConstructor, entropy }) {
  const parts = name.split('.');
  const target = resolvePath(parts.slice(0, -1).join('.'));
  const attributeName = parts[parts.length - 1];

  if (!target || !(attributeName in target)) {
      console.warn(`Cannot find attribute: ${name}`);
      return;
  }

  console.log(target, attributeName);

  // Modify attribute with getter/setter
  const originalValue = (prototype) ? Object.getOwnPropertyDescriptor(target, attributeName): target[attributeName];;
  Object.defineProperty(target, attributeName, {
      get() {
          console.log(`Intercepted attribute: ${name}`);
          updateRegisteredInterceptions(registerType, name);
          return (prototype) ? originalValue.value: originalValue;
      },
      set(value) {
          console.log(`Modified attribute: ${name}, New value: ${value}`);
          updateRegisteredInterceptions(registerType, name);
          (prototype) ? originalValue.value = value: originalValue = value;
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
  /*
  if (settings.proxy && settings.proxy.length > 0) {
      for (const item of settings.proxy) {
          // Implement proxy logic here if required
      }
  }
  */
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