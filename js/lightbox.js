class Lightbox {
	gallery = '' // array qui contiendra la source de chaque media (attribut src) , ex : gallery  : ./medias/243/Travel_Lonesome.jpg,./medias/243/Travel_HillsideColor.jpg...
	objGalleryPhotos = [] // tableau qui contiendra un objet par media avec les valeur alt et title de chaque img
    url = '' // url de l'image courante

	constructor() {
		let links = Array.from(document.querySelector("#gallery").querySelectorAll('img[src$=".jpg"],source[src$=".mp4"]'))
		//console.log(links)  // array contenant liste des <img>
		gallery = links.map((link) => link.getAttribute("src"))


		links.forEach((link) => {
			let ob = new Object() // objet qui permettra de remplir objGalleryPhotos
			ob.alt = link.getAttribute("alt")
			ob.title = link.getAttribute("title")
			this.objGalleryPhotos[link.getAttribute("src")] = ob
			//console.log(this.objGalleryPhotos)

			//console.log(link) // retourne la balise <img intégrale
			// sui l'utilisateur clique sur une photo de la gallery ou appuie sur la touche entrée alors que l'img à le focus
			link.addEventListener("click", (e) => {
				e.preventDefault() // On utilise la fonction preventDefault de notre objet event pour empêcher le comportement par défaut de cet élément lors du clic de la souris
				this.ajoutDivAuDom(e.currentTarget.getAttribute("src"))
				//console.log('ajoutDivAuDom pour ' + e.currentTarget.getAttribute("src")) // retourne ./medias/82/Fashion_Yellow_Beach.jpg
			})
			link.addEventListener("keyup", (e) => {
				if (e.keyCode === 13) {
					e.preventDefault()
					this.ajoutDivAuDom(e.currentTarget.getAttribute("src"))
				} else {
					return
				}
			})
		})
		// gestion de la naviguation clavier des médias: précédent (fleche gauche), suivant (fleche droite), fermer (échap)
		this.gestionKeyUp = this.gestionKeyUp.bind(this)
		document.addEventListener("keyup", this.gestionKeyUp)
	}

	ajoutDivAuDom(srcMedia) {
		this.newElement = this.CreationNoeudConteneur() // créé un nouveau noeud dom avec la classe ligthbox, y ajoute la class lightbox, et associe des écouteurs onclick sur les boutons close next et previous
		this.ajoutMediaAelement(srcMedia) // dans this.newElement : maj la src et les attributs de lightbox__container en fct de l'image à charger depuis url
		document.body.appendChild(this.newElement) // ajoute this.newElement dans le body du document
	}

	// créé un nouveau noeud dom avec la classe ligthbox, y ajoute la class lightbox, et associe des écouteurs onclick sur les boutons close next et previous
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

	// dans this.newElement : maj la src et les attributs de lightbox__container en fct de l'image à charger depuis url
	ajoutMediaAelement(url) {
		this.url = url
		//console.log(this.objGalleryPhotos[url].title)
		const container = this.newElement.querySelector(".lightbox__container")
		let legend = document.createElement("p")
		legend.innerHTML = this.objGalleryPhotos[url].title
		if (url.endsWith(".mp4")) {
			const video = document.createElement("video")

			container.innerHTML = ""
			container.appendChild(video)
			container.appendChild(legend)
			video.setAttribute("controls", "")
			video.src = url
		} else if (url.endsWith(".jpg")) {
			const image = new Image()

			container.innerHTML = ""
			container.appendChild(image)
			container.appendChild(legend)
			image.alt = this.objGalleryPhotos[url].alt
			image.src = url
			//image.classList.add("lightbox__container__img")
		}
	}

	gestionKeyUp(e) {
		if (e.key === "Escape") this.gestionFermeture(e)
		else if (e.key === "ArrowLeft") this.MediaSuivant(e)
		else if (e.key === "ArrowRight") this.MediaPrecedent(e)
	}

	// permet de passer au média précédent
	MediaPrecedent(e) {
		e.preventDefault()
		let i = gallery.findIndex((image) => image === this.url)
		if (i === 0) i = gallery.length
		this.ajoutMediaAelement(gallery[i - 1])
	}

	// permet de passer au média suivant
	MediaSuivant(e) {
		e.preventDefault()
		//console.log('gallery  : ' + gallery) // contient la listes des src des photros de la galery
		let i = gallery.findIndex((image) => image === this.url)
		//console.log('i  : ' + i)
		if (i === gallery.length - 1) i = -1
		this.ajoutMediaAelement(gallery[i + 1])
	}

	gestionFermeture(e) {
		this.newElement.classList.add("fadeOut")
		window.setTimeout(() => {
			document.body.removeChild(this.newElement)
		}, 500)
	}


}
