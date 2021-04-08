

export default class Parametre {

    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        this.divFps = document.getElementById("fps");
    }


    showFps(fps) {
        this.divFps.innerHTML = "fps : " + fps;
    }
}