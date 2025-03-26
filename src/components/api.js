import {titleProfilePopup, descripProfilePopup, cardName, cardUrl} from './index.js'; 
const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
    headers: {
      authorization: '9217bbd1-6420-46cf-9ab3-aef34a4376eb',
      'Content-Type': 'application/json'
    }
};

async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return await response.json();
}

// Универсальная функция для запросов
async function fetchData(endpoint, method) {
    try {
        const response = await fetch(`${config.baseUrl}/${endpoint}`, {
            headers: config.headers,
            method: method
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Получение карточек
export function getCards() {
    return fetchData('cards', 'GET');
}

// Получение данных пользователя
export function getUser() {
    return fetchData('users/me', 'GET');
}
// Обновление данных пользователя
export async function updateUser() {
    try {
        const response = await fetch('https://nomoreparties.co/v1/apf-cohort-202/users/me', {
            headers: config.headers, 
            method: 'PATCH',
            body: JSON.stringify({
                name: titleProfilePopup.value,
                about: descripProfilePopup.value
              })
        });

        return await handleResponse(response);
    } catch(error) {
        console.error('Ошибка', error);
    }
}
// Добавление новых карточек
export async function addCards() {
    try {
        const response = await fetch('https://nomoreparties.co/v1/apf-cohort-202/cards', {
            headers: config.headers,
            method: 'POST',
            body: JSON.stringify({
                name: cardName.value,
                link: cardUrl.value,
            
              })
        })
        
        return await handleResponse(response);
    } catch(error){
        console.error('Ошибка', error)
    }
}

// Удаление карточек 
export async function deleteCards(cardId) {
    try {
        const response = await fetch(`https://nomoreparties.co/v1/apf-cohort-202/cards/${cardId}`, {
            headers:config.headers,
            method: 'DELETE'
        })
        return await handleResponse(response);
    } catch(err) {
        console.log('Ошибка', err)
    }
}

// Добавления лайка карточки
async function handleCardLike(cardId, method) {
    try {
        const response = await fetch(`https://nomoreparties.co/v1/apf-cohort-202/cards/likes/${cardId}`, {
            headers:config.headers,
            method: method
        })
        return await handleResponse(response)
        
    } catch(err) {console.log('Ошибка', err)}
}

export function addLikes(cardId, method) {
    return handleCardLike(cardId, method)
}

export function removeLikes(cardId, method) {
    return handleCardLike(cardId, method)
}
