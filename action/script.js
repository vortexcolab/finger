// Function to update the entropy bar
function updateBarometer(entropy, tag) {
  const indicator = document.getElementById('indicator');
  const entropyLevel = document.getElementById('entropy-level');
  const tagIndicator = document.getElementById('tag');

  // Ensure entropy is between 0 and 100
  const clampedEntropy = Math.min(Math.max(entropy, 0), 100);

  // Update the width of the bar based on entropy
  indicator.style.width = `${clampedEntropy}%`;

  // Add animation if entropy is above a threshold
  if (clampedEntropy > 70) {
      indicator.classList.add('animate');
  } else {
      indicator.classList.remove('animate');
  }

  // Update the label
  entropyLevel.textContent = `Entropy: ${clampedEntropy} bits`;
  tagIndicator.textContent = tag;
}



setInterval(() => {
  // Example: Simulate updates every second
  let currentEntropy = 0;
  chrome.tabs.query({ highlighted: true}, function (tabs) {
    let current = tabs[0];
    let url = current.url;
    const hostname = new URL(url).hostname;

    // Perform an action, such as sending a message to the content script
    chrome.tabs.sendMessage(current.id, { message: "Give me entropy", url: url }, (response) => {
      console.log("Response from content script:", response);

      updateBarometer(Math.log2(response.data.entropy), response.data.tag);

    });
  });
}, 1000);