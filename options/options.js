document.addEventListener("DOMContentLoaded", () => {
  const toggles = {
    fingerprintToggle: "blockFingerprinting"
  };

  // Load saved states
  chrome.storage.local.get(Object.values(toggles), (data) => {
    for (const [id, key] of Object.entries(toggles)) {
      const input = document.getElementById(id);
      console.log(data);
      if (input) input.checked = data[key] || false;

      input.addEventListener("change", () => {
        chrome.storage.local.set({ [key]: input.checked }, () => {
            // reload the extension to apply changes
            setInterval(() => {
                chrome.runtime.reload();
                window.close();
            }, 500);


        });
      });
    }
  });

});