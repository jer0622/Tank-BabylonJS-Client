export default class Parametre {

    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        // On récupère les div du document
        this.divFps = document.getElementById("fps");
        this.divFullScreen = document.getElementById("fullScreen");
        this.settings = document.getElementById("settingsPanel");
        
        this.divHome = document.getElementById("home");
        
        // Si le mode plei écran est activé
        this.divFullScreen.enable = false;

        // Ajout de listener
        this.#listenerLockPointer();
        this.#listenerFullScreen();
        this.#listenerSettings();
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
                if (this.divFullScreen.enable == "undefined" || !this.divFullScreen.enable) {
                    document.body.requestFullscreen();
                    this.divFullScreen.enable = true;
                    this.divFullScreen.setAttribute("id", "minimisedScreen");
                }
                else {
                    document.exitFullscreen();
                    this.divFullScreen.enable = false;
                    this.divFullScreen.setAttribute("id", "fullScreen");
                }
            }
        }
    }

    #listenerSettings() {
        let camera = this.scene.getCameraByName("TankRotateCamera");

        // Bouton pour ouvrir les paramètres
        let divSettings = document.getElementById("settings");
        divSettings.onclick = () => {
            if (divSettings.enable == "undefined" || !divSettings.enable) {
                this.settings.style.display = "block";
                divSettings.enable = true;
                camera.detachControl(this.canvas);
            }
            else {
                this.settings.style.display = "none";
                divSettings.enable = false;
                camera.attachControl(this.canvas, false);
            }
        }
        // Bouton pour fermer les paramètres
        let closeButtonSettings = document.getElementById("closeButtonSettings");
        closeButtonSettings.onclick = () => {
            this.settings.style.display = "none";
            divSettings.enable = false;
            camera.attachControl(this.canvas, false);
        }

        let buttonControle = document.getElementById("buttonControle");
        let buttonOption = document.getElementById("buttonOption");
        let selectedButton = document.getElementById("buttonSelected");
        let divControle = document.getElementById("divControle");
        let divOption = document.getElementById("divOption");

        buttonControle.onclick = () => {
            buttonControle.style.color = "#158EC6";
            buttonOption.style.color = "#E9E4C6";
            selectedButton.style.float = "none";
            divControle.style.display = "block";
            divOption.style.display = "none";
        }

        buttonOption.onclick = () => {
            buttonControle.style.color = "#E9E4C6";
            buttonOption.style.color = "#158EC6";
            selectedButton.style.float = "right";
            divControle.style.display = "none";
            divOption.style.display = "block";
        }
    }
}