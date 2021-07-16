// trie des medias (photo ou video ), retourne le  tableau des média trié 
const filterByOption = (mediaGallery, option) => { // mediaGallery : array option : chaine
	switch (option) {
		case "date":
			return mediaGallery.sort((a, b) => {
				return new Date(b.date) - new Date(a.date)
			})
		case "titre":
			return mediaGallery.sort((a, b) => a.title.localeCompare(b.title))
		default: // popularite par défaut
			return mediaGallery.sort((a, b) => {
				return b.likes - a.likes
			})
	}
}

const $conteneurGalleryPhtographe = document.querySelector(".detail-photographe__gallery")
var DonneesPhotographeObj = '' // on déclare l'objet ici ainsi il servira a plusieurs endroits, il sera instancié par afficheInfosPhotpgraphe

const getDataOfJson = async () =>
await fetch("./json/FishEyeData.json", { mode: "no-cors" })
    .then((ressource) => ressource.json())
    .catch((erreur) => console.log("Erreur lors du fetch du json", erreur))


// affiche les informations d'un photographe : fonction asynchrone, on met donc async devant
async function afficheInfosPhotpgraphe() {
	let {media, photographers} = await getDataOfJson()  // retourne automatiquement 2 tab d'objet de ce qu'il y a dans le json au niveau de media et de photographers
	let chainesParametres = new URLSearchParams(document.location.search.substring(1)) // permet de récuperer la chaine de parmètres passés dans l'url
	let idPhotographe = chainesParametres.get("id") // permet de recuperer précisément l'id

    DonneesPhotographeObj = photographers.find(
		(photographer) => photographer.id == idPhotographe // c'est ainsi qu'on récupère les infos du photographe souhaité (objet)
	)
    let ObjPhotographe = new Cl_photographe(DonneesPhotographeObj) // instanciation de la class photographe

	document.title = document.title + ' : ' + ObjPhotographe.getNomPhotoGraphe // mise à jour du title de la page en ajoutant le nom du photographe

	let mediasPersos = media.filter((media) => media.photographerId == idPhotographe) // c'est ainsi qu'on récupère les médias du photographe souhaité (objet)
	updateMediasPersos(mediasPersos) // afiche ou met à jour la gallerie

	let photographeInfosGen = document.querySelector(".detail-photographe__info")
	let photographeInfosAutres = document.querySelector(".detail-photographe__infos-autres")
	photographeInfosGen.innerHTML += ObjPhotographe.infoDetailPhotographe  // retourne les informations d'un photographe pour la page de détail
	photographeInfosAutres.innerHTML += ObjPhotographe.infosDetailAutrePhotographe  // retourne le nombre de like et le tarif d'un photographe pour la page de détail
}

//affiche ou met à jour la gallerie, appelé par afficheInfosPhotpgraphe à 2 endroit, c'est pour cela qu'on fait une fct à part
function updateMediasPersos(gallery) {
	gallery.forEach((media) => {
        $conteneurGalleryPhtographe.innerHTML += retourneMediaHtml(media) //retourne une string avec une portion de code html pertmettant l'affichage du média (image ou vidéo)
	})
}


// en fonction du media passé en param,détermine si il s'agit d'une image ou d'un video en fonction de la présence de ces champs dans le json
//retourne une string avec une portion de code html
function  retourneMediaHtml(mediaParam) {
    let image = mediaParam.image
    let video = mediaParam.video
    let description = mediaParam.description
    let title = mediaParam.title
    let photographerId = mediaParam.photographerId
    let likes = mediaParam.likes

    let codeHtml = ''
    if (image != undefined) codeHtml = `<img class="detail-photographe__gallery__media focus__element-secondary" loading="lazy" tabindex="5" src="./medias/${photographerId}/${image}" alt="${description}" />`
    else if (video != undefined)  codeHtml = `<video controls class="detail-photographe__gallery__media focus__element-secondary" tabindex="5">
                                                        <source src="./medias/${photographerId}/${video}"/>
                                            </video>`
    else throw `Média non pris en charge`

    return `
    <figure class="detail-photographe__gallery__card" aria-label="${title} closeup view">
        ${codeHtml}
        <footer class="detail-photographe__gallery__media__footer">
            <figcaption class="detail-photographe__gallery__media__footer__figcaption">${title}</figcaption>
            <div class="detail-photographe__gallery__media__footer__like-section">
                <p class="detail-photographe__gallery__media__footer__like-section-counter">${likes}</p>
                <button class="detail-photographe__gallery__media__footer__like-section-button focus__element-secondary" title="J'aime" tabindex="5" aria-label="likes"><i class="far fa-heart" aria-hidden="true"></i></button>
            </div>
        </footer>
    </figure>`
}




 // permet de gérer le clic sur le bouton like (incrémente ou décrémente le compte en foncitons des actions passées
function gestionLikeDunMedia() {
    // memorise dans une NodList chaque div de la page ayant la class "detail-photographe__gallery__media__footer__like-section"
	let nodeListBlocLike = document.querySelectorAll(".detail-photographe__gallery__media__footer__like-section")
    //console.log($nodListBlocLike)

	nodeListBlocLike.forEach(function (i) {
        // pour chaque div  :
		i.addEventListener("click", function () {
			let blocContenantNbLike = i.querySelector(".detail-photographe__gallery__media__footer__like-section-counter") // p ou se trouve le nombre de like
			let buttonLike = i.querySelector('.detail-photographe__gallery__media__footer__like-section-button') // bouton de la page ayant la class "detail-photographe__gallery__media__footer__like-section" (bouton like)
			let buttonLikeIcon = i.querySelector(".fa-heart") // icon dont la class sera modifiée en fct du choix
			let nombreDelike = Number(blocContenantNbLike.textContent) // recuperation du nombre de like de l'objet courant
            //console.log(likeSum)

            let iSliked = i.dataset.iSliked === "true" //permet de savoir si l'utilisateur a déjà liké ou non, dataset : depuis HTML5, permet  de stocker infos dans des balises html
             
			if (iSliked) { // cas ou l'utilisateur n'aime plus
                blocContenantNbLike.innerHTML = nombreDelike-1

				majLikeTotal() // met à jour le nombre de like total du photographe en additionnant les likes de toutes les photos
 				buttonLike.ariaLabel = "Je n'aime pas"
				buttonLikeIcon.classList.add("far")
				buttonLikeIcon.classList.remove("fas")
			} else if (!iSliked) { // cas ou l'utilisateur aime
                blocContenantNbLike.innerHTML = nombreDelike+1

				majLikeTotal()// met à jour le nombre de like total du photographe en additionnant les likes de toutes les photos
				buttonLikeIcon.ariaLabel = "J'aime"
				buttonLikeIcon.classList.add("fas")
				buttonLikeIcon.classList.remove("far")
			}
            i.dataset.iSliked = !iSliked // on mémorise le nouveau choix de like de l'utilisateur dans le dataset
		})
	})
}

// met à jour le nombre de like total du photographe en additionnant les likes de toutes les photos (utilise par 2 fois par la méthode ci dessus)
function majLikeTotal() {
    let likeCounter = document.querySelector('.detail-photographe__infos-autres__aside__total-likes')

    if(likeCounter != null) {
        let ObjPhotographe = new Cl_photographe(DonneesPhotographeObj) // instanciation de la class photographe
        let cpt = ObjPhotographe.getNbLikeTotalPhotographe

        likeCounter.innerHTML = cpt
        return cpt
    }
    else throw 'attention .detail-photographe__infos-autres__aside__total-likes introuvable'
}

// fonction permettant d'affiche les informations du photogrpahe
const mainFuntion = async () => {
	await afficheInfosPhotpgraphe() // await permet d'attendre le résdultat (fct asynchrone)
    gestionLikeDunMedia() // permet de gérer le clic sur le bouton like (incrémente ou décrémente le compte en foncitons des actions passées)
}

mainFuntion()
