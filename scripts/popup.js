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
  export default class Popup {
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