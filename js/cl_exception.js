// class permettant de gérer les erreurs (par exemple si le json ne ocntient pas l'info attendu)
// ex : if (photographers === undefined) throw new Cl_ExceptionUtilisateur("Données sur les photographes introuvables.")
// inspiration :  https://developer.mozilla.org/fr/docs/orphaned/Web/JavaScript/Guide/Control_flow_and_error_handling
// l'instenciation de cet class a pour effet d'ajouter une div dans le div ayant l'id "main" et d'y afficher une info sur l'erreur 

// On crée le constructeur pour cet objet
class Cl_ExceptionUtilisateur {
  message  // contiendra une precision sur l'erreur

	constructor(message) {
    this.message = message

    // on créé un div qu'on va mettre dans le header pour afficher le problème à l'utilisateur
    const newElt = document.createElement("div")
    newElt.innerHTML = `${this.message} Veuillez nous excuser pour la gêne occasionnée.`
    let elt = document.querySelector("#main")
    elt.appendChild(newElt)
  }
}