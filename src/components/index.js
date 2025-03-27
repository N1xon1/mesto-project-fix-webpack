import "../pages/index.css";
import {createCard } from "./cards.js";
import { enableValidation, toggleButtonState } from "./validate.js";
import { openModal, closeModal, closeByEsc } from "./modal.js";

import { getUser, getCards, updateUser, addCards, deleteCards, addLikes, removeLikes, updateUserAvatar} from './api.js'
getCards().then(console.log);
getUser().then(console.log);

// @todo: DOM узлы
const appendCard = document.querySelector(".places__list");
const profilePopup = document.querySelector(".popup_type_edit");
const cardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const btnProfileOpen = document.querySelector(".profile__edit-button");
const btnProfileClose = profilePopup.querySelector(".popup__close");
const profileImage = document.querySelector('.profile__image');
export const titleProfilePopup = profilePopup.querySelector(".popup__input_type_name");
export const descripProfilePopup = profilePopup.querySelector(
  ".popup__input_type_description"
);

const titleProfile = document.querySelector(".profile__title");
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
function handleLikeButtonClick(evt, likes, quantityLikes, cardId) {
  evt.currentTarget.classList.toggle("card__like-button_is-active");
   
  // Добавляем или удаляем лайк
   if (evt.currentTarget.classList.contains("card__like-button_is-active")) {
    likes.push("1");
    addLikes(cardId, 'PUT');  // Добавляем лайк
  } else {
    likes.pop();
    removeLikes(cardId, 'DELETE'); // Удаляем лайк
  }

  // Обновляем количество лайков
  quantityLikes.textContent = likes.length;
}

// Функция для удаления карточки
function handleDeleteButtonClick(button, cardId) {
  const card = button.closest(".places__item");
  card.remove();
  deleteCards(cardId);
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

// Отправка формы для обработки карточки
async function handleCardFormSubmit(evt) {
  evt.preventDefault();
    //  Получаем текущего пользователя
    const userUpdate = await getUser();
    
    //  Создаем объект новой карточки
    const newCardData = {
      name: cardName.value,
      link: cardUrl.value,
      likes: []
    };

    //  Отправляем карточку на сервер
    const addedCard = await addCards(newCardData);
    
    // Создаем DOM-элемент карточки
    const { item, btnCardDelete } = createCard(
      addedCard.name, 
      addedCard.link, 
      true, 
      addedCard.likes,
    );

    // Добавляем карточку в начало списка
    appendCard.prepend(item);

    //  Если карточка принадлежит текущему пользователю - активируем удаление
    if (addedCard.owner._id === userUpdate._id) {
      btnCardDelete.classList.remove("disabled-button");
      btnCardDelete.addEventListener("click", () => {
        handleDeleteButtonClick(btnCardDelete, addedCard._id);
      });
    } else {
      btnCardDelete.classList.add("disabled-button");
    }

    // Очищаем форму и закрываем попап
    cardSave.reset();
    closeModal(cardPopup);
    
    //  Обновляем состояние кнопки
    toggleButtonState(
      Array.from(cardPopup.querySelectorAll(".popup__input")),
      btnCardSave,
      validationSettings
    );
}
cardSave.addEventListener("submit", handleCardFormSubmit);
// Получения iD пользователя
// let userId;
// async function getUserId(callback) {
//   const userUpdate = await getUser();
//   userId = userUpdate._id;
//   if (callback) callback(userId);
// };
// getUserId((id)=> {
//   console.log("User ID получен:", id); 
// });


// Создания карточек с сервера и удаления карточки
(async () => {
  const initialCards = await getCards();
  const userUpdate = await getUser();

  initialCards.forEach((card) => {
    const { item, btnCardDelete } = createCard(card.name, card.link, false, card.likes, card._id);

    appendCard.append(item);

    // (card.likes.forEach((el)=>{
    //   console.log(el._id, card._id)
    // }))

    // Если карточка принадлежит текущему пользователю — активируем удаление
    if (card.owner._id === userUpdate._id) {
      btnCardDelete.classList.remove("disabled-button");
      btnCardDelete.addEventListener("click", () => {
        handleDeleteButtonClick(btnCardDelete, card._id);
        console.log(card._id)
      });
    } else {
      btnCardDelete.classList.add("disabled-button");
    }
  });

})();

// Функция создания карточки
const popupImg = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

// Добавления текста по умолчания внутри формы изменений профиля
(async () => {
  const userUpdate = await getUser();
  
  titleProfile.textContent = userUpdate.name;
  descripProfile.textContent = userUpdate.about;
  titleProfilePopup.value = userUpdate.name;
  descripProfilePopup.value = userUpdate.about;
  // добавляем автар пользователя, полученный с сервера
  profileImage.style.backgroundImage = `url('${userUpdate.avatar}')`;
})();

// Обработчик события открытия окна редактирования профиля
btnProfileOpen.addEventListener("click", () => openModal(profilePopup));

// Функция обработки отправки формы
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  titleProfile.textContent = titleProfilePopup.value;
  descripProfile.textContent = descripProfilePopup.value;
  closeModal(profilePopup);
  updateUser();
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
// Обработчики открытия и закрытия popap смены аватара пользователя
const btnUserImageOpen = document.querySelector('.profile__image');
const updateAvatarPopup = document.querySelector('.popup_type_update_avatar');
const btnUserImageClose = updateAvatarPopup.querySelector('.popup__close');
btnUserImageOpen.addEventListener('click', () => openModal(updateAvatarPopup));
btnUserImageClose.addEventListener("click", () => closeModal(updateAvatarPopup));

// Обработчики сохранения popap смены аватара пользователя
updateAvatarPopup.addEventListener('submit', handleupdateAvatarSubmit);

// Функция созранения popap смены аватара пользователя
const inputAvatarPopup = updateAvatarPopup.querySelector('.popup__input');
const updateAvatar = updateAvatarPopup.querySelector('.popup__form')
function handleupdateAvatarSubmit(evt) {
  evt.preventDefault();
  updateUserAvatar(inputAvatarPopup.value);
  profileImage.style.backgroundImage = `url('${inputAvatarPopup.value}')`;
  closeModal(updateAvatarPopup);
  updateAvatar.reset()
}

// Обработчики события закрытия через overlay
cardPopup.addEventListener("click", (evt) => CloseByOverlay(evt, cardPopup));
profilePopup.addEventListener("click", (evt) => CloseByOverlay(evt, profilePopup));
imagePopup.addEventListener("click", (evt) => CloseByOverlay(evt, imagePopup));
updateAvatarPopup.addEventListener('click', (evt) => CloseByOverlay(evt,updateAvatarPopup))


export {
  setImageAttributes,
  appendCardToDOM,
  handleLikeButtonClick,
  handleDeleteButtonClick,
  openImagePopup,
  cardName,
  cardUrl
};
