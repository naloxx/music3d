function BlackWhiteVisualizer() {
    // inherit from basic visualier
    var parent = new BasicVisualizer();
    this.update = parent.update;


    this.initVideo = function() {
        renderer = new THREE.WebGLRenderer({alpha:true});
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor( 0xffffff );
        renderer.shadowMapEnabled = true;

        $container.append(renderer.domElement);

        effect = new THREE.StereoEffect(renderer);
        effect.setSize(WIDTH, HEIGHT);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0, AUDIO_BUFFER_SIZE*0.9,-AUDIO_BUFFER_SIZE);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);
    };

    this.createWorld = function() {
        var width = AUDIO_BUFFER_SIZE;
        var height = MEMORY_SIZE;
        var geometry = new THREE.PlaneGeometry(width, height, width-1, height-1);
        var material = new THREE.MeshBasicMaterial({
            //side: THREE.DoubleSide
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

}