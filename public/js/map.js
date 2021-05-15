export async function loadMap(scene) {


    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/models/", "map.glb", scene);
    let map = result.meshes[0];

    
    map.position = new BABYLON.Vector3(0, 0, 0);

    let allMeshes = map.getChildMeshes();
    allMeshes.forEach(m => {
        //m.receiveShadows = true;
        m.checkCollisions = true;
    });

    scene.getMeshByName("sea").material.needDepthPrePass = true;
    scene.getLightByName("Sun").intensity = 10;


    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("//www.babylonjs.com/assets/skybox/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    

    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
};