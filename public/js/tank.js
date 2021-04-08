export default class Tank {

    async build(scene, canvas) {
        // La game, la scene, et le canvas
        this.scene = scene;
        this.canvas = canvas;

        // Axe de mouvement X et Z
        this.axisMovement = [false, false, false, false, false];
        this.#addListenerMovement();

        // MOUVEMENT TOURELLE PROVISOIRE
        this.axisTourelle = [false, false, false, false];
        this.#addListenerTourelle();

        // Vitesse de déplacement du tank
        this.speed = 0.6;

        // On crée le tank avec la caméra qui le suit
        await this.#createTank(scene);
        let followCamera = this.#createFollowCamera(scene, this.tank);

        //let camera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(30, 20, -10), scene);
        //camera.attachControl(canvas);

        // On prépare les armes
        this.#prepareWeapons(scene);
    }


    checkActionTank(deltaTime) {
        // Déplace le joueur (le tank)
        this.#checkMoveTank(deltaTime);

        // Rotation de la tourelle
        this.#checkMoveTourelle();

        // Anime le tank en fonction des ses déplacement
        this.#animateTank();

        // Check des armes du tank
        this.#checkWeapons();
    }

    // Crée le Tank
    async #createTank(scene) {
        // Le "patron" du personnage
        const patronTank = BABYLON.MeshBuilder.CreateBox("patronPlayer", { width: 7, depth: 4, height: 4 }, scene);
        patronTank.isVisible = false;
        patronTank.checkCollisions = true;
        patronTank.position = new BABYLON.Vector3(30, 30, 0);
        //patronTank.ellipsoid = new BABYLON.Vector3(3.6, 2, 3.6);
        patronTank.ellipsoid = new BABYLON.Vector3(1, 1.5, 1);
        patronTank.ellipsoidOffset = new BABYLON.Vector3(0, 1.5, 0);
        patronTank.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 1.5, 0));
    
        // On importe le tank
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/models/", "tank.glb", scene);
        var tank = result.meshes[0];

        let allMeshes = tank.getChildMeshes();
        allMeshes.forEach(m => {
            if (m.name == "Cannon" || m.name == "Tourelle") {
                m.rotation = m.rotationQuaternion.toEulerAngles();
            }
            m.metadata = "tank";
        });

        // On récupère les mesh du cannon et de la tourelle (pour tirer et déplacer la tourelle)
        this.meshCannon = this.scene.getMeshByName("Cannon");
        this.meshTourelle = this.scene.getMeshByName("Tourelle");

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
        camera.radius = 20;                 // how far from the object to follow
        camera.heightOffset = 14;           // how high above the object to place the camera
        camera.rotationOffset = 180;        // the viewing angle
        camera.cameraAcceleration = .1;     // how fast to move
        camera.maxCameraSpeed = 5;          // speed limit
        camera.fov = 1;
    
        scene.activeCamera = camera;
        return camera;
    }

    // Permet au joueur de déplacer le tank
    #checkMoveTank(deltaTime) {
        let fps = 1000 / deltaTime;
        let relativeSpeed = this.speed / (fps / 60);            // Vitesse de déplacement
        let rotationSpeed = 0.05;                   // Vitesse de rotation
        
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
 
    // Permet de déplacer la tourelle
    #checkMoveTourelle() {
        let rotationSpeed = 0.03;
        if (this.axisTourelle[0] === true && this.meshCannon.rotation.x >= 1.30) {
            this.meshCannon.rotation.x -= rotationSpeed;
        }
        if (this.axisTourelle[1] === true && this.meshCannon.rotation.x <= 1.72) {
            this.meshCannon.rotation.x += rotationSpeed;
        }
        if (this.axisTourelle[2] === true) {
            this.meshCannon.rotation.y -= rotationSpeed;
            this.meshTourelle.rotation.y -= rotationSpeed;
        }
        if (this.axisTourelle[3] === true) {
            this.meshCannon.rotation.y += rotationSpeed;
            this.meshTourelle.rotation.y += rotationSpeed;
        }
    }

    // Animation du tank
    #animateTank() {
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


    // Prépare les armes
    #prepareWeapons(scene) {
        // Boulet de cannon (quand le tank tire)
        var cannonBall = BABYLON.MeshBuilder.CreateSphere("cannonBall", {diameter: 1}, scene);
        var cannonBallMat = new BABYLON.StandardMaterial("cannonBallMaterial", scene);
        cannonBallMat.diffuseColor = BABYLON.Color3.Black();
        cannonBallMat.specularPower = 256;
        cannonBall.material = cannonBallMat;
        cannonBall.visibility = false;
        this.cannonBall = cannonBall;

        // Importation du bruit du coup de cannon
        this.cannonBlastSound = new BABYLON.Sound("bruitCannon", "./assets/sounds/cannonBlast.mp3", scene);

        // Zone invisible au-dessous la map qui détruit le boulet de cannon
        var killBox = BABYLON.MeshBuilder.CreateBox("killBox", {width:4000, depth:4000, height:4}, scene);
        killBox.position = new BABYLON.Vector3(0, -50, 0);
        killBox.visibility = 0;
        this.killBox = killBox;

        // Si le tank peut tirer (1 tire puis 3sec d'attente)
        this.tireEnable = true;
    }

    // Permet au tank de tirer
    #checkWeapons() {
        if (this.axisMovement[4] === true && this.tireEnable === true) {  
            var cannonBallClone = this.cannonBall.clone("cannonBallClone")
            cannonBallClone.visibility = 1;
            cannonBallClone.checkCollisions = false;
            cannonBallClone.position = this.meshCannon.absolutePosition;
            cannonBallClone.physicsImpostor = new BABYLON.PhysicsImpostor(cannonBallClone, BABYLON.PhysicsImpostor.SphereImpostor, {mass:2, friction:0.5, restitution:0}, this.scene);
            cannonBallClone.physicsImpostor.applyImpulse(this.meshCannon.up.scale(140), BABYLON.Vector3.Zero());
            cannonBallClone.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 20, 0), BABYLON.Vector3.Zero());
                            
            //create an action manager for the cannonBallClone that will fire when intersecting the killbox. It will then dispose of the cannonBallClone.
            cannonBallClone.actionManager = new BABYLON.ActionManager(this.scene);
            cannonBallClone.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger,
                        parameter:this.killBox
                    }, 
                    function(){
                        cannonBallClone.dispose();
                    }
                )
            );
            this.cannonBlastSound.play();       // Joue le son du cannon

            // Met le tire a false et démare le timer
            this.tireEnable = false;
            setTimeout(() => {
                this.tireEnable = true;
            }, 3000);
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
            } else if (event.key === " ") {
                this.axisMovement[4] = true;
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
            } else if (event.key === " ") {
                this.axisMovement[4] = false;
            }
        }, false);
    }


    // FONCTION PROVISOIRE
    #addListenerTourelle() {
        window.addEventListener('keydown', (event) => {
            if (event.key === "ArrowUp") {
                this.axisTourelle[0] = true;
            } else if (event.key === "ArrowDown") {
                this.axisTourelle[1] = true;
            } else if (event.key === "ArrowRight") {
                this.axisTourelle[2] = true;
            } else if (event.key === "ArrowLeft") {
                this.axisTourelle[3] = true;
            }
        }, false);

        window.addEventListener('keyup', (event) => {
            if (event.key === "ArrowUp") {
                this.axisTourelle[0] = false;
            } else if (event.key === "ArrowDown") {
                this.axisTourelle[1] = false;
            } else if (event.key === "ArrowRight") {
                this.axisTourelle[2] = false;
            } else if (event.key === "ArrowLeft") {
                this.axisTourelle[3] = false;
            }
        }, false);
    }
}