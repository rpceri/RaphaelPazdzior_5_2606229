 /*
recupere les informations des photographes
Return un tableau contenant autant d'occurance que de photographe dans le json
async : définit une fonction asynchrone qui renvoie un objet AsyncFunction. asynchrone = s'exécute de façon asynchrone grâce à la boucle d'évènement en utilisant une promesse (Promise) comme valeur de retour.
await : opérateur await permet d'attendre la résolution d'une promesse (Promise). utilisé au sein d'une fonction asynchrone (définie avec l'instruction async).
*/
        const getData = async () =>
        await fetch("../json/FishEyeData.json", { mode: "no-cors" })
            .then((res) => res.json())
            .catch((err) => console.log("An error occurs when fetching photographers", err));
     
    // renseigne la partie les-photographes avec les info retournées par le json dans photographer
    const displayData = async (photographers) => {
        const element = document.querySelector(".les-photographes");
        element.innerHTML = "";
        photographers.forEach((photographe_particulier) => {
            let photographe_fiche = new Cl_photographe(photographe_particulier); // utilistion de la classe Cl_photographe
            //console.log(photographe_particulier);
            element.innerHTML += photographe_fiche.infosPhotographe; // element
        });
    };

    // trie des photographes
     const trieParTag = (tag, photographers) => {
        if (tag === "all") {
            return photographers;
        } else {
            return photographers.filter((photographer) => photographer.tags.includes(tag));
        }
    };

    // fonction permettant de gérer les filtres et d'afficher chaque photogrpahe 
    const afficheInfos = async () => {
        const $filterList = document.querySelector(".header__filters__navigation");
        const $tags = $filterList.querySelectorAll("li");
        const { photographers } = await getData();
        $tags.forEach((tag) => {
            tag.addEventListener("click", function () {
                const photographetri = trieParTag(
                    tag.textContent.replace(/(\s|\#)+/g, "").toLowerCase(),
                    photographers
                );
                displayData(photographetri);
            });
            tag.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    // a faire : idem ci dessus
                }
            });
        });

        displayData(photographers);
    };

    afficheInfos();
    