var DonneesPhotographeObj = '' // on déclare l'objet ici ainsi il servira a plusieurs endroits, il sera instancié par afficheInfosPhotopgraphe

getDataOfJson = async () =>
await fetch("./json/FishEyeData.json", { mode: "no-cors" })
    .then((ressourcejson) => ressourcejson.json())
    .catch((erreur) => console.log("Erreur lors du fetch du json", erreur))


// affiche les informations d'un photographe : fonction asynchrone, on met donc async devant
afficheInfosPhotopgraphe = async () => {
	let {media, photographers} = await getDataOfJson()  // retourne automatiquement 2 tab d'objet de ce qu'il y a dans le json au niveau de media et de photographers
	let chainesParametres = new URLSearchParams(document.location.search.substring(1)) // permet de récuperer la chaine de parmètres passés dans l'url
	let idPhotographe = chainesParametres.get("id") // permet de recuperer précisément l'id

    if (photographers === undefined) throw new Cl_ExceptionUtilisateur("Données sur les photographes introuvables.")
	else if (media === undefined) throw new Cl_ExceptionUtilisateur("Données sur les medias du photographes introuvables.")

	DonneesPhotographeObj = photographers.find(
		(photographer) => photographer.id == idPhotographe // c'est ainsi qu'on récupère les infos du photographe souhaité (objet)
	)
	if (DonneesPhotographeObj === undefined) throw new Cl_ExceptionUtilisateur("Données sur le photographe introuvables.")
    let ObjPhotographe = new Cl_photographe(DonneesPhotographeObj) // instanciation de la class photographe

	document.title = document.title + ' : ' + ObjPhotographe.getNomPhotoGraphe // mise à jour du title de la page en ajoutant le nom du photographe
	document.querySelector(".modal-header-title").innerHTML +=  `<br /> ${ObjPhotographe.getNomPhotoGraphe}` //le titre de la modal de contact doit contenir le nom du photographe aussi

	let mediasPersos = media.filter((media) => media.photographerId == idPhotographe) // c'est ainsi qu'on récupère les médias du photographe souhaité (tableau d'objet)
	updateMediasPersos(mediasPersos) // afiche ou met à jour la gallerie
	//console.log(mediasPersos)
	
	// le tableau d'objet va etre trié en fonction de ce qui est retenu dans la selectbox :
	document.getElementById("trieGallery").addEventListener("change", function (event) {
		let mediaGalleryTriee = ''
		console.log('event.target : ' + event.target.value) //retourne date popularite ou titre
		switch ( event.target.value) { // suivant l'option retenue dans la selectbox
			// on va utiliser sort (cf https://developer.mozilla.org/fr/docs/orphaned/Web/JavaScript/Reference/Global_Objects/Array/sort, on aurait pu utiliser les fonctions fléchées
			case "date":
				//console.log(`trie par date`)
				mediaGalleryTriee =  mediasPersos.sort(function(a, b) {
					let aDate = new Date(a.date)
					let bDate = new Date(b.date)
					//console.log(`adate : ${aDate} bdate : ${bDate}`)
					return  bDate - aDate})
				break
			case "titre":
				//console.log('trie par titre')
				mediaGalleryTriee = mediasPersos.sort((a, b) => a.title.localeCompare(b.title))
				break
			default: // popularité par défaut
				//console.log('trie par popularité')
				mediaGalleryTriee =  mediasPersos.sort(function(a, b) {return b.likes - a.likes})
				break
		} 

		updateMediasPersos(mediaGalleryTriee)// afiche ou met à jour la gallerie

	})

	let photographeInfosGen = document.querySelector(".detail-photographe__info")
	let photographeInfosAutres = document.querySelector("#footer-infos-autres")
	photographeInfosGen.innerHTML += ObjPhotographe.infoDetailPhotographe  // retourne les informations d'un photographe pour la page de détail
	photographeInfosAutres.innerHTML += ObjPhotographe.infosDetailAutrePhotographe  // retourne le nombre de like et le tarif d'un photographe pour la page de détail
}

//affiche ou met à jour la gallerie, appelé par afficheInfosPhotopgraphe à 2 endroit, c'est pour cela qu'on fait une fct à part
updateMediasPersos = (gallery) => {
	let conteneurGalleryPhtographe = document.querySelector(".detail-photographe__gallery")
	conteneurGalleryPhtographe.innerHTML = ""
	let cpt = 0
	gallery.forEach((media) => {
		cpt++ // cpt pour tester debug plus rapidement
        //if(cpt < 4) 
		conteneurGalleryPhtographe.innerHTML += retourneMediaHtml(media) //retourne une string avec une portion de code html pertmettant l'affichage du média (image ou vidéo)
	})

	let ObjLightbox = new Cl_lightbox()
}


// en fonction du media passé en param, détermine si il s'agit d'une image ou d'un video en fonction de la présence de ces champs dans le json
//retourne une string avec une portion de code html
retourneMediaHtml = (mediaParam) => {
	let dateFdate = new Date(mediaParam.date) // n'est utile que pour débugage
    let image = mediaParam.image
    let video = mediaParam.video
    let description = mediaParam.description
    let title = mediaParam.title
    let photographerId = mediaParam.photographerId
    let likes = mediaParam.likes
	let id = mediaParam.id

    let codeHtml = ''
	

    if (image != undefined) {
		// portion de code pour tester la présence d'une image (vu pb nommage image pour Tracy Galindo id= 82), sinpi : https://www.developpez.net/forums/d475332/javascript/general-javascript/verifier-image-existe/ :
		emplacementImage = `./medias/${photographerId}/${image}`
		var tester=new Image()
		tester.src=emplacementImage
		//tester.onload=function() {alert('Image chargée')}
		tester.onerror=function() {console.log('ATTENTION : Le media n\'existe pas : ' + tester.src)}
	
		codeHtml = `<img class="detail-photographe__gallery__media" tabindex="5" src="${emplacementImage}" alt="${description}" title="${title}" />`
	}
    else if (video !== undefined)  codeHtml = `<video class="detail-photographe__gallery__media" tabindex="5"  alt="${description}" title="${title}">
                                                        <source src="./medias/${photographerId}/${video}"/>
                                            	</video>` // attribut controls retiré pour permetre de faire un évenment onclic dessus (pour ouverture lightbox)
    else throw new Cl_ExceptionUtilisateur("Média non pris en charge. (id : " + id + ")")

	//console.log({dateFdate}) // permet de vérifier que le trie par date fonctionne bien
    return `
    <figure class="detail-photographe__gallery__card" aria-label="${title} closeup view">
        ${codeHtml}
        <footer class="detail-photographe__gallery__media__footer">
            <figcaption class="detail-photographe__gallery__media__footer__figcaption">${title}</figcaption>
            <div class="detail-photographe__gallery__media__footer__like-section">
                <p class="detail-photographe__gallery__media__footer__like-section-counter">${likes}</p>
                <button class="detail-photographe__gallery__media__footer__like-section-button" title="J'aime" tabindex="5" aria-label="likes"><i class="far fa-heart" aria-hidden="true"></i></button>
            </div>
        </footer>
    </figure>`
}




 // permet de gérer le clic sur le bouton like (incrémente ou décrémente le compte en foncitons des actions passées
gestionLikeDunMedia = () => {
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
majLikeTotal = () => {
    let likeCounter = document.querySelector('.detail-photographe__infos-autres__aside__total-likes')

    if(likeCounter != null) {
        let ObjPhotographe = new Cl_photographe(DonneesPhotographeObj) // instanciation de la class photographe
        let cpt = ObjPhotographe.getNbLikeTotalPhotographe

        likeCounter.innerHTML = cpt
        return cpt
    }
    else throw 'attention .detail-photographe__infos-autres__aside__total-likes introuvable'
}


// fonction permettant d'ajouter les evenements click et keypress aux tags de la page de détail seulement
assoEvenementsAuxTagsPageDetail = () => {
	let tags = document.querySelectorAll(".detail-photographe__info_div__content__taglist > li")

	tags.forEach((tag) => { // parcours tout les li de tag-list-interractive (dont header__filters__navigation) pour leur ajouter l'evenement click
		tag.addEventListener("click", function () {
			window.location = 'index.html?tag=' + tag.textContent.replace(/(\s|\#)+/g, "").toLowerCase()
		})
		tag.addEventListener("keypress", function (e) {
			if (e.key === "Enter") window.location = 'index.html?tag=' + tag.textContent.replace(/(\s|\#)+/g, "").toLowerCase()
		})

	})

}

// 2 fct ci dessous pour la modal "contactez moi"
gestionBtContact = (classModal) => {
	document.querySelector(classModal).style.display = "none"
	let elemnt = document.querySelector("#btContact")
	elemnt.addEventListener("click", function () {
		afficheFormulaireContact(classModal)
	})
	elemnt.addEventListener("keypress", function (e) {
		afficheFormulaireContact(classModal)
	})
}

afficheFormulaireContact = (classModal) => {
	let ObjVerifMail = new Cl_verifMail // instanciation de la class Cl_verifMail permettant de vérifier la saisie de l'utilisateur
	ObjVerifMail.ajoutEcouteursSurChamps() // ajout écouteur sur blur pour chaque champ du formulaire, afin de vérifier valilidté de la saisie et d'afficher message d'erreur en cas de pb


	let modal = document.querySelector(classModal)
	modal.style.display = "block" // affichage de la div comportant la modal
	let dt = document.querySelector(".detail-photographe")
	dt.style.opacity = "10%" // pour que le fond de la page principal soit grisé
	let fia = document.querySelector("#footer-infos-autres")
	fia.style.opacity = "10%" // pour que le fond de la page principal soit grisé

	// va etre utilisé plusieurs fois ci dessous
	disparitionModal = () => {
		modal.style.display = "none"
		dt.style.opacity = "100%"
		fia.style.opacity = "100%"
	}

	document.querySelector(".close").onclick = function () {
		disparitionModal()
	};
	// si l'utilisateur a cliqué sur le div qui a la class modal, c'est qu'il souhaite fermer la popup
	window.onclick = function (event) {
		if (event.target == modal) disparitionModal()
	};

	// gestion touche échape
	document.addEventListener('keydown', function(e) {
		if ( e.key === "Escape") disparitionModal()
	});

	// gestion bouton soumission		
	if (document.getElementById("form-button")) {
		document.getElementById("form-button").addEventListener("click", function (event) {
			event.preventDefault()
			let prenom = document.getElementById("prenom")
			let nom = document.getElementById("nom")
			let mail = document.getElementById("mail")
			let message = document.getElementById("message")
			console.log(
				`Info saisies : ${prenom.value} ${nom.value} ${mail.value} ${message.value}`
			);

			formValide = ObjVerifMail.verifValiditeInfosForm() // verifie si tout les champs sont bien renseignés, retoune false en cas de problème, sinon true
			if(formValide == true) {
				alert ('Vos informations ont bien été prises en compte, merci')
				disparitionModal()
			}
		});
	}
}

// fonction principale permettant d'afficher les informations du photographe de gérer les likes et les tags
initPage = async () => {
	await afficheInfosPhotopgraphe() // await permet d'attendre le résultat (fct asynchrone)
	gestionBtContact(".modal")
    gestionLikeDunMedia() // permet de gérer le clic sur le bouton like (incrémente ou décrémente le compte en foncitons des actions passées)
	assoEvenementsAuxTagsPageDetail() // fonction permettant d'ajouter les evenements click et keypress aux tags
}


initPage() // fonction principale permettant d'afficher les informations du photographe, de gérer les likes et les tags

