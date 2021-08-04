// class permettant de mettre en oeuvre une lightbox :
//sur tout les images ou vidéos  presentes sur la page

class Cl_lightbox {
	gallery = '' // array qui contiendra la source de chaque media (attribut src) , ex : gallery  : ./medias/243/Travel_Lonesome.jpg,./medias/243/Travel_HillsideColor.jpg...
	tabGalleryPhotos = [] // tableau qui contiendra un objet par media avec les valeurs alt et title de chaque img
    url = '' // url de l'image courante

	constructor() {
		let links = Array.from(document.querySelector("#gallery").querySelectorAll('img[src$=".jpg"],img[src$=".jpeg"],img[src$=".png"],source[src$=".mp4"]'))
		//console.log(links)  // array contenant liste des <img>
		this.gallery = links.map((link) => link.getAttribute("src"))


		links.forEach((link) => {
			let ob = new Object() // objet qui permettra de remplir tabGalleryPhotos
			ob.alt = link.getAttribute("alt")
			ob.title = link.getAttribute("title")
			this.tabGalleryPhotos[link.getAttribute("src")] = ob
			//console.log(link) // retourne la balise <img intégrale ou <source

			// si c'est une vidéo : attention: on note bien l'utilisation de  parentNode, sinon ca ne marche pas
            if(link.getAttribute("src").indexOf(".mp4") != -1) {
				// si l'utilisateur clique sur une photo de la gallery ou appuie sur la touche entrée alors que l'img à le focus
				link.parentNode.addEventListener("click", (e, ) => {
					//e.preventDefault() // On utilise la fonction preventDefault de notre objet event pour empêcher le comportement par défaut de cet élément lors du clic de la souris
					this.ajoutDivAuDom(link.getAttribute("src")) // peut aussi utiliser e.currentTarget.getAttribute("src") si .parentNode pas utilisé, mais ca pose problème pour les videos : l'écouteur nef onctionne pas sur <source>
					//console.log('ajoutDivAuDom pour ' + link.getAttribute("src") // retourne ./medias/82/Fashion_Yellow_Beach.jpg
				})
				link.parentNode.addEventListener("keyup", (e) => {
					if (e.keyCode === 13) {
						this.ajoutDivAuDom(link.getAttribute("src"))
					} else return
				})
			}
			else { // cas ou ce n'est pas une vidéo
				// si l'utilisateur clique sur une vidéo de la gallery ou appuie sur la touche entrée alors que l'img à le focus
				link.addEventListener("click", (e, ) => {
					this.ajoutDivAuDom(link.getAttribute("src")) // peut aussi utiliser e.currentTarget.getAttribute("src") si .parentNode pa sutilisé, mais ca pose problème pour les videos : l'écouteur ne fonctionne pas sur <source>
				})
				link.addEventListener("keyup", (e) => {
					if (e.keyCode === 13) {
						this.ajoutDivAuDom(link.getAttribute("src"))
					} else return
				})
			}
		})
		
		document.addEventListener("keyup", this.gestionKeyUp.bind(this)) // gestion de la navigation clavier des médias: précédent (fleche gauche), suivant (fleche droite), fermer (échap)
		window.addEventListener("wheel", this.gestionScrollSouris.bind(this)) // gestion de la navigation par roulette de la souris des médias, l'evenement n'est pris en compte que si la div ayant la class lightbox__container existe (mousewheel)
	}

	ajoutDivAuDom(srcMedia) {
		this.newElement = this.CreationNoeudConteneur() // créé un nouveau noeud dom avec la classe lightbox, y ajoute la class lightbox, et associe des écouteurs onclick sur les boutons close next et previous
		this.ajoutMediaAelement(srcMedia) // dans this.newElement : maj la src et les attributs de lightbox__container en fct de l'img ou de la vidéo à charger depuis url
		document.body.appendChild(this.newElement) // ajoute this.newElement dans le body du document
	}

	// créé un nouveau noeud dom avec la classe lightbox, y ajoute la class lightbox, et associe des écouteurs onclick sur les boutons close next et previous
	CreationNoeudConteneur() {
		const dom = document.createElement("div")
		dom.classList.add("lightbox")
		dom.innerHTML = `<button class="lightbox__previous" aria-label="Image précédente">Précédent</button>
						 <button class="lightbox__next" aria-label="Image suivante">Suivant</button>
						 <div class="lightbox__container">
							<p class="lightbox__container__img-title"></p>
						 </div>
						<button class="lightbox__close" aria-label="Fermer">Fermer</button>`
		dom.querySelector(".lightbox__close").addEventListener("click", this.gestionFermeture.bind(this))
		dom.querySelector(".lightbox__next").addEventListener("click", this.MediaSuivant.bind(this))
		dom.querySelector(".lightbox__previous").addEventListener("click", this.MediaPrecedent.bind(this))
		return dom
	}

/////////////
	// gestion de la navigation clavier des médias: précédent (fleche gauche), suivant (fleche droite), fermer (échap)
	gestionKeyUp(e) {
		if (e.key === "ArrowLeft") this.MediaPrecedent(e)
		if (e.key === "ArrowRight") this.MediaSuivant(e)
		else if (e.key === "Escape") this.gestionFermeture(e)
	}
	// gestion de la navigation par roulette de la souris des médias, l'evenement n'est pris en compte que si la div ayant la class lightbox__container existe
	gestionScrollSouris(e) {
		if(document.querySelector(".lightbox__container") != undefined) {
			//console.log ('scroll')
        	var scroll = e.deltaY;
        	var scrollDown = scroll > 0
        	var scrollUp = scroll < 0;
         
        	if (scrollDown) this.MediaSuivant(e)
        	else if (scrollUp) this.MediaPrecedent(e)
		}
	}
	// permet de passer au média précédent
	MediaPrecedent(e) {
		//e.preventDefault()
		let i = this.gallery.findIndex((image) => image === this.url)
		if (i === 0) i = this.gallery.length
		this.ajoutMediaAelement(this.gallery[i - 1]) // maj la src et les attributs de lightbox__container en fct de l'img ou de la vidéo à charger depuis url
	}

	// permet de passer au média suivant
	MediaSuivant(e) {
		//e.preventDefault()
		//console.log('gallery  : ' + this.gallery) // contient la listes des src des photros de la galery
		let i = this.gallery.findIndex((image) => image === this.url)
		//console.log('i  : ' + i)
		if (i === this.gallery.length - 1) i = -1
		this.ajoutMediaAelement(this.gallery[i + 1]) // maj la src et les attributs de lightbox__container en fct de l'img ou de la vidéo à charger depuis url
	}

	gestionFermeture(e) {
		this.newElement.classList.add("fadeOut")
		window.setTimeout(() => {
			document.body.removeChild(this.newElement)
		}, 500)
	}

	// dans this.newElement : maj la src et les attributs de lightbox__container en fct de l'img ou de la vidéo à charger depuis url
	ajoutMediaAelement(url) {
		this.url = url
		this.container = this.newElement.querySelector(".lightbox__container")
		//console.log(tabGalleryPhotos)

		let ObjMedia = new Cl_MediaFactory(this.container, url, this.tabGalleryPhotos[url].title,  this.tabGalleryPhotos[url].alt)

		if (url.endsWith(".mp4")) ObjMedia.createMedia('video')
		else ObjMedia.createMedia('image') //  autre cas url.endsWith(".jpg") or url.endsWith(".jpeg")...
	}
}

//Factory Pattern, cf https://betterprogramming.pub/javascript-design-patterns-25f0faaaa15
// = interface générique qui délègue la responsabilité de l'instentiation dans ces sous classes
// on a donc un class factory qui fonctionne différement en fct du parmètre précisé lors de l'appel à createMedia
class  Cl_MediaFactory {

	constructor(container, url, legendtxt, altTxt) {
		this.url = url
		this.legendtxt = legendtxt
		this.altTxt =  altTxt

		this.createMedia = function(type) {
			let media;
			if (type === 'video') media = new Cl_video(this.url);
			else if (type === 'image') media = new Cl_image(this.url, this.altTxt);
	  
			container.innerHTML = ""
			container.appendChild(media)

			let legend = document.createElement("p")
			legend.innerHTML = this.legendtxt
			container.appendChild(legend)

			return media;
		 };
	}
}
class  Cl_video { // utilisée par Cl_MediaFactory
	constructor(url) {
		const video = document.createElement("video")
		video.setAttribute("controls", "")
		video.src = url
		return video
	}
}
class  Cl_image { // utilisée par Cl_MediaFactory
	constructor(url, alt) {
		const image = new Image()
		image.alt = alt
		image.src = url
		//image.classList.add("lightbox__container__img")
		return image
	}
}