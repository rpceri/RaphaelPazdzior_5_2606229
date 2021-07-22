class Cl_photographe {
    // !!  tags est un tableau, ex: ["sport", "fashion", "events", "animals"]
    constructor(data) {
        this.name = data.name
        this.id = data.id
        this.city = data.city
        this.country = data.country
        this.tags = data.tags
        this.tagline = data.tagline
        this.price = data.price
        this.portrait = data.portrait
    }

    // méthode retournant les informations particulières d'un photographe, utile dans la page index pour lister tous les photographes du json
    get infosPhotographe() {
        // il est spécifié dans figma que le lien ne doit etre que sur le link h2 + image
        return `<article class="photographe">
                    <a href="presentation-photographe.html?id=${this.id}" aria-label="Présentation de ${this.name}" >
                        <img src="./medias/Photographers%20ID%20Photos/${this.portrait}" class="photographe__img" title="Photo de profil de ${this.name}">
                        <h2 class="photographe__name">${this.name}</h2>
                    </a>
                    <p class="photographe__coordonnees">${this.city}, ${this.country}</p>
                    <p class="photographe__tagline">${this.tagline}</p>
                    <p class="photographe__price">${this.price}€/jour</p>
                    <ul class="photographe__taglist tag-list-interractive">${this.tags.map(tag => `<li class="bouton-tag">#${tag}</li>`).join('')}</ul>
                </article>`
    }

    // méthodes ci dessous pour page de détail :

    // retourn le nom du photographe
    get getNomPhotoGraphe() {
        return this.name
    }

    // retourne les informations d'un photographe pour la page de détail
    get infoDetailPhotographe() {
        return  `<div class="detail-photographe__info_div">
            <div class="detail-photographe__info_div__content">
                <h1 class="detail-photographe__info_div__content__title" id="identificationPhotographe">${this.name}</h1>
                <p class="detail-photographe__info_div__content__localization">${this.city}, ${this.country}</p>
                <p class="detail-photographe__info_div__content__tagline">${this.tagline}</p>
                <ul class="detail-photographe__info_div__content__taglist">${this.tags.map(tag => `<li class="bouton-tag">#${tag}</li>`).join(" ")}</ul>
            </div>
            <div class="detail-photographe__info_div__contact">
                <button class="detail-photographe__info_div__contact__button focus__element-secondary" tabindex="3" onclick="AffichePopup()" aria-label="Contacter Me">Contactez-moi</button>
            </div>
            <div class="detail-photographe__info_div__photo">
            <img src="./medias/Photographers%20ID%20Photos/${this.portrait}" class="detail-photographe__info_div__photo__img" alt="" aria-label="${this.name}">
            </div>
        </div>`
    }

    // retourne une string contenant unb loc html avec le nombre de like et le tarif d'un photographe pour la page de détail
    get infosDetailAutrePhotographe() {
        return `<section class="detail-photographe__infos-autres">
            <aside class="detail-photographe__infos-autres__aside">
            <p class="detail-photographe__infos-autres__aside__total-likes" aria-label="Nombre de like : ${this.getNbLikeTotalPhotographe}" tabindex="6">${this.getNbLikeTotalPhotographe}</p>
            <i class="fas fa-heart" aria-hidden="true"></i>
            </aside>
            <p class="detail-photographe__infos-autres__price" tabindex="7" aria-label="Tarif journalier : ${this.price} euro">${this.price}€/jour</p>
        </section>`
    }

    // methode retournant le nombre de like : somme des likes de chaque média, utilsée par celle ci dessus et aussi par le js de la page de détail d'un photographe
    get getNbLikeTotalPhotographe() {
        let blocContenantNbLike = document.querySelectorAll(".detail-photographe__gallery__media__footer__like-section-counter"	) // p ou se trouve le nombre de like pour chaque media
            let cpt = 0;
            blocContenantNbLike.forEach(function (like) {
                cpt += Number(like.textContent)
            })
            return cpt
    }
}