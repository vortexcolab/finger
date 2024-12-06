function getFontMetrics() {
    // Create a test element
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.left = '-9999px';
    div.style.whiteSpace = 'nowrap';
    div.style.fontSize = '16px'; // fixed font size
    div.innerHTML = 'mmmmmmmmmmlli';
    document.body.appendChild(div);

    // List of fonts to test
    const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS', 'Impact'];

    // Get metrics for each font
    const metrics = fonts.map(font => {
      div.style.fontFamily = font;

      // Get dimensions
      const width = div.offsetWidth;
      const height = div.offsetHeight;
      const rect = div.getBoundingClientRect();

      return {
        font,
        width,
        height,
        rectWidth: rect.width,
        rectHeight: rect.height
      };
    });

    // Remove the test element
    document.body.removeChild(div);

    return metrics;
  }

  // Execute the font metrics fingerprinting
  const fontMetrics = getFontMetrics();
  console.log('Font Metrics:', fontMetrics);