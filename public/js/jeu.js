import Tank from "./tank.js";
import {loadMap} from "./map.js";
import Parametre from "./parametre.js"


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

    // Activation de la physique
    scene.enablePhysics();

    // On charge la map
    var map = await loadMap(scene);

    // On crée le tank (le joueur principale)
    let tank = new Tank();
    await tank.build(scene, canvas);

    // Initialise les paramètre (affichage des fps, jeu en pause, etc...)
    let parametre = new Parametre(scene, canvas);

    
    // Permet au jeu de tourner
    engine.runRenderLoop(() => {
        // On récupère le deltaTime
        let deltaTime = engine.getDeltaTime();

        // Actualisation des fps
        parametre.showFps(engine.getFps().toFixed());

        // Action du tank
        tank.checkActionTank(deltaTime);


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
    scene.gravity = new BABYLON.Vector3(0, -10, 0);
    scene.collisionsEnabled = true;
    return scene;
}