function validateChampEmail(obj, champInfo) {
    var Estok = 1;
    var idChampSignalisation =  document.getElementById(champInfo);
  
    if(obj.value.length < 2){ 
      idChampSignalisation.innerHTML = "Veuillez saisire votre email.";
      idChampSignalisation.classList.add('error-visible');
      Estok = 0;
    }
    else if (validateEmail(obj.value) === false) {
      idChampSignalisation.innerHTML = "L'adresse mail saisie est incorrecte.";
      idChampSignalisation.classList.add('error-visible');
      Estok = 0;
    } else {
      idChampSignalisation.innerHTML = "";
      idChampSignalisation.classList.remove('error-visible');
    }
    return Estok;
  }

  // test la validité d'une adresse mail passée en paramètre (regex)
function validateEmail(mail) 
{
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))   return (true);
  else return (false);
}


// fonction permettant de verifier si la valeur passée en paramètre ne contient que des caractère de a à z (ctrl insensible a la casse)
function isSaisiAlpha(valAtester) {
    //  ^[a-z0-9]+$/i
    //^         Start of string
    //[a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
    //+         one or more times (change to * to allow empty string)
    //$         end of string
    ///i        case-insensitive
    return /^[a-z]+$/i.test(valAtester);
  }


  // fonction permettant de controler les champs texte simples (nom et prénom) : taille + regex
function CtrlChampTxtStd(objAVerif, suffixeChampInfo, lib) {

    var idChampSignalisation =  document.getElementById('error-' + suffixeChampInfo); //error-nom ou error-prenom
    var Estok = 1;

    if(objAVerif.value.length < 2){ 
      idChampSignalisation.innerHTML = "Veuillez entrer 2 caractères ou plus pour le " + lib + ".";
      idChampSignalisation.classList.add('error-visible');
      Estok = 0;
    }
    if(Estok==1) {
      var retTestAlpha = isSaisiAlpha(objAVerif.value);
      if(retTestAlpha === false) {
        idChampSignalisation.innerHTML = "Le " + lib + " ne doit contenir que des caractères alphabétiques";//lib.substr(0,1).toUpperCase()+lib.substr(1)
        idChampSignalisation.classList.add('error-visible');
        Estok = 0;
      }
    }
    if(Estok==1) {
      idChampSignalisation.innerHTML = "";
      idChampSignalisation.classList.remove('error-visible');
    }
    return Estok;   
  }


// controle nom
let lenom = document.getElementById('nom');
lenom.addEventListener('blur', (event) => {
  CtrlChampTxtStd(lenom, 'nom', 'nom');
});
// controle prénom
let leprenom = document.getElementById('prenom');
leprenom.addEventListener('blur', (event) => {
  CtrlChampTxtStd(leprenom, 'prenom', 'prénom');
});

// controle mail
let lemail = document.getElementById('mail');
lemail.onblur = function() {
  validateChampEmail(lemail, 'error-mail');
};



function validate(){
    var formValide = 1;
  
    // controle nom
    const last = document.getElementById('nom');
    retourFct = CtrlChampTxtStd(last, 'nom', 'nom');
    if(retourFct == 0) formValide = 0;

    // controle prénom
    const first = document.getElementById('prenom');
    retourFct = CtrlChampTxtStd(first, 'prenom', 'prénom');
    if(retourFct == 0) formValide = 0;
  
    // controle email
    const email = document.getElementById('mail');
    retourFct = validateChampEmail(email, 'error-mail');
    if(retourFct == 0) formValide = 0;

    if (formValide == '0') {
      return false;
    }
    else alert ('Vos informations ont bien été prises en compte, merci');
    return formValide;
  }