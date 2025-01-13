// Function to update the entropy bar
/**
 * Description placeholder
 *
 * @param {*} entropy 
 * @param {*} tags 
 */
function updateBarometer(entropy, tags) {
  const indicator = document.getElementById('indicator');
  const entropyLevel = document.getElementById('entropy-level');
  const tagIndicator = document.getElementById('tag');

  // Ensure entropy is between 0 and 100
  const clampedEntropy = Math.min(Math.max(entropy, 0), 50);

  // Update the width of the bar based on entropy
  indicator.style.width = `${clampedEntropy*2}%`;

  // Add animation if entropy is above a threshold
  if (clampedEntropy > 35) {
      indicator.classList.add('animate');
  } else {
      indicator.classList.remove('animate');
  }

  if (clampedEntropy <= 10) {
    indicator.style.background = "linear-gradient(to right, green, greenyellow)";
    entropyLevel.innerHTML = `<span class="secure-tag">Secure</span> Entropy: ${clampedEntropy} bits`;
  } else if (clampedEntropy <= 25) {
    indicator.style.background = "linear-gradient(to right, greenyellow, yellow, orange)"
    entropyLevel.innerHTML = `<span class="alarm-tag">Alert</span> Entropy: ${clampedEntropy} bits`;
  } else if (clampedEntropy <= 30) {
    indicator.style.background = "linear-gradient(to right, orange, orangered, red)"
    entropyLevel.innerHTML = `<span class="dangerous-tag">Fingerprinted</span> Entropy: ${clampedEntropy} bits`;
  } else {
    indicator.style.background = "linear-gradient(to right, red, maroon)"
    entropyLevel.innerHTML = `<span class="infernal-tag">Infernal</span> Entropy: ${clampedEntropy} bits`;
  }
  // Update the label

  tagIndicator.textContent = '';
  tags.forEach(tag => {
    let tmpElem = document.createElement("span");
    tmpElem.className = "technique-tag";
    tmpElem.textContent = tag
    tagIndicator.appendChild(tmpElem);
  });
}



setInterval(() => {
  // Example: Simulate updates every second
  let currentEntropy = 0;
  /* 
    O problema com esta implementação é que as janelas vão espelhar os dados da janela ativa e last Focused
  */
  chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
    let current = tabs[0];
    let url = current.url;
    const hostname = new URL(url).hostname;

    console.log(url);
    // Perform an action, such as sending a message to the content script
    chrome.tabs.sendMessage(current.id, { message: "Give me entropy", url: url }, (response) => {
      console.log("Response from content script:", response);

      updateBarometer(Math.round(Math.log2(response.data.entropy)), response.data.tag);

    });
  });
}, 1000);