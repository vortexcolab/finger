
// Execute getUserMedia with video and audio constraints
const streamPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: true });

// Handle the obtained stream
streamPromise.then(function(stream) {
  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  document.body.appendChild(videoElement);
  videoElement.play();
})
.catch(function(error) {
  console.error('Error accessing the camera:', error);
});


