var $container = $("#container");
$container.height($container.height()-$("#header").height());

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


var animationState = {
    vrEnabled: false,
    rotating: false
};


// start
main();
function main() {
    initVideo();
    initAudio();
    createWorld();
    run();
}



function initVideo() {
    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor( 0xaaccff );

    $container.append(renderer.domElement);

    effect = new THREE.StereoEffect(renderer);
    effect.setSize(WIDTH, HEIGHT);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 );

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, AUDIO_BUFFER_SIZE*0.9,-AUDIO_BUFFER_SIZE);
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
        wireframe: true,
        color: 0x000000
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
    // animation loop
    var fps = 60;
    fps = 2.33*32; // 140bpm
    setTimeout(function() {
        requestAnimationFrame(run);
    }, 1000/fps);

    // update world
    update();

    // render
    if (animationState.vrEnabled)
        effect.render(scene, camera);
    else
        renderer.render(scene, camera);
}

function update() {
    // read new audio data
    audioAnalyser.getByteFrequencyData(frequencyData);

    // update heightmap with new audio data
    var l = heightMap.length-AUDIO_BUFFER_SIZE;
    while (l > 0) {
        l -= 1;
        heightMap[l+AUDIO_BUFFER_SIZE] = heightMap[l];
    }
    for (var i = 0; i < frequencyData.length; i++) {
        var v = frequencyData[i]/255*10;
        var scaling = AUDIO_BUFFER_SIZE/20;
        heightMap[i] = Math.sqrt(v)*scaling;
    }
    // update mesh with new heightmap
    for (var i = 0; i < mesh.geometry.vertices.length; i++) {
        mesh.geometry.vertices[i].z = heightMap[i];
    }

    // mesh animation
    var delta = clock.getDelta()*10;
    if (animationState.rotating) {
        rotateObject(mesh, delta, -delta, delta);
    }

    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
}

function rotateObject(object, degreeX, degreeY, degreeZ){

    degreeX = (degreeX * Math.PI)/180;
    degreeY = (degreeY * Math.PI)/180;
    degreeZ = (degreeZ * Math.PI)/180;

    object.rotateX(degreeX);
    object.rotateY(degreeY);
    object.rotateZ(degreeZ);

}


// dev controls
window.addEventListener("keydown", function(event) {
    switch (event.which) {
        case 86: // S
            animationState.vrEnabled = !animationState.vrEnabled;
            renderer.setSize(WIDTH, HEIGHT);
            effect.setSize(WIDTH, HEIGHT);
            break;
        case 82: // R
            animationState.rotating = !animationState.rotating;

    }

}, true);