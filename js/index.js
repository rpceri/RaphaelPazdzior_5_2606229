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
            .catch((erreur) => console.log("Erreur lors du fetch du json", erreur))
     
    // renseigne la partie les-photographes avec les infos contenues dans photographersRecup
    const displayDataOfList = async (photographersRecup) => {
        const element = document.querySelector(".les-photographes")
        element.innerHTML = ""
        photographersRecup.forEach((photographe_particulier) => {
            let ObjPhotographe = new Cl_photographe(photographe_particulier) // utilistion de la classe Cl_photographe
            //console.log(photographe_particulier)
            element.innerHTML += ObjPhotographe.infosPhotographe // méthode retournant les informations particulières d'un photograph
        })
    }

    // trie des photographes : retourne seulement les photographes correspondant au tag, trié grace à .filter
     const trieParTag = (tagRetenu, photographes) => {
        if (tagRetenu === "tous") return photographes
        else return photographes.filter((photographeFiltre) => photographeFiltre.tags.includes(tagRetenu)) // tags.includes permet le trie en fct de  : "tags": ["portrait", "events", "travel", "animals"],
    }

    // fonction permettant d'ajouter les evenements click et keypress aux tags, la fonction se rapelle toutes les "tempoRelance"" secondes
    // fléché => : strictement égale à function assoEvenementsAuxTags(photographers, tempoRelance) *accollade ouvrante*
    assoEvenementsAuxTags = (photographers, tempoRelance) => {
        let tags = document.querySelectorAll(".tag-list-interractive > li")
        let cpt=0
        //console.log('fct assoEvenementsAuxTags lancée @ ' + Date.now())

        tags.forEach((tag) => { // parcours tout les li de tag-list-interractive (dont header__filters__navigation) pour leur ajouter l'evenement click
            cpt++
            // si le tage n'a pas encors les écouteurs prévus on va les associer
            if(tag.dataset.evenementajoute === undefined) {
                tag.dataset.evenementajoute = 'true'
                //console.log('addEventListener ajouté sur tag numero ' + cpt)
                let photographeTri = trieParTag(tag.textContent.replace(/(\s|\#)+/g, "").toLowerCase(), photographers)// textContent retourne le contenu d'un noeud
                tag.addEventListener("click", function () {                
                    displayDataOfList(photographeTri) // renseigne la partie les-photographes avec les infos contenues dans photographersRecup
                })
                tag.addEventListener("keypress", function (e) {
                    if (e.key === "Enter") displayDataOfList(photographeTri) // renseigne la partie les-photographes avec les infos contenues dans photographersRecup
                })
            }
            //else console.log('addEventListener deja ajouté sur tag numero' + cpt)
        })
        //setTimeout(assoEvenementsAuxTags(photographers),tempoRelance) attention cela ne marche pas du tout, ca produit de gros probème il faut faire ainsi :
        setTimeout(function() {
            assoEvenementsAuxTags(photographers, tempoRelance);
        },tempoRelance)
    }


    // lance la fonction gérant le bouton permettant le retour vers le haut :
    // permet d'afficher le lien "aller au contenu" quand la page est scrollée, inspi : http://doc.eklablog.com/div-qui-apparait-lorsqu-on-scroll-down-une-certaine-hauteur-topic204818
    gestionbtRetourHaut= ()=> {
        document.addEventListener('scroll', function(e) {
            let style = 'none';
            if (document.documentElement.scrollTop != 0) style = 'block'; // ocument.documentElement.scrollTop contient la valeur du scroll => 0 si page pas scrollée
            document.querySelector(".lien-cache").style.display = style
        })
    }

    // fonction principale permettant d'afficher chaque photogrpahe , de lancer la fonction gérant le bouton permettant le retour vers le haut et de gérer les filtres des tags
    const mainFuntion = async () => {
        let { photographers } = await getDataOfJson() // retourne automatiquement un tab d'objet de ce qu'il y a dans le json au niveau de photographers, si on avait voulu media, il aurait suffit de mettre media
        //console.log(photographers)
        if (photographers === undefined) throw new ExceptionUtilisateur("Données sur les photographes introuvables.")
        displayDataOfList(photographers) // renseigne la partie les-photographes avec les infos contenues dans photographersRecup
        gestionbtRetourHaut() // lance la fonction gérant le bouton permettant le retour vers le haut
        assoEvenementsAuxTags(photographers, 2000) // fonction permettant d'ajouter les evenements click et keypress aux tags, la fonction se rapelle toutes les "tempoRelance"" secondes
    }
   
    mainFuntion()


    