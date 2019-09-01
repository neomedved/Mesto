import {addButton, editButton, cardsContainer, popupAdd, popupEdit, popupCard, profileName, profileJob, profilePic} from "./data.js";
import Api from "./api.js";
import CardList from "./cardlist";
import Popup from "./popup.js";

const api = new Api({
  baseUrl: NODE_ENV === "production" ? 'https://praktikum.tk/cohort1' : 'http://praktikum.tk/cohort1',
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
  cardElement: popupCard, 
  profileName, 
  profileJob,
  api
});


/*
  Очень хорошая работа, видно отличное владение языком и понимание ООП. 
  Несмотря на то, что класс Popup перегружен логикой, считаю что задание выполнено в полном объеме
*/