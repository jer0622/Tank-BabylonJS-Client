import Tank from "./tank.js";
import {loadMap} from "./map.js";
import Parametre from "./parametre.js"


let canvas;
let engine;
let scene;


// Page entièrement chargé, on lance le jeu
document.addEventListener("DOMContentLoaded", async function() {
    let divButton = document.getElementById("buttonPlay");
    divButton.onclick = async () => {
        let username = document.getElementById("username");
        if (username.value != "") {
            let divHome = document.getElementById("HOME").style.display = "none";
            let divGame = document.getElementById("GAME").style.display = "block";
            await startGame("renderCanvas");
        }
        else {
            alert("Veuillez saisir votre nom d'utilisateur")
        }
    }
}, false);



async function startGame(canvasId) {
    // Canvas et Engine défini ici
    canvas = document.getElementById(canvasId);
    engine = new BABYLON.Engine(canvas, true);

    // Initialise la scene
    scene = createScene();

    // Activation de la physique
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.CannonJSPlugin());

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
        parametre.updateParametre(engine.getFps().toFixed());

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
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;
    return scene;
}