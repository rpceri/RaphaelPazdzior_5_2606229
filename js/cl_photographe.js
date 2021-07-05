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
    
    // méthode retournant les informations particulières d'un photographe, utile dans la pahe index pour lister tous les photographes du json
    get infosPhotographe() {
        return `
            <a href="presentation-photographe.html?id=${this._id}" aria-label="Présentation de ${this._name}" >
                <article class="photographe">
                    <img src="./medias/photographers%20ID%20Photos/${this._portrait}" class="photographe__img" alt="Photo de profil de ${this._name}">
                    <h2 class="photographe__name">${this._name}</h2>
                    <p class="photographe__coordonnees">${this._city}, ${this._country}</p>
                    <p class="photographe__tagline">${this._tagline}</p>
                    <p class="photographe__price">${this._price}€/jour</p>
                    <ul class="photographe__taglist">${this._tags.map(tag => `<li class="bouton-tag">#${tag}</li>`).join('')}</ul>
                </article>
            </a>`
    }

 
}