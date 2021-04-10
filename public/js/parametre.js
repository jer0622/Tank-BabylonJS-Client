

export default class Parametre {

    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        // Div pour l'affichage des fps
        this.divFps = document.getElementById("fps");

        // Ajout de listener pour vérrouiller la souris dans le jeu
        this.lockPointer();
    }

    // Actualise l'affichage des fps
    showFps(fps) {
        this.divFps.innerHTML = fps + " fps";
    }


    // Ajout de listener pour vérrouiller la souris dans le jeu
    lockPointer() {
        this.scene.onPointerDown = () => {
            if (!this.scene.alreadyLocked) {
                this.canvas.requestPointerLock();
            }
        }

        document.addEventListener("pointerlockchange", () => {
            let element = document.pointerLockElement || null;
            if (element) {
                this.scene.alreadyLocked = true;
            }
            else {
                this.scene.alreadyLocked = false;
            }
        })
    }
}