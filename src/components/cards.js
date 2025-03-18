import { openModal, closeModal } from "./modal.js";
import {
  setImageAttributes,
  appendCardToDOM,
  handleLikeButtonClick,
  handleDeleteButtonClick,
  openImagePopup,
} from "./index.js";

export const initialCards = [
  {
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
  },
];

// @todo: Темплейт карточки
const template = document.querySelector("#card-template");

const imagePopup = document.querySelector(".popup_type_image");

function createCard(name, link, isUserCard) {
  const item = template.content.cloneNode(true);
  let img = item.querySelector(".card__image");
  let title = item.querySelector(".card__title");

  // Установка атрибутов изображения и текста
  setImageAttributes(img, link, name);
  title.textContent = name;

  // Обработчик события открытия поп-апа с картинкой
  img.addEventListener("click", () => openImagePopup(link, name));

  // Функция закрытия изображения карточки
  const btnImgClose = imagePopup.querySelector(".popup__close");
  btnImgClose.addEventListener("click", () => closeModal(imagePopup));

  // Обработчик лайка
  const btnCardLikes = item.querySelector(".card__like-button");
  btnCardLikes.addEventListener("click", handleLikeButtonClick);

  // Обработчик удаления карточки
  const btnCardDelete = item.querySelector(".card__delete-button");
  btnCardDelete.addEventListener("click", () =>
    handleDeleteButtonClick(btnCardDelete)
  );

  // Размещение карточки в DOM
  appendCardToDOM(item, isUserCard);
}

export { createCard };
