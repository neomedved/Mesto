import Card from "./card.js";

export default class CardList {
  constructor(element, api){
    this.element = element;
    api.getInitialCards()
      .then(data => {
        this.cards = data.map(item => new Card(item.name, item.link));
        this.render();
      })
      .catch(err => {
        api.defaultCatch(err);
        this.cards = [];
      });
    this.element.addEventListener("click", (event) => {
      if (event.target.classList.contains("place-card__delete-icon")){
        const card = event.target.parentElement.parentElement;
        this.removeCard(this.findCard(card));
      }
    });
    this.element.addEventListener("click", (event) => {
      if (event.target.classList.contains("place-card__like-icon")){
        const card = event.target.parentElement.parentElement;
        this.cards[this.findCard(card)].like();
      }
    })
  }

  addCard(name, link){
    this.cards.push(new Card(name, link));
    this.element.appendChild(this.cards[this.cards.length - 1].element);
  }

  removeCard(index){
    this.cards[index].remove();
    this.cards.splice(index, 1);
  }

  findCard(element){
    return this.cards.indexOf(this.cards.find((value) => {
      return value.element.isSameNode(element);
    }))
  }

  render(){
    this.cards.forEach((item) => {
      this.element.appendChild(item.element);
    })
  }
};
