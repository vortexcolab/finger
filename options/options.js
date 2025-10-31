// options/options.js
// Initialize toggle mappings
const toggles = {
  fingerprintToggle: "blockAllFingerprinting",
  audioFingerprintToggle: "audioctx",
  screenFingerprintToggle: "screen",
  canvasFingerprintToggle: "canvas",
  fontEnumerationFingerprintToggle: "fontEnumeration",
  benchmarkFingerprintToggle: "benchmark",
  otherFingerprintToggle: "other",
  hardwareFingerprintToggle: "hardware",
  memoryFingerprintToggle: "memory",
  batteryFingerprintToggle: "battery",
  cacheFingerprintToggle: "cache",
  pluginEnumerationFingerprintToggle: "pluginEnumeration",
  fontMetricsFingerprintToggle: "fontMetrics"
};

let needsReload = false;

document.addEventListener("DOMContentLoaded", () => {
  // Load saved states
  chrome.storage.local.get(Object.values(toggles), (data) => {
    for (const [id, key] of Object.entries(toggles)) {
      const input = document.getElementById(id);
      if (input) input.checked = data[key] || false;
      // Store the default states if not in memory
      chrome.storage.local.set({ [key]: input.checked || false });
      
      if (input) {
        input.onchange = function () {
          // User clicked Confirm
          if (input.id === "fingerprintToggle") {
            const dependents = document.querySelectorAll(".dependent");
            dependents.forEach(cb => {
                cb.checked = input.checked;
              });
            const dependentIds = Array.from(dependents).map(cb => cb.id);
            const updates = { [key]: input.checked };
            dependentIds.forEach(depId => {
              const depKey = toggles[depId];
              updates[depKey] = input.checked;
            });
            chrome.storage.local.set(updates, () => {
              // reload the extension to apply changes
              needsReload = true;
            });
          } else {
            if (document.getElementById("fingerprintToggle").checked === true && input.checked === false) {
              document.getElementById("fingerprintToggle").checked = false;
              chrome.storage.local.set({ blockFingerprinting: false });
            }
            
            chrome.storage.local.set({ [key]: input.checked }, () => {
              // reload the extension to apply changes
              needsReload = true;
            });
          }
        };
      }
    }
  });
});

window.addEventListener('beforeunload', () => {
  if (needsReload) {
    chrome.runtime.reload();
  }
});