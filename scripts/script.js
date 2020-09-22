import {addButton, editButton, cardsContainer, popupAdd, popupEdit, popupCard, profileName, profileJob, profilePic} from "./data.js";
import Api from "./api.js";
import CardList from "./cardlist";
import Popup from "./popup.js";

const api = new Api({
  baseUrl: API_URL,
  headers: {
    authorization: API_TOKEN,
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
