import "../pages/index.css";
import { initialCards, createCard } from "./cards.js";
import { enableValidation, toggleButtonState } from "./validate.js";
import { openModal, closeModal, closeByEsc } from "./modal.js";

import { getUser, getCards, updateUser, addCards} from './api.js'
getCards().then(console.log);
getUser().then(console.log);
updateUser()
addCards()
// @todo: DOM узлы
const appendCard = document.querySelector(".places__list");
const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const btnProfileOpen = document.querySelector(".profile__edit-button");
const btnProfileClose = profilePopup.querySelector(".popup__close");

const titleProfilePopup = profilePopup.querySelector(".popup__input_type_name");
const titleProfile = document.querySelector(".profile__title");
const descripProfilePopup = profilePopup.querySelector(
  ".popup__input_type_description"
);
const descripProfile = document.querySelector(".profile__description");
const profileFormElement = profilePopup.querySelector(".popup__form");
const btnProfileSave = profilePopup.querySelector(".popup__button");

// Функция создание и настройка картинок
function setImageAttributes(img, link, name) {
  img.setAttribute("src", link);
  img.setAttribute("alt", `Фото ${name}`);
}

// Размещение карточки в DOM
function appendCardToDOM(item, isUserCard) {
  if (isUserCard) {
    appendCard.prepend(item);
  } else {
    appendCard.append(item);
  }
}

// Функция открытия поп-апа с картинкой
function openImagePopup(link, name) {
  setImageAttributes(popupImg, link, name);
  popupCaption.textContent = name;
  openModal(imagePopup);
}

// Функция для обработки лайков
function handleLikeButtonClick(evt) {
  evt.currentTarget.classList.toggle("card__like-button_is-active");
}

// Функция для удаления карточки
function handleDeleteButtonClick(button) {
  const card = button.closest(".places__item");
  card.remove();
}

// Открытие и закрытие формы для добавления карточек
const btnCardOpen = document.querySelector(".profile__add-button");
const btnCardClose = cardPopup.querySelector(".popup__close");
const btnCardSave = cardPopup.querySelector(".popup__button");
btnCardOpen.addEventListener("click", () => openModal(cardPopup));
btnCardClose.addEventListener("click", () => closeModal(cardPopup));
// Добавления новых карточек пользователем
export const cardSave = cardPopup.querySelector(".popup__form");
const cardName = cardPopup.querySelector(".popup__input_type_card-name");
const cardUrl = cardPopup.querySelector(".popup__input_type_url");
// Состояние кнопки до создания карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  createCard(cardName.value, cardUrl.value, true);
  cardSave.reset();
  closeModal(cardPopup);
  toggleButtonState(
    Array.from(cardPopup.querySelectorAll(".popup__input")),
    btnCardSave,
    validationSettings
  );
}
cardSave.addEventListener("submit", handleCardFormSubmit);

// Перебор массива с данными
initialCards.forEach(function (elem) {
  createCard(elem.name, elem.link, false);
});
// Функция создания карточки
const popupImg = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

// Добавления текста по умолчания внутри формы изменений профиля
titleProfilePopup.value = titleProfile.textContent;
descripProfilePopup.value = descripProfile.textContent;
// Обработчик события открытия окна редактирования профиля
btnProfileOpen.addEventListener("click", () => openModal(profilePopup));

// Функция обработки отправки формы
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  titleProfile.textContent = titleProfilePopup.value;
  descripProfile.textContent = descripProfilePopup.value;
  closeModal(profilePopup);
}
profilePopup.addEventListener("submit", handleProfileFormSubmit);
// Обработчик события закрытия окна редактирования профиля
btnProfileClose.addEventListener("click", () => closeModal(profilePopup));

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button-disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

enableValidation(validationSettings);

// Функция закрытия popap через overlay
const CloseByOverlay = (evt, popup) => {
  if (evt.currentTarget === evt.target) {
    closeModal(popup);
  }
};

cardPopup.addEventListener("click", (evt) => CloseByOverlay(evt, cardPopup));
profilePopup.addEventListener("click", (evt) =>
  CloseByOverlay(evt, profilePopup)
);
imagePopup.addEventListener("click", (evt) => CloseByOverlay(evt, imagePopup));

export {
  setImageAttributes,
  appendCardToDOM,
  handleLikeButtonClick,
  handleDeleteButtonClick,
  openImagePopup,
};
