# DS4H-Assignment-2

## Auteur :
Jeremy HIRTH DAUMAS

## Commandes :
 - Déplacer le char avec les touches Z, Q, S, D.
 - Déplacer la tourelle et le cannon du char avec la souris.
 - Tirer avec la touche ESPACE.

## Résumé :
Le jeu est disponible sur heroku [ici](https://tank-client-babylonjs.herokuapp.com/).

La version actuelle du jeu implémente un multijoueur simple (sans prédiction, ni réconciliation) qui permet pour le moment de voir se déplacer les chars ennemis, on voit également pivoter la tourelle et le cannons de ceux-ci. Coté fonctionnalité on a la possibilité de mettre le jeu en plein écran ou de revenir à l’écran d’accueil quand on le souhaite. Il y a également un bouton paramètre qui récapitule les commandes du jeu, et qui permet de changer des options du jeu, comme le volume générale, la luminosité, ou encore la sensibilité de la souris.

Pour les fonctionnalités manquantes, il y a la collision avec les obus vis-à-vis des autres chars (ce qui permettrai de de pouvoir les détruire et donc d’avoir un vrai but dans le jeu). Il faudrait aussi un moteur physique ce qui permettrait de rendre les déplacements du char plus réelle. Et enfin faire une vrai map pour avoir un bon gameplay (notamment l’impossibilité de sortir de celle-ci). Je compte prochainement implémenter ces fonctionnalités.

En vous souhaitant une bonne game :-)

## Démonstration
<p align="center">
<img src="https://i.ibb.co/cL9JV9z/D-monstration.gif" alt="Démonstration du jeu" width="600px">
</p>

## Sources des objets blender utilisés :
 - [Pont](https://www.turbosquid.com/fr/3d-models/free-max-model-bridge/789884)
 - [Tank](https://free3d.com/3d-model/tank-144247.html)

## Autre aide
 - [Playground d’un fort de pirate](https://playground.babylonjs.com/#C21DGD#2) pour implémenter le tire d’un canon.
