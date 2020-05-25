export default class Card {
    constructor(name, link){
      this.element = this.create(name, link);
    }

    like(){
      this.element.querySelector(".place-card__like-icon").classList.toggle("place-card__like-icon_liked");
    }

    create(name, link){
      const placeCard = document.createElement("div");
      placeCard.classList.add("place-card");
  
  
      const placeCardImage = document.createElement("div");
      placeCardImage.classList.add("place-card__image");
      placeCardImage.style.backgroundImage = `url(${link})`;
      
      const placeCardDelete = document.createElement("button");
      placeCardDelete.classList.add("place-card__delete-icon");
   
      
      const placeCardDesc = document.createElement("div");
      placeCardDesc.classList.add("place-card__description");
      
      const placeCardName = document.createElement("h3");
      placeCardName.classList.add("place-card__name");
      placeCardName.textContent = name;
      
      const placeCardLike = document.createElement("button");
      placeCardLike.classList.add("place-card__like-icon");
  
  
      placeCardImage.appendChild(placeCardDelete);
  
      placeCardDesc.appendChild(placeCardName);
      placeCardDesc.appendChild(placeCardLike);
  
      placeCard.appendChild(placeCardImage);
      placeCard.appendChild(placeCardDesc);
  
      return placeCard;
    }

    remove(){
      this.element.parentElement.removeChild(this.element);
    }
  }
