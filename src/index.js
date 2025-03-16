import "../pages/index.css";
import {initialCards} from './cards.js';
// @todo: Темплейт карточки
const template = document.querySelector("#card-template");
// @todo: DOM узлы
const appendCard = document.querySelector(".places__list");
const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const btnProfileOpen = document.querySelector(".profile__edit-button");
const btnProfileClose = profilePopup.querySelector(".popup__close");

const titleProfilePopup = profilePopup.querySelector(".popup__input_type_name");
const titleProfile = document.querySelector(".profile__title");
const descripProfilePopup = profilePopup.querySelector(".popup__input_type_description");
const descripProfile = document.querySelector(".profile__description");
const profileFormElement = profilePopup.querySelector(".popup__form");
const btnProfileSave = profilePopup.querySelector(".popup__button");

// Функция окрытия окна
function openModal(popup) {
  popup.classList.add("popup_is-opened");
  popup.classList.add("popup_is-animated");
  document.addEventListener('keydown', closeByEsc); 
}
// Функция закрытия окна
function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener('keydown', closeByEsc); 
}
// Функция оздание и настройка картинок
function setImageAttributes(img, link, name) {
  img.setAttribute("src", link);
  img.setAttribute("alt", `Фото ${name}`);
}


// Открытие и закрытие формы для добавления карточек
const btnCardOpen = document.querySelector(".profile__add-button");
const btnCardClose = cardPopup.querySelector(".popup__close");
const btnCardSave = cardPopup.querySelector(".popup__button");
btnCardOpen.addEventListener("click", () => openModal(cardPopup));
btnCardClose.addEventListener("click", () => closeModal(cardPopup));
// Добавления новых карточек пользователем
const cardSave = cardPopup.querySelector(".popup__form");
const cardName = cardPopup.querySelector(".popup__input_type_card-name");
const cardUrl = cardPopup.querySelector(".popup__input_type_url");
// Состояние кнопки до создания карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  createCard(cardName.value, cardUrl.value, true);
  cardSave.reset();
  closeModal(cardPopup);
  toggleButtonState(Array.from(cardPopup.querySelectorAll('.popup__input')), btnCardSave);
}
cardSave.addEventListener("submit", handleCardFormSubmit);

// Перебор массива с данными
initialCards.forEach(function (elem) {
  createCard(elem.name, elem.link, false);
});
// Функция создания карточки
const popupImg = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");
function createCard(name, link, isUserCard) {
  const item = template.content.cloneNode(true);
  let img = item.querySelector(".card__image");
  let title = item.querySelector(".card__title");
  setImageAttributes(img, link, name)
  title.textContent = name;

  // Функция открытия и закрытия поп-апа с картинкой
  img.addEventListener("click", () => {
    setImageAttributes(popupImg, link, name)
    popupCaption.textContent = name;
    openModal(imagePopup);
  });
  // Функция закрытия изображения карточки
  const btnImgClose = imagePopup.querySelector(".popup__close");
  btnImgClose.addEventListener("click", () => closeModal(imagePopup));
  // Функция «Лайк» для всех карточек
  const btnCardLikes = item.querySelector(".card__like-button");
  btnCardLikes.addEventListener("click", (evt) => {
    evt.currentTarget.classList.toggle("card__like-button_is-active");
  });
  // Функция удаления карточки
  const btnCardDelete = item.querySelector(".card__delete-button");
  btnCardDelete.addEventListener("click", () => {
    const card = btnCardDelete.closest(".places__item");
    return card.remove();
  });

  if (isUserCard) {
    return appendCard.prepend(item);
  } else {
    return appendCard.append(item);
  }
}

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
profilePopup.addEventListener('submit', handleProfileFormSubmit)
// Обработчик события закрытия окна редактирования профиля
btnProfileClose.addEventListener("click", () => closeModal(profilePopup));

// Функция перебора form
function enableValidation() {
  const formList = Array.from(document.querySelectorAll('.popup__form'));
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  })
}
enableValidation();

// Функция перебора input-form
function setEventListeners(formElement) {
  const  inputList = Array.from(formElement.querySelectorAll('.popup__input'))
  const buttonElement = formElement.querySelector('.popup__button'); 
  if (formElement==cardSave) {
    toggleButtonState(inputList, buttonElement);
  }
  inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
        checkInputValidity(formElement, inputElement);
        toggleButtonState(inputList, buttonElement);
      });
  });
};

// Функция показа ошибки валидации
function showInputError(formElement, inputElement, errorMessage) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__input-error_active');
}
// Функция скрытия ошибки валидации
function hideInputError(formElement, inputElement,) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove('popup__input_type_error');
  errorElement.classList.remove('popup__input-error_active');
  errorElement.textContent = '';
}

// Функция для проверки валидности формы
const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

// Функция проверки полей на валидность
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};
// Функция выключения кнопки
function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {  // Если есть хотя бы одно невалидное поле
    buttonElement.classList.add('popup__button-disabled');
    buttonElement.disabled = true;
  } else {  // Если все поля валидны
    buttonElement.classList.remove('popup__button-disabled');
    buttonElement.disabled = false;
  }
}

// Функция закрытия popap через overlay
const CloseByOverlay = (evt, popup) => {
  if (evt.currentTarget === evt.target) {
    closeModal(popup)
  }
}

cardPopup.addEventListener("click", (evt) => CloseByOverlay(evt, cardPopup));
profilePopup.addEventListener("click", (evt) => CloseByOverlay(evt, profilePopup));
imagePopup.addEventListener("click", (evt) => CloseByOverlay(evt, imagePopup));

// Функция закрытия popap через Esc
function closeByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');       
    closeModal(openedPopup);
  } 
}
