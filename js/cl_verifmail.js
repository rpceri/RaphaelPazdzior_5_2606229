class Cl_verifMail {
  
  // test la validité d'une adresse mail passée en paramètre (regex)
  validateEmail(mail) {
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))   return (true)
   else return (false)
  }

  // permet de verifier si la chaine passée en paramètre est bien un mail (ctrl regex), le second paramètre est l'id du champ permettant d'afficher l'erreur à l'utilisateur
  CtrlChampEmail(objAVerif, champInfo) {
    var Estok = 1
    var idChampSignalisation =  document.getElementById(champInfo)
  
    if(objAVerif.value.length < 2){ 
      idChampSignalisation.innerHTML = "Veuillez saisire votre email."
      idChampSignalisation.classList.add('error-visible')
      Estok = 0
    }
    else if (this.validateEmail(objAVerif.value) === false) {
      idChampSignalisation.innerHTML = "L'adresse mail saisie est incorrecte."
      idChampSignalisation.classList.add('error-visible')
      Estok = 0
    } else {
      idChampSignalisation.innerHTML = ""
      idChampSignalisation.classList.remove('error-visible')
    }
    return Estok
  }


  // permet de verifier si la valeur passée en paramètre ne contient que des caractère de a à z (ctrl insensible a la casse)
  isSaisiAlpha(valAtester) {
    //  ^[a-z0-9]+$/i
    //^         Start of string
    //[a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
    //+         one or more times (change to * to allow empty string)
    //$         end of string
    ///i        case-insensitive
    return /^[a-z]+$/i.test(valAtester)
  }


  // permet de controler les champs texte simples (nom et prénom) : taille + regex
  CtrlChampTxtStd(objAVerif, suffixeChampInfo, lib) {

    var idChampSignalisation =  document.getElementById('error-' + suffixeChampInfo) //error-nom ou error-prenom
    var Estok = 1

    if(objAVerif.value.length < 2){ 
      idChampSignalisation.innerHTML = "Veuillez entrer 2 caractères ou plus pour le " + lib + "."
      idChampSignalisation.classList.add('error-visible')
      Estok = 0
    }
    if(Estok==1) {
      var retTestAlpha = this.isSaisiAlpha(objAVerif.value)
      if(retTestAlpha === false) {
        idChampSignalisation.innerHTML = "Le " + lib + " ne doit contenir que des caractères alphabétiques"//lib.substr(0,1).toUpperCase()+lib.substr(1)
        idChampSignalisation.classList.add('error-visible')
        Estok = 0
      }
    }
    if(Estok==1) {
      idChampSignalisation.innerHTML = ""
      idChampSignalisation.classList.remove('error-visible')
    }
    return Estok   
  }

  // ajout écouteur sur blur pour chaque champ du formulaire, afin de vérifier valilidté de la saisie et d'afficher message d'erreur en cas de pb
  ajoutEcouteursSurChamps() {
    // controle prénom
    let leprenom = document.getElementById('prenom')
    leprenom.addEventListener('blur', (event) => {
      this.CtrlChampTxtStd(leprenom, 'prenom', 'prénom')
    })

    // controle nom
    let lenom = document.getElementById('nom')
    lenom.addEventListener('blur', (event) => {
      this.CtrlChampTxtStd(lenom, 'nom', 'nom')
    })

    // controle mail
    let lemail = document.getElementById('mail')
    lemail.addEventListener('blur', (event) => {
      this.CtrlChampEmail(lemail, 'error-mail')
    })
  }

  // verifie si tout les champs sont bien renseignés, retoune false en cas de problème, sinon true
  verifValiditeInfosForm(){
    var formValide = 1
  
    // controle nom
    const last = document.getElementById('nom')
    var retourFct = this.CtrlChampTxtStd(last, 'nom', 'nom')
    if(retourFct == 0) formValide = 0

    // controle prénom
    const first = document.getElementById('prenom')
    var retourFct = this.CtrlChampTxtStd(first, 'prenom', 'prénom')
    if(retourFct == 0) formValide = 0
  
    // controle email
    const email = document.getElementById('mail')
    var retourFct = this.CtrlChampEmail(email, 'error-mail')
    if(retourFct == 0) formValide = 0

    if (formValide == '0') {
      return false
    }
    else {
     return true
    }
  }

}