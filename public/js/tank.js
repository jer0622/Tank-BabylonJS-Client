export default class Tank {

    async build(scene, canvas) {
        // La game, la scene, et le canvas
        this.scene = scene;
        this.canvas = canvas;

        // Axe de mouvement X et Z
        this.axisMovement = [false, false, false, false];
        this.#addListenerMovement();

        // Vitesse de déplacement
        this.speed = 0.8;

        // On crée le tank
        await this.#createTank(scene);

        // On crée une caméra qui suit le tank
        let followCamera = this.#createFollowCamera(scene, this.tank);
    }

    // Crée le Tank
    async #createTank(scene) {
        // Le "patron" du personnage
        const patronTank = BABYLON.MeshBuilder.CreateBox("patronPlayer", { width: 7, depth: 4, height: 4 }, scene);
        patronTank.isVisible = false;
        patronTank.checkCollisions = true;
        patronTank.position = new BABYLON.Vector3(40, 70, 300);
        patronTank.ellipsoid = new BABYLON.Vector3(3.6, 2, 3.6);
        patronTank.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 1.5, 0));
    
        // On importe le tank
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/", "tank.glb", scene);
        var tank = result.meshes[0];

        // On défini le patron comme parent au tank
        tank.parent = patronTank;

        // Importation des animations
        this.animRun = result.animationGroups[0];
        this.animRun.stop();

        this.tank = patronTank;
    }

    // Crée une caméra qui suit la target
    #createFollowCamera(scene, target) {
        let camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);
    
        camera.radius = 40; // how far from the object to follow
        camera.heightOffset = 14; // how high above the object to place the camera
        camera.rotationOffset = 180; // the viewing angle
        camera.cameraAcceleration = .1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit
    
        scene.activeCamera = camera;
        return camera;
    }

    // Permet au joueur de déplacer le tank
    checkMoveTank(deltaTime) {
        let fps = 1000 / deltaTime;
        let relativeSpeed = this.speed / (fps / 60);            // Vitesse de déplacement
        let rotationSpeed = this.speed / 100;                   // Vitesse de rotation
        
        if (this.axisMovement[0]) {
            let forward = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.tank.rotation.y))) * relativeSpeed, 
                0, 
                parseFloat(Math.cos(parseFloat(this.tank.rotation.y))) * relativeSpeed
            );
            this.tank.moveWithCollisions(forward);
        }
        if (this.axisMovement[1]) {
            let backward = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.tank.rotation.y))) * relativeSpeed, 
                0, 
                parseFloat(-Math.cos(parseFloat(this.tank.rotation.y))) * relativeSpeed
            );
            this.tank.moveWithCollisions(backward);
        }
        if (this.axisMovement[2]) {
            this.tank.rotation.y += rotationSpeed;
        }
        if (this.axisMovement[3]) {
            this.tank.rotation.y -= rotationSpeed;
        }
        this.tank.moveWithCollisions(new BABYLON.Vector3(0,(-1.5) * relativeSpeed ,0));
    }

    // Animation du tank
    animateTank() {
        // Animation de déplacement
        if (this.axisMovement[0] || this.axisMovement[1] ||
            this.axisMovement[2] || this.axisMovement[3]) {
            this.animRun.play(this.animRun.loopAnimation);
        }
        else {
            this.animRun.stop();
            this.animRun.reset();
        }
    }

    // Listener des touches
    #addListenerMovement() {
        window.addEventListener('keydown', (event) => {
            if ((event.key === "z") || (event.key === "Z")) {
                this.axisMovement[0] = true;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.axisMovement[1] = true;
            } else if ((event.key === "d") || (event.key === "D")) {
                this.axisMovement[2] = true;
            } else if ((event.key === "q") || (event.key === "Q")) {
                this.axisMovement[3] = true;
            }
        }, false);

        window.addEventListener('keyup', (event) => {
            if ((event.key === "z") || (event.key === "Z")) {
                this.axisMovement[0] = false;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.axisMovement[1] = false;
            } else if ((event.key === "d") || (event.key === "D")) {
                this.axisMovement[2] = false;
            } else if ((event.key === "q") || (event.key === "Q")) {
                this.axisMovement[3] = false;
            }
        }, false);
    }
}