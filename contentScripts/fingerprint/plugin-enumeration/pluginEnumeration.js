var rating = 3 // 0 - low, 1 - medium, 2 - high, 3 - very high

if ( rating >=1 ) {
    // Test the override
    window.fetch('chrome://version')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    window.fetch('https://example.com')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

if ( rating >= 2 ) {
    // Test setting window.onmessage
    window.onmessage = function(event) {
        console.log('Original handler:', event.data);
    };
}

if ( rating >= 3 ) {
    performance.getEntriesByType("resource");
}