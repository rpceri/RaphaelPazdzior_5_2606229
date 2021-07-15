// trie des medias (photo ou video ), retourne le  tableau des média trié 
const filterByOption = (mediaGallery, option) => { // mediaGallery : array; option : chaine
	switch (option) {
		case "date":
			return mediaGallery.sort((a, b) => {
				return new Date(b.date) - new Date(a.date);
			});
		case "titre":
			return mediaGallery.sort((a, b) => a.title.localeCompare(b.title));
		default: // popularite par défaut
			return mediaGallery.sort((a, b) => {
				return b.likes - a.likes;
			});
	}
};

const $conteneurGalleryPhtographe = document.querySelector(".detail-photographe__gallery");

const getDataOfJson = async () =>
await fetch("./json/FishEyeData.json", { mode: "no-cors" })
    .then((ressource) => ressource.json())
    .catch((erreur) => console.log("Erreur lors du fetch du json", erreur));

// affiche les informations d'un photographe
async function afficheInfosPhotpgraphe() {
	const { media, photographers } = await getDataOfJson();  // retourne automatiquement 2 tab d'objet de ce qu'il y a dans le json au niveau de media et de photographers
	const chainesParametres = new URLSearchParams(document.location.search.substring(1)); // permet de récuperer la chane de parmètres passés dans l'url
	const idPhotographe = chainesParametres.get("id"); // permet de recuperer précisément l'id

    let DonneesPhotographeObj = photographers.find(
		(photographer) => photographer.id == idPhotographe // c'est ainsi qu'on récupère les infos du photographe souhaité (objet)
	);

    // mise à jour du title de la page en ajoutant le nom du photographe :
    let photographeFiche = new Cl_photographe(DonneesPhotographeObj); 
	photographeFiche.majTitrePageHtml;

	let mediasPersos = media.filter((media) => media.photographerId == idPhotographe); // c'est ainsi qu'on récupère les médias du photographe souhaité (objet)
	updateMediasPersos(mediasPersos); // afiche ou met à jour la gallerie
/*
	document.addEventListener("change", function (event) {
		$conteneurGalleryPhtographe.innerHTML = "";
		const option = filterByOption(mediasPersos, event.target.value);
		updateMediasPersos(option);
		Lightbox.init()
	});
*/
	const $photographeInfosGen = document.querySelector(".detail-photographe__info");
	const $photographeInfosAutres = document.querySelector(".detail-photographe__infos-autres");
	$photographeInfosGen.innerHTML += new Cl_photographe(DonneesPhotographeObj).infoDetailPhotographe;  // retourne les informations d'un photographe pour la page de détail
	$photographeInfosAutres.innerHTML += new Cl_photographe(DonneesPhotographeObj).infosDetailAutrePhotographe  // retourne le nombre de like et le tarif d'un photographe pour la page de détail;
}

//affiche ou met à jour la gallerie
function updateMediasPersos(gallery) {
	gallery.forEach((media) => {
		let mediasPersos = new Gallery(media);
		$conteneurGalleryPhtographe.innerHTML += mediasPersos.retourneMediaHtml();
	});
}

// fonction permettant d'affiche les informations du photogrpahe
const mainFuntion = async () => {
	await afficheInfosPhotpgraphe();
	//Lightbox.init();
};

mainFuntion();
