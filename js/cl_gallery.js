// class permettant de retourner le code html permettant d'afficher une photo ou une video
class Cl_gallery {

	constructor(data) {
		this._image = data.image
        this._video = data.video
		this._description = data.description
		this._title = data.title
		this._photographerId = data.photographerId
		this._likes = data.likes
	}

	// permet de retourner une portion de code html
    // la methode détermine si il s'agit d'une image ou d'un video en fonction de la présnce de ces champ dans le json
    retourneMediaHtml() {

		this._image = data.image
        this._video = data.video
		this._description = data.description
		this._title = data.title
		this._photographerId = data.photographerId
		this._likes = data.likes

        let media = ''

        if (this._image != undefined) media = `<img class="detail-photographe__gallery__media focus__element-secondary" loading="lazy" tabindex="5" src="./medias/${this._photographerId}/${this._image}" alt="${this._description}" />`
        else if (this._video != undefined)  media = `<video controls class="detail-photographe__gallery__media focus__element-secondary" tabindex="5">
                                                          <source src="./medias/${this._photographerId}/${this._video}"/>
                                                      </video>`
        else throw `Média non pris en charge`

		return `
        <figure class="detail-photographe__gallery__card" aria-label="${this._title} closeup view">
            ${media}
            <footer class="detail-photographe__gallery__media__footer">
                <figcaption class="detail-photographe__gallery__media__footer__figcaption">${this._title}</figcaption>
                <div class="detail-photographe__gallery__media__footer__like-section">
                    <p class="detail-photographe__gallery__media__footer__like-section-counter">${this._likes}</p>
                    <button class="detail-photographe__gallery__media__footer__like-section-button focus__element-secondary" title="J'aime" tabindex="5" aria-label="likes"><i class="far fa-heart" aria-hidden="true"></i></button>
                </div>
            </footer>
        </figure>`
    }

}