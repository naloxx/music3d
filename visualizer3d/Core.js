var $container = $('#container');

var VR_ENABLED = false;

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
var MEMORY_SIZE = AUDIO_BUFFER_SIZE;
var audioContext, audioAnalyser, frequencyData;


// WORLD
var clock = new THREE.Clock();
var mesh;
var heightMap;


// start
main();
function main() {
    initVideo();
    initAudio();
    createWorld();
    run();
}



function initVideo() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    $container.append(renderer.domElement);

    effect = new THREE.StereoEffect(renderer);
    effect.setSize(WIDTH, HEIGHT);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 );

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, AUDIO_BUFFER_SIZE,-AUDIO_BUFFER_SIZE*1.5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
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

function createWorld() {
    var width = AUDIO_BUFFER_SIZE;
    var height = MEMORY_SIZE;
    var geometry = new THREE.PlaneGeometry(width, height, width-1, height-1);
    var material = new THREE.MeshBasicMaterial({
        wireframe: true
    });
    mesh = new THREE.Mesh( geometry, material );
    mesh.rotateX(-Math.PI/2);
    scene.add(mesh);

    heightMap = new Float32Array(AUDIO_BUFFER_SIZE*MEMORY_SIZE);
    for (var i = 0; i < heightMap.length; i++) {
        heightMap[i] = 0;
    }
}

function run() {
    // render loop
    // fps für musikgenres bestimmen?
    var f = 2.33; // optimal für 140bpm
    var fps = f*32;
    setTimeout(function() {
        requestAnimationFrame(run);
    }, 1000/fps);

    update();


    // render
    if (VR_ENABLED)effect.render(scene, camera);
    else renderer.render(scene, camera);
}

function update() {
    audioAnalyser.getByteFrequencyData(frequencyData);

    var l = heightMap.length-AUDIO_BUFFER_SIZE;
    while (l > 0) {
        l -= 1;
        heightMap[l+AUDIO_BUFFER_SIZE] = heightMap[l];
    }
    for (var i = 0; i < frequencyData.length; i++) {
        var v = frequencyData[i]/255*10;
        heightMap[i] = Math.sqrt(v)*AUDIO_BUFFER_SIZE/10;
    }

    for (var i = 0; i < mesh.geometry.vertices.length; i++) {
        mesh.geometry.vertices[i].z = heightMap[i];
    }

    mesh.rotateZ(0.002);

    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
}

window.addEventListener("keydown", function(event) {
    if (event.which == 86) {
        VR_ENABLED = !VR_ENABLED;
        renderer.setSize(WIDTH, HEIGHT);
        effect.setSize(WIDTH, HEIGHT);
    }
}, true);