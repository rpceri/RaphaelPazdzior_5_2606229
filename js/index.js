 /*
recupere les informations des photographes
Retuurne un tableau contenant autant d'occurences que de photographes dans le json
async : définit une fonction asynchrone qui renvoie un objet AsyncFunction. asynchrone = s'exécute de façon asynchrone grâce à la boucle d'évènement en utilisant une promesse (Promise) comme valeur de retour.
await : opérateur await permet d'attendre la résolution d'une promesse (Promise). utilisé au sein d'une fonction asynchrone (définie avec l'instruction async).
nb : CORS =« partage de ressources entre origines multiples
then retourne un tableau d'objet issu du json
*/
    const getDataOfJson = async () =>
        await fetch("./json/FishEyeData.json", { mode: "no-cors" })
            .then((ressource) => ressource.json())
            .catch((erreur) => console.log("Erreur lord du fetch du json", erreur));
     
    // renseigne la partie les-photographes avec les infos contenues dans photographersRecup
    const displayDataOfList = async (photographersRecup) => {
        const element = document.querySelector(".les-photographes");
        element.innerHTML = "";
        photographersRecup.forEach((photographe_particulier) => {
            let photographe_fiche = new Cl_photographe(photographe_particulier); // utilistion de la classe Cl_photographe
            //console.log(photographe_particulier);
            element.innerHTML += photographe_fiche.infosPhotographe; // element
        });
    };

    // trie des photographes : retourne eulement les photographes correspondant au tag, trié grace à .filter
     const trieParTag = (tagRetenu, photographes) => {
        if (tagRetenu === "all") return photographes;
        else return photographes.filter((photographeFiltre) => photographeFiltre.tags.includes(tagRetenu)); // tags.includes permet de tie en fct de  : "tags": ["portrait", "events", "travel", "animals"],
    };

    // fonction permettant de gérer les filtres et d'afficher chaque photogrpahe 
    const mainFuntion = async () => {
        const { photographers } = await getDataOfJson(); // retourne automatiquement un tab d'objet de ce qu'il y a dans le json au niveau de photographers, si on avait voulu media, il aaurait suffit de mettre media
        //console.log(photographers); 
        displayDataOfList(photographers);

        const $listeFiltres = document.querySelector(".header__filters__navigation");
        const $tags = $listeFiltres.querySelectorAll("li");

        $tags.forEach((tag) => { // parcours tout les li pour leur ajouter l'evenement click
            tag.addEventListener("click", function () {
                const photographeTri = trieParTag(tag.textContent.replace(/(\s|\#)+/g, "").toLowerCase(), photographers);// textContent retourne le contenu d'un noeud
                displayDataOfList(photographeTri);
            });
            tag.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    // a faire : idem ci dessus
                }
            });
        });
    };

    mainFuntion();
    