**Date.prototype.getTimezoneOffset**

<ins>Entropy: ~36</ins>
<ins>Type: long-term</ins>

*** Description *** This list contains 36 GMT offsets. Don't forget, this list is not constant (depend on, is daylight saving time applied or not). But what is GMT? It is abbreviation for Greenwich Mean Time. GMT is the mean solar time at the Royal Observatory in Greenwich (London, UK). It was formerly used as the international civil time standard. Time zones on east from Greenwich have positive offset and on west: negative.

**window.screen.width**

<ins>Entropy: ~100</ins>
<ins>Type: long-term</ins>

*** Description *** 
Total: 100-150

Laptop Monitors
Compact/Budget Laptops:

1024 px
1280 px
1366 px
1440 px
Standard/Mainstream Laptops:

1600 px
1920 px (Full HD)
2304 px (MacBook Retina)
2560 px (Quad HD)
High-Resolution Laptops:

2880 px (MacBook Pro Retina)
3072 px (MacBook Pro 16")
3840 px (4K UHD laptops)
External Monitors
Standard Resolutions:

1280 px
1440 px
1600 px
1920 px (Full HD, extremely common)
High-Resolution Monitors:

2560 px (Quad HD)
3440 px (Ultrawide QHD)
3840 px (4K UHD)
5120 px (5K monitors)
Ultra High-Resolution Monitors:

6016 px (Apple Pro Display XDR)
7680 px (8K monitors)

**window.screen.height**

<ins>Entropy: ~50</ins>
<ins>Type: long-term</ins>

*** Description *** 
Laptop Monitors
Compact/Budget Laptops:

768 px (1366x768, very common for budget laptops)
800 px (older models with 1280x800)
900 px (1440x900, popular on mid-range laptops)
Standard/Mainstream Laptops:

1080 px (1920x1080, Full HD, extremely common)
1200 px (1920x1200 or 1600x1200, 16:10 aspect ratio)
High-Resolution Laptops:

1440 px (2560x1440, QHD)
1600 px (2880x1800, MacBook Retina)
1800 px (3072x1800, MacBook Pro 16")
2160 px (3840x2160, 4K UHD laptops)
External Monitors
Standard Resolutions:

720 px (1280x720, very basic monitors or TVs)
768 px (1366x768, entry-level monitors)
1080 px (1920x1080, most common for Full HD)
1200 px (1920x1200, professional 16:10 monitors)
High-Resolution Monitors:

1440 px (2560x1440, QHD)
1600 px (2560x1600, high-end 16:10 monitors)
2160 px (3840x2160, 4K UHD)
2880 px (5120x2880, 5K)
Ultra-High Resolutions:

3200 px (6016x3200, Apple Pro Display XDR)
4320 px (7680x4320, 8K UHD)

**window.screen.availWidth**

<ins>Entropy: ~10</ins>
<ins>Type: long-term</ins>

*** Description *** The difference between screen.availWidth and screen.width lies in how much of the screen's horizontal resolution is available for web content after accounting for system elements like the operating system's taskbars or other reserved screen space.

Refers to the width available for web content.
Excludes space occupied by system UI elements such as:
    - Taskbars (e.g., the Windows taskbar, macOS Dock when positioned on the side).
    - Sidebars or reserved regions by the operating system.
Represents the usable width for displaying content in a browser window.
__Example:__ If the taskbar on the side of the screen takes up 100 pixels, screen.availWidth might return 1820 instead of 1920

Property	            Includes Reserved Space?	Represents Usable Area?
screen.width	        Yes	                        No
screen.availWidth	    No	                        Yes

**window.innerHeight**

<ins>Entropy: ~5</ins>
<ins>Type: medium-term</ins>

*** Description *** The height of the content area of the browser's viewport (excluding browser UI like address bars, tabs).

<ins>Factors Influencing window.innerHeight:</ins>

1. Browser UI Elements:

- Address bar, tabs, and toolbar: The height of the browser's user interface (UI) elements (address bar, tabs, toolbars) will affect the available height for the content.
These UI elements can vary depending on the browser and whether it is in full-screen mode, maximized, or minimized. For example, browsers like Chrome, Firefox, or Safari may reserve different amounts of space.
- These UI elements can vary depending on the browser and whether it is in full-screen mode, maximized, or minimized.

2. Browser Window Size and Position:

- Maximized or windowed mode
- Scrolling and zoom: The height may also be influenced by zoom settings, vertical scrolling, or if the browser’s vertical scrollbar is visible or hidden

3. Device Scaling

4. Mobile Browsers vs Desktop Browsers

**window.innerWidth**

<ins>Entropy: ~5</ins>
<ins>Type: medium-term</ins>

*** Description *** The height of the content area of the browser's viewport (excluding browser UI like address bars, tabs).

<ins>Factors Influencing window.innerWidth:</ins>

1. Browser UI Elements:

- Address bar, tabs, and toolbar: The height of the browser's user interface (UI) elements (address bar, tabs, toolbars) will affect the available height for the content.
These UI elements can vary depending on the browser and whether it is in full-screen mode, maximized, or minimized. For example, browsers like Chrome, Firefox, or Safari may reserve different amounts of space.
- These UI elements can vary depending on the browser and whether it is in full-screen mode, maximized, or minimized.

2. Browser Window Size and Position:

- Maximized or windowed mode
- Scrolling and zoom: The height may also be influenced by zoom settings, vertical scrolling, or if the browser’s vertical scrollbar is visible or hidden

3. Device Scaling

4. Mobile Browsers vs Desktop Browsers

**window.outerHeight**

<ins>Entropy: ~5</ins>
<ins>Type: medium-term</ins>

*** Description *** The height of the content area of the browser's viewport (excluding browser UI like address bars, tabs).
Entire height of the browser window, including UI elements (address bar, toolbar, etc.).

**window.outerWidth**

<ins>Entropy: ~5</ins>
<ins>Type: medium-term</ins>

*** Description *** The height of the content area of the browser's viewport (excluding browser UI like address bars, tabs).
Entire height of the browser window, including UI elements (address bar, toolbar, etc.).