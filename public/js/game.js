import Tank from "./tank.js";
import {loadMap} from "./map.js";

let canvas;
let engine;
let scene;


// Page entièrement chargé, on lance le jeu
document.addEventListener("DOMContentLoaded", async function() {
    await startGame("renderCanvas");
}, false);


async function startGame(canvasId) {
    // Canvas et Engine défini ici
    canvas = document.getElementById(canvasId);
    engine = new BABYLON.Engine(canvas, true);

    // Initialise la scene
    scene = createScene();

    // On charge la map
    var map = loadMap(scene);

    // On crée le tank (le joueur principale)
    let tank = new Tank();
    await tank.build(scene, canvas);
    


    // Permet au jeu de tourner
    engine.runRenderLoop(() => {
        // On récupère le deltaTime
        let deltaTime = engine.getDeltaTime();

        // Déplace le joueur (le tank)
        tank.checkMoveTank(deltaTime);


        // Anime le tank en fonction des ses déplacement
        tank.animateTank();



        scene.render();
    });


    // Ajuste la vue 3D si le fenetre est agrandi ou diminué
    window.addEventListener("resize", function() {
        if (engine) {
            engine.resize();
        }
    }, false);
}


// Initialise la scene
function createScene(engine) {
    let scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(4, 0.9, 0.9);
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;
    return scene;
}