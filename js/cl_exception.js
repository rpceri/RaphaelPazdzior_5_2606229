//inspi https://developer.mozilla.org/fr/docs/orphaned/Web/JavaScript/Guide/Control_flow_and_error_handling

// On crée le constructeur pour cet objet
function ExceptionUtilisateur(message) {
    //this.message = message inutile maintenant

    // on créé un div qu'on va mettre dans le hader pour afficher le problème à l'utilisateur
    const newElt = document.createElement("div")
    newElt.innerHTML = `${this.message} Veuillez nous excuser pour la gêne occasionnée.`
    let elt = document.querySelector("main")
    elt.appendChild(newElt)
  }