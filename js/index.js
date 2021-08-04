 /*
recupere les informations des photographes
Retourne un tableau contenant autant d'occurences que de photographes dans le json
async : définit une fonction asynchrone qui renvoie un objet AsyncFunction. asynchrone = s'exécute de façon asynchrone grâce à la boucle d'évènement en utilisant une promesse (Promise) comme valeur de retour.
await : opérateur await permet d'attendre la résolution d'une promesse (Promise). utilisé au sein d'une fonction asynchrone (définie avec l'instruction async).
nb : CORS =« partage de ressources entre origines multiples
then retourne un tableau d'objet issu du json
*/
const getDataOfJson = async () =>
    await fetch("./json/FishEyeData.json", { mode: "no-cors" })
        .then((ressource) => ressource.json())
        .catch(function(erreur) { console.log("Erreur lors du fetch du json" + erreur.message)
        })

// renseigne la partie les-photographes avec les infos contenues dans photographersRecup
const AfficheLesPhotographes = (photographers, letag='') => {
    let photographersTri = photographers
    if(letag != '') photographersTri = trieParTag(letag.replace(/(\s|\#)+/g, "").toLowerCase(), photographers) // trie des photographes : retourne seulement les photographes correspondant au tag, trié grace à .filter

    let buffer = ''
    photographersTri.forEach((photographe_particulier) => {
        let ObjPhotographe = new Cl_photographe(photographe_particulier) // utilistion de la classe Cl_photographe
        //console.log(photographe_particulier)
        buffer += ObjPhotographe.infosPhotographe // méthode retournant les informations particulières d'un photographe
    })
    document.querySelector(".les-photographes").innerHTML = buffer

    assoEvenementsAuxTags(photographers) // fonction permettant d'ajouter les evenements click et keypress aux tags
}

// trie des photographes : retourne seulement les photographes correspondant au tag, trié grace à .filter
const trieParTag = (tagRetenu, photographes) => {
    if (tagRetenu === "tous") return photographes
    else return photographes.filter((photographeFiltre) => photographeFiltre.tags.includes(tagRetenu)) // tags.includes permet le trie en fct de  : "tags": ["portrait", "events", "travel", "animals"],
}


// fonction permettant d'ajouter les evenements click et keypress aux tags
// fléché => : strictement égale à function assoEvenementsAuxTags(photographers, tempoRelance) *accollade ouvrante*
assoEvenementsAuxTags = (photographers, tempoRelance) => {
    let tags = document.querySelectorAll(".tag-list-interractive > li")

    tags.forEach((tag) => { // parcours toutes les li de tag-list-interractive (dont header__filters__navigation) pour leur ajouter l'evenement click
        // si le tag n'a pas encore les écouteurs prévus on va les associer
        if(tag.dataset.evenementajoute === undefined) {
            tag.dataset.evenementajoute = 'true'
           // console.log('addEventListener ajouté sur tag numero ' + cpt)
            let letag = tag.textContent
            tag.addEventListener("click", function () {                
                AfficheLesPhotographes(photographers, letag)
            })
            tag.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    AfficheLesPhotographes(photographers, letag)
                }
            })
        }
        //else console.log('addEventListener deja ajouté sur tag numero' + cpt)
    })
}


// fonction gérant le bouton permettant le retour vers le haut :
// permet d'afficher le lien "aller au contenu" quand la page est scrollée, inspi : http://doc.eklablog.com/div-qui-apparait-lorsqu-on-scroll-down-une-certaine-hauteur-topic204818
gestionbtRetourHaut= ()=> {
    document.addEventListener('scroll', function(e) {
        let style = 'none';
        if (document.documentElement.scrollTop != 0) style = 'block'; // document.documentElement.scrollTop contient la valeur du scroll => 0 si page pas scrollée
        document.querySelector(".lien-cache").style.display = style
    })
}

// fonction principale permettant d'afficher chaque photographe , de lancer la fonction gérant le bouton permettant le retour vers le haut et de gérer les filtres des tags
initIndex = async () => {
    let { photographers } = await getDataOfJson() // retourne automatiquement un tab d'objet de ce qu'il y a dans le json au niveau de photographers
    //console.log(photographers)
    if (photographers === undefined) throw new Cl_ExceptionUtilisateur("Données sur les photographes introuvables.")
    
    let chainesParametres = new URLSearchParams(document.location.search.substring(1)) // récup. la chaine de parmètres passés dans l'url (nécessaire si l'utilisation a cliqué sur le tag d'une paghe de détail)
    let tagParametre = chainesParametres.get("tag") // permet de recuperer précisément tag
    if(tagParametre !== undefined && tagParametre != null) AfficheLesPhotographes(photographers, tagParametre)
    else AfficheLesPhotographes(photographers) // renseigne la partie les-photographes avec les infos contenues dans photographers, cas par défaut

    gestionbtRetourHaut() // fonction gérant le bouton permettant le retour vers le haut
}

initIndex()


