const addButton = document.querySelector(".user-info__button");
const editButton = document.querySelector(".user-info__button-edit");
const cardsContainer = document.querySelector(".places-list");

const popupAdd = document.querySelector(".popup");
const popupEdit = document.querySelector(".popup_edit");
const popupCard = createCardPopup();

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


export {addButton, editButton, cardsContainer, popupAdd, popupEdit, popupCard, profileName, profileJob, profilePic};