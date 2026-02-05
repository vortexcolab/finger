# FINGER - Fingerprint Interception and Notification for Guarding User Rights

FINGER is a web extension conceived for Google Chrome that's monitor user privacy on the web. It detects fingerprinting activities, a method used to track users through unique browser and system characteristics.

## Features

- **Script interception**: The extension injects content scripts that modify JavaScript methods to intercept executions associated with browser fingerprinting techniques.
- **Fingerprinting detection**: Monitors various fingerprinting techniques, including:
  - Canvas API
  - Font Metrics
  - Plugin Enumeration
  - Audio Context
  - Battery Status API
  - Cache-Based Fingerprinting
  - Detection of hardware and browser properties.
- **User alerts**: When fingerprinting attempts are detected, the extension notifies the user through a popup interface.
- **Dynamic blocking**: The extension allows users to block tracking attempts via redirection using dynamic rules.

## Architecture and Workflow

1. When a page is loaded, the `main.js`, `message.js`, and `techniques.js` files are injected as content scripts into all webpages. These scripts apply modifications without altering the browser’s core functionalities. Techniques such as method overriding, object proxies, and property modifications are used in a surgical manner to monitor specific thresholds that may indicate fingerprinting activity.
2. Detected fingerprinting events are sent to the popup interface, which serves as the front end of the extension.
3. The extension notifies the user via a popup.
4. ~~The user can interact with the popup to view details of the fingerprinting attempts.~~ [UNDER DEVELOPMENTS]

## File Structure

- **manifest.json**: The main configuration file for the extension, defining permissions, scripts to be injected, and other metadata.
- **main.js**: The content script that intercepts fingerprinting attempts on web pages.
- **message.js**: Works as an intermediary between the popup and the content script `main.js`. Both are content scripts with a difference, `main.js`shares the MAIN WORLD with the webpages (DOM) and the `message.js` is isolated from it.
- **main.html**: The user interface displaying information about detected fingerprinting events. Manages interactions and updates the popup interface.

## Technologies Used

- **Google Chrome Extensions API**: Used to inject scripts and handle the necessary permissions.
- **JavaScript**: To intercept, monitor, and modify the behavior of fingerprinting scripts.
- **HTML/CSS**: For the graphical interface of the popup.
  
## Installation

1. Clone the repository:
    ```bash
    git clone https://gitlab.engine.capgemini.com/software-engineering/portugal/internal/vortexcolab/browser_plugin.git
    ```
2. Shift to branch:
    ```bash
    git checkout V3-modular
    ```
2. Navigate to the project directory:
    ```bash
    cd browser_plugin
    ```
3. Load the extension in Google Chrome:
    - Open `chrome://extensions/`.
    - Enable "Developer mode".
    - Click on "Load unpacked" and select the project directory.

## How to Contribute

1. Fork the project.
2. Create a new branch for your feature (`git checkout -b feature/feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
