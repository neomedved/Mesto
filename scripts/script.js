class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }
  template(url, method, body){
    return fetch(`${this.baseUrl}/${url}`, {
      method,
      headers: this.headers,
      body: method === "GET" ? undefined : JSON.stringify(body)
    })
      .then(res => {
        if (res.ok){
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      });
  }
  defaultCatch(err){
    console.log(err);
  }
  getInitialCards() {
    return this.template("cards", "GET");
  }
  getUserProfile(){
    return this.template("users/me", "GET");
  }
  editUserData(name, about){
    return this.template("users/me", "PATCH", {
      name,
      about
    })
  }
  addCard(name, link){
    return this.template("cards", "POST", {
      name, 
      link
    })
  }
}

class Card {
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

class CardList {
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
  /* отлично! карточка удаляется из DOM, а также из массива */
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
}

/* Можно лучше: на мой взгляд класс Popup перегружен логикой, сейчас в нем не просто открытие и закрытие попапа,
   но и валидация форм, добавление карточки, сохранение отредактированных данных. Сейчас в одном классе находятся
   методы нужные совершенно для разных попапов - add и edit
   Для классов такого рода есть даже специальный термин 
   https://ru.wikipedia.org/wiki/%D0%91%D0%BE%D0%B6%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82

   возможно стоило сделать класс более абстрактным оставив в нем только функции open и close, а попапы для окна 
   редактирования, создания новой карточки и изображения например отнаследовать от класса Popup и в этих классах 
   описать методы необходимые для конкретного попапа

   Например:
    class Popup {
      open();
      close();
    }

    class ProfileEditPopup extends Popup {
      open() {
        super.open();  //вызов метода класса родителя
        .....          //загрузка данных в форму
      }

      save() {
         super.close();
         .....          //сохранение данных
      }
    }

    class AddCardPopup extends Popup {}
    class CardImagePopup extends Popup {}
   
   */
class Popup {
  /* Можно лучше: Если в функцию передается много параметров то легко запутаться в их последовательности, 
    лучше обернуть эти параметры в объект */
  constructor(params){
    
    
    /* Такая запись действительно кажется компактней, но на мой взгляд она затрудняет читаемость кода
    При разработке программы стоит помнить, что читать её будут чаще чем изменять
    Так что думаю лучше будет писать на каждой строке по отдельности
    this.profileName = profileName;
    this.profileJob = profileJob;
    .......
    */
    this.profileName = params.profileName; 
    this.profileJob = params.profileJob; 
    this.cardList = params.cardList; 
    this.addForm = params.addElement.querySelector(".popup__form"); 
    this.editForm = params.editElement.querySelector(".popup__form");
    this.api = params.api;

    document.body.addEventListener("click", event => this.close(event));

    [params.addButton, params.editButton].forEach((item, index) => {
      item.addEventListener("click", () => {
        this.activeElement = [params.addElement, params.editElement][index];
        this.open();
      });
    });
    params.cardElement.querySelector(".popup__image").onload = () => {
      this.activeElement = params.cardElement;
      this.open();
    }
    this.cardList.element.addEventListener("click", (event) => {
      if (event.target.classList.contains("place-card__image")){
        params.cardElement.querySelector(".popup__image").src = event.target.style.backgroundImage.slice(5, -2);
      }
    });

    [this.addForm, this.editForm].forEach((item, index) => {
      item.addEventListener("input", this.validate);
      item.addEventListener("submit", (event) => {
        event.preventDefault();
        if(item.checkValidity()){
          [this.add, this.edit][index].call(this, event);
        }
      })
    })
  }
  open(){
    this.addForm.reset();
    this.editForm.elements.name.value = this.profileName.textContent;
    this.editForm.elements.description.value = this.profileJob.textContent;
    this.activeElement.classList.add("popup_is-opened");
  }
  close(event){
    if(event.target.classList.contains("popup__close") || event.type === "submit"){
      if (this.activeElement.querySelector(".popup__image")){
        this.activeElement.querySelector(".popup__image").src = "";
      }
      this.activeElement.classList.remove("popup_is-opened");
      [...this.activeElement.querySelectorAll(".popup__error")].forEach((item) => {
        item.style.display = "none";
        item.textContent = "";
      });
    }
  }
  add(event){
    const name = this.addForm.elements.name.value;
    const link = this.addForm.elements.link.value;
    this.addForm.elements.button.style.fontSize = "18px";
    this.addForm.elements.button.textContent = "Загрузка...";
    api.addCard(name, link)
      .then(() => this.cardList.addCard(name, link))
      .catch(this.api.defaultCatch)
      .finally(() => {
        this.close(event);
        this.addForm.elements.button.style.fontSize = "36px";
        this.addForm.elements.button.textContent = "+";
      })
  }
  edit(event){
    const name = this.editForm.elements.name.value;
    const description = this.editForm.elements.description.value;
    this.editForm.elements.button.classList.remove("popup__button_edit");
    this.api.editUserData(name, description)
      .then(() => {
        this.profileName.textContent = name;
        this.profileJob.textContent = description;
      })
      .catch(this.api.defaultCatch)
      .finally(() => {
        this.close(event);
        this.editForm.elements.button.textContent = "Сохранить";
      });
  }
  validate(event){
    if (event.target.classList.contains("popup__input")){
      const element = event.target;
      const error = element.nextElementSibling;
      if (element.validity.valueMissing){
        error.textContent = "Это обязательное поле";
        error.style.display = "block";
      } else if (element.validity.tooLong || element.validity.tooShort){
        error.textContent = "Должно быть от 2 до 30 символов";
        error.style.display = "block";
      } else if (element.validity.patternMismatch){
        error.textContent = "Здесь должна быть ссылка";
        error.style.display = "block";
      } else {
        error.textContent = "";
        error.style.display = "none";
      }
    }
  }
}



const addButton = document.querySelector(".user-info__button");
const editButton = document.querySelector(".user-info__button-edit");
const cardsContainer = document.querySelector(".places-list");

const popupAdd = document.querySelector(".popup");

const popupEdit = document.querySelector(".popup_edit");

const profileName = document.querySelector(".user-info__name");
const profileJob = document.querySelector(".user-info__job");
const profilePic = document.querySelector(".user-info__photo");



function createCardPopup(){
    const imagePopup = document.createElement("div");
    imagePopup.classList.add("popup");

    const imagePopupContent = document.createElement("div")
    imagePopupContent.classList.add("popup__content");
    imagePopupContent.style.width = "auto";
    imagePopupContent.style.minHeight = "0";
    imagePopupContent.style.padding = "0";
    imagePopupContent.style.borderRadius = "0";
    imagePopupContent.style.lineHeight = "0";

    const imagePopupContentImage = document.createElement("img");
    imagePopupContentImage.classList.add("popup__image");
    imagePopupContentImage.src = "";
    imagePopupContentImage.style.maxWidth = "80vw";
    imagePopupContentImage.style.maxHeight="80vh";

    const imagePopupClose = document.createElement("img");
    imagePopupClose.classList.add("popup__close");
    imagePopupClose.src = "./images/close.svg";
    imagePopupClose.style.top = "-31px";
    imagePopupClose.style.right = "-31px";

    imagePopup.appendChild(imagePopupContent);
    imagePopupContent.appendChild(imagePopupClose);
    imagePopupContent.appendChild(imagePopupContentImage);
    document.body.appendChild(imagePopup);

    return imagePopup;
}



const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort1',
  headers: {
    authorization: 'c5310691-f0f3-45f8-ada1-3315f7eac5e8',
    'Content-Type': 'application/json'
  }
});

api.getUserProfile()
  .then(data => {
    profileName.textContent = data.name;
    profileJob.textContent = data.about;
    profilePic.style.backgroundImage = `url(${data.avatar})`;
  })
  .catch(api.defaultCatch);

/*
  как я уже писал выше передавать много параметров (больше 2 - 3) не очень удобно, легко запутаться в их
  последовательности, можно было обернут параметры в объект так:
  new Popup({
    addButton,
    editButton,
    cardList: new CardList(cardsContainer, initialCards),
    popupAdd,
    popupEdit,
    cardPopup: createCardPopup(),
    profileName,
    profileJob
  })


*/
new Popup({addButton, 
  editButton, 
  cardList: new CardList(cardsContainer, api),
  addElement: popupAdd, 
  editElement: popupEdit, 
  cardElement: createCardPopup(), 
  profileName, 
  profileJob,
  api
});


/*
  Очень хорошая работа, видно отличное владение языком и понимание ООП. 
  Несмотря на то, что класс Popup перегружен логикой, считаю что задание выполнено в полном объеме
*/