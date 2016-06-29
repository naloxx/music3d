var $container = $("#container");
$container.height($container.height()-$("#header").height());

var VISUALIZER = new BlackWhiteVisualizer();

// VIDEO
var WIDTH = $container.width();
var HEIGHT = $container.height();
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 0.1;
var FAR = 10000;
var scene, renderer, camera, effect, controls;

// AUDIO
var AUDIO_BUFFER_SIZE = MEMORY_SIZE = 64;
var audioContext, audioAnalyser, frequencyData;


// WORLD
var clock = new THREE.Clock();
var mesh;
var heightMap;

var animationState = {
    vrEnabled: false,
    rotating: false
};


// start
main();
function main() {
    initAudio();
    VISUALIZER.initVideo();
    VISUALIZER.createWorld();
    run();
}

function initAudio() {
    audioContext = new AudioContext();
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = AUDIO_BUFFER_SIZE*2;
    frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);

    var audioElement = document.getElementById("player");
    audioElement.addEventListener("canplay", function() {
        var source = audioContext.createMediaElementSource(audioElement);
        source.connect(audioAnalyser);
        audioAnalyser.connect(audioContext.destination);
        audioElement.play();
    });
}

function run() {
    // animation loop
    var fps = 60;
    fps = 2.33*32; // 140bpm
    setTimeout(function() {
        requestAnimationFrame(run);
    }, 1000/fps);

    // update world
    VISUALIZER.update();

    // render
    if (animationState.vrEnabled)
        effect.render(scene, camera);
    else
        renderer.render(scene, camera);
}