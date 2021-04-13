export default class Parametre {

    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        // On récupère les div du document
        this.divFps = document.getElementById("fps");
        this.divFullScreen = document.getElementById("fullScreen");
        this.divSettings = document.getElementById("settings");
        this.divHome = document.getElementById("home");
        
        // Si le mode plei écran est activé
        this.fullScreen = false;

        // Ajout de listener
        this.#listenerLockPointer();
        this.#listenerFullScreen();
    }

    // Actualise l'affichage des fps
    showFps(fps) {
        this.divFps.innerHTML = fps + " fps";
    }


    // Ajout de listener pour vérrouiller la souris dans le jeu
    #listenerLockPointer() {
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

    // Ajout de onClick pour activer ou désactiver le mode plein écran
    #listenerFullScreen() {
        this.divFullScreen.onclick = () => {
            if (document.body.requestFullscreen) {
                if (this.fullScreen) {
                    document.exitFullscreen();
                    this.fullScreen = false;
                    this.divFullScreen.setAttribute("id", "fullScreen");
                }
                else {
                    document.body.requestFullscreen();
                    this.fullScreen = true;
                    this.divFullScreen.setAttribute("id", "minimisedScreen");
                }
            }
        }
    }
}