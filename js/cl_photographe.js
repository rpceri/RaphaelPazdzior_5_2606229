class Cl_photographe {
    // !!  tags est un tableau, ex: ["sport", "fashion", "events", "animals"]
       constructor(data) {
           this._name = data.name
           this._id = data.id
           this._city = data.city
           this._country = data.country
           this._tags = data.tags
           this._tagline = data.tagline
           this._price = data.price
           this._portrait = data.portrait
       }

       // méthode retournant les informations particulières d'un photographe, utile dans la page index pour lister tous les photographes du json
       get infosPhotographe() {
           // il est spécifié dans figma que le lien ne doit etre que sur le link h2 + image
           return `<article class="photographe">
                       <a href="presentation-photographe.html?id=${this._id}" aria-label="Présentation de ${this._name}" >
                           <img src="./medias/Photographers%20ID%20Photos/${this._portrait}" class="photographe__img" titre="Photo de profil de ${this._name}">
                           <h2 class="photographe__name">${this._name}</h2>
                       </a>
                       <p class="photographe__coordonnees">${this._city}, ${this._country}</p>
                       <p class="photographe__tagline">${this._tagline}</p>
                       <p class="photographe__price">${this._price}€/jour</p>
                       <ul class="photographe__taglist">${this._tags.map(tag => `<li class="bouton-tag">#${tag}</li>`).join('')}</ul>
                   </article>`
       }

       // méthodes ci dessous pour page de détail :

       // retourn le nom du photographe
       get getNomPhotoGraphe() {
           return this._name
       }

       // retourne les informations d'un photographe pour la page de détail
        get infoDetailPhotographe() {
           return  `<div class="detail-photographe__info_div">
                <div class="detail-photographe__info_div__content">
                    <h1 class="detail-photographe__info_div__content__title">${this._name}</h1>
                    <p class="detail-photographe__info_div__content__localization">${this._city}, ${this._country}</p>
                    <p class="detail-photographe__info_div__content__tagline">${this._tagline}</p>
                    <ul class="detail-photographe__info_div__content__taglist">${this._tags.map(tag => `<li href="index.html" class="bouton-tag">#${tag}</li>`).join(" ")}</ul>
                </div>
                <button class="detail-photographe__contact__button focus__element-secondary" tabindex="3" onclick="AffichePopup()" aria-label="Contacter Me">Contactez-moi</button>
                <img src="./medias/Photographers%20ID%20Photos/${this._portrait}" class="detail-photographe__info_div__photo" alt="" aria-label="${this._name}">
            </div>`
        }

       // retourne une string contenant unb loc html avec le nombre de like et le tarif d'un photographe pour la page de détail
       get infosDetailAutrePhotographe() {
           return `<section class="detail-photographe__infos-autres">
               <aside class="detail-photographe__infos-autres__aside">
               <p class="detail-photographe__infos-autres__aside__total-likes" aria-label="Nombre de like : ${this.getNbLikeTotalPhotographe}" tabindex="6">${this.getNbLikeTotalPhotographe}</p>
               <i class="fas fa-heart" aria-hidden="true"></i>
               </aside>
               <p class="detail-photographe__infos-autres__price" tabindex="7" aria-label="Tarif journalier : ${this._price} euro">${this._price}€/jour</p>
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