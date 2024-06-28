
var a; 

try { 
    let numberOfChannels = 1; 
    let length = 44100; 
    let sampleRate = 44100; 
    var audioctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)
    (numberOfChannels, length, sampleRate), 
        oscillatorNode = audioctx.createOscillator(); 

    oscillatorNode.type = "triangle"; 
    oscillatorNode.frequency.value = 1e4; 
    var dynCompressorNode = audioctx.createDynamicsCompressor(); 

    dynCompressorNode.threshold && (dynCompressorNode.threshold.value = -50); 
    dynCompressorNode.knee && (dynCompressorNode.knee.value = 40); 
    dynCompressorNode.ratio && (dynCompressorNode.ratio.value = 12); 
    dynCompressorNode.reduction && (dynCompressorNode.reduction.value = -20); 
    dynCompressorNode.attack && (dynCompressorNode.attack.value = 0); 
    dynCompressorNode.release && (dynCompressorNode.release.value = 0.25); 

    oscillatorNode.connect(dynCompressorNode); 
    dynCompressorNode.connect(audioctx.destination); 
    oscillatorNode.start(0); 
    audioctx.startRendering(); 

    audioctx.oncomplete = function (audioBuffer) { 
    a = 0; 
    audioBuffer = audioBuffer.renderedBuffer.getChannelData(0); 

    dynCompressorNode.disconnect(); 
    };
} catch (e) { 
    console.error(e); 
} 