function BasicVisualizer() {
    this.initVideo = function() {
        renderer = new THREE.WebGLRenderer({alpha:false});
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
            color: 0xffffff
        });
        mesh = new THREE.Mesh( geometry, material );
        mesh.rotateX(-Math.PI/2);
        scene.add(mesh);

        heightMap = new Float32Array(AUDIO_BUFFER_SIZE*MEMORY_SIZE);
        for (var i = 0; i < heightMap.length; i++) {
            heightMap[i] = 0;
        }
    };
    
    this.update = function() {
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
}