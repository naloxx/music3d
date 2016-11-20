var $container = $("#container");
$container.height($container.height()-$("#header").height());

// track user input
var inputState = {
    vrEnabled: false,
    rotating: false
};

// select visualizer
var VISUALIZER;
VISUALIZER = new RedPulseVisualizer();

// VIDEO
var WIDTH = $container.width();
var HEIGHT = $container.height();
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 0.1;
var FAR = 10000;
var scene, renderer, camera, effect, controls;

// AUDIO
var AUDIO_BUFFER_SIZE = 64;
var MEMORY_SIZE = 64;
var audioContext, audioAnalyser, frequencyData;


// WORLD
var clock = new THREE.Clock();
var mesh;
var heightMap;


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

function selectVisualizer() {
    var selectedSkin = $("#skin option:selected").val();
    switch (selectedSkin) {
        case "basic":
            VISUALIZER = new BasicVisualizer();
            break;
        case "black-white":
            VISUALIZER = new BlackWhiteVisualizer();
            break;
        case "red-pulse":
            VISUALIZER = new RedPulseVisualizer();
            break;
        case "shadow":
            VISUALIZER = new ShadowVisualizer();
            break;
        default:
            VISUALIZER = new BasicVisualizer();
            break;
    }
    VISUALIZER.initVideo();
    VISUALIZER.createWorld();
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
    if (inputState.vrEnabled)
        effect.render(scene, camera);
    else
        renderer.render(scene, camera);
}