function BlackWhiteVisualizer() {
    this.initVideo = function() {
        renderer = new THREE.WebGLRenderer({alpha:false});
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor( 0x000000 );
        renderer.shadowMapType = THREE.PCFSoftShadowMap;
        renderer.shadowMapEnabled = true;


        $container.append(renderer.domElement);

        effect = new THREE.StereoEffect(renderer);
        effect.setSize(WIDTH, HEIGHT);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0, AUDIO_BUFFER_SIZE*0.9,-AUDIO_BUFFER_SIZE);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);


        var ambientLight = new THREE.AmbientLight( 0x111111 );
        scene.add(ambientLight);

        var spotLight = new THREE.SpotLight( 0xffee88, 0.7, 100, 2 );
        //spotLight.shadowCameraVisible = true;
        spotLight.position.set( -35, 30, 30);
        spotLight.castShadow = true;
        scene.add( spotLight );

        var spotLight2 = new THREE.SpotLight( 0xffee88, 0.3, 100, 2 );
        // spotLight2.shadowCameraVisible = true;
        spotLight2.position.set( 20, 20, -60);
        spotLight2.castShadow = true;
        scene.add( spotLight2 );

        var spotLight3 = new THREE.SpotLight( 0xffee88, 0.2, 100, 2 );
        // spotLight3.shadowCameraVisible = true;
        spotLight3.position.set( 35, 50, 35);
        spotLight3.castShadow = true;
        scene.add( spotLight3 );

        var spotLight3 = new THREE.SpotLight( 0xffee88, 1, 100, 2 );
        // spotLight3.shadowCameraVisible = true;
        spotLight3.position.set( -30, 40, -30);
        spotLight3.castShadow = true;
        scene.add( spotLight3 );
    };

    this.createWorld = function() {
        var width = AUDIO_BUFFER_SIZE;
        var height = MEMORY_SIZE;
        var geometry = new THREE.PlaneGeometry(width, height, width-1, height-1);
        var material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            //wireframe: true,
            color: 0xffaa22
        });
        mesh = new THREE.Mesh( geometry, material );
        mesh.receiveShadow = true;

        // rotateObject(mesh, -120, -30, 30);

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
            heightMap[i] = v;
        }
        // update mesh with new heightmap
        for (var i = 0; i < mesh.geometry.vertices.length; i++) {
            mesh.geometry.vertices[i].z = heightMap[i];
        }

        // mesh animation
        var delta = clock.getDelta()*10;
        if (inputState.rotating) {
            rotateObject(mesh, -delta, -delta, delta);
        }

        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
    }

}