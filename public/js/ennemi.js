export default class Ennemi {

    async build(scene, canvas, username, infoPlayer) {
        // La scene et le canvas
        this.scene = scene;
        this.canvas = canvas;

        //=============== Les informations du joueur ===============//
        this.infoPlayer = {};
        this.username = username;

        // Position
        this.infoPlayer.x = infoPlayer.x;
        this.infoPlayer.y = infoPlayer.y;
        this.infoPlayer.z = infoPlayer.z;

        // Rotation
        this.infoPlayer.rx = infoPlayer.rx;
        this.infoPlayer.ry = infoPlayer.ry;
        this.infoPlayer.rz = infoPlayer.rz;

        // Rotation Tourelle et cannon
        this.infoPlayer.tourelleRx = infoPlayer.tourelleRx;
        this.infoPlayer.tourelleRy = infoPlayer.tourelleRy;
        this.infoPlayer.tourelleRz = infoPlayer.tourelleRz;
        this.infoPlayer.CannonRx = infoPlayer.tourelleRx;
        this.infoPlayer.CannonRy = infoPlayer.tourelleRy;
        this.infoPlayer.CannonRz = infoPlayer.tourelleRz;

        // Vie
        this.infoPlayer.life = infoPlayer.life;

        await this.#createEnnemi(scene);
    }


    // Création du joueur ennemi
    async #createEnnemi(scene) {
        // Patron du tank
        const patronPlayer = BABYLON.MeshBuilder.CreateBox("patronPlayer", { width: 5, depth: 5, height: 3.5 }, scene);
        patronPlayer.isVisible = false;
        patronPlayer.checkCollisions = true;
        patronPlayer.position = new BABYLON.Vector3(this.infoPlayer.x, this.infoPlayer.y, this.infoPlayer.z);

        // On importe le tank
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/models/", "tank.glb", scene);
        var tank = result.meshes[0];
        let allMeshes = tank.getChildMeshes();
        allMeshes.forEach(m => {
            if (m.name == "Tourelle") {
                m.rotation = m.rotationQuaternion.toEulerAngles();
                this.meshTourelle = m;
            }
            if (m.name == "Cannon") {
                m.rotation = m.rotationQuaternion.toEulerAngles();
                this.meshCannon = m;
            }
            m.metadata = "ennemi:" + this.username;
        });

        // On stop les animations
        this.animRun = result.animationGroups[0];
        this.animRun.stop();

        // On défini le patron comme parent au tank
        tank.parent = patronPlayer;

        this.ennemi = patronPlayer;
    }


    // Update du joueur ennemi (position, rotation, vie, etc...)
    update(infoPlayer) {
        // Position
        this.ennemi.position.x = infoPlayer.x;
        this.ennemi.position.y = infoPlayer.y;
        this.ennemi.position.z = infoPlayer.z;

        // Rotation
        this.ennemi.rotation.x = infoPlayer.rx;
        this.ennemi.rotation.y = infoPlayer.ry;
        this.ennemi.rotation.z = infoPlayer.rz;

        // rotation de la tourelle et du cannon
        this.meshTourelle.rotation.y = infoPlayer.tourelleRy;
        this.meshCannon.rotation.x = infoPlayer.cannonRx;
        this.meshCannon.rotation.y = infoPlayer.cannonRy;

        // Vie
        this.infoPlayer.life = infoPlayer.life;

        /*
        if (infoPlayer.fire === true && this.tireEnable === true) {
            this.tireEnable = false;
            //this.tirer;
            setTimeout(() => {
                this.tireEnable = true;
            }, 3000);
        }
        */
    }


    // Supprime l'ennemi
    delete() {
        this.ennemi.dispose();
    }
}