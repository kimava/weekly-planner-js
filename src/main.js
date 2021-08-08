import UNSPLASH_API_KEY from './api_key.js';

// change bg img using Unsplash search
const config = document.querySelector('.fa-cog');
const popUp = document.querySelector('.pop-up');
const deleteBtn = document.querySelector('.pop-up__delete');
const input = document.querySelector('.search__query');
const button = document.querySelector('.search__btn');
const imageSection = document.querySelector('.search__results');
const container = document.querySelector('.container');

const URL = `https://api.unsplash.com/search/photos?page=1&per_page=20&client_id=${UNSPLASH_API_KEY}`;

config.addEventListener('click', () => {
  popUp.classList.remove('pop-up--hide');
});

deleteBtn.addEventListener('click', () => {
  popUp.classList.add('pop-up--hide');
});

button.addEventListener('click', onSearch);

function onSearch(event) {
  event.preventDefault();
  const searchTerm = input.value;
  search(searchTerm).then(displayImgs);
  input.value = '';
}

function search(searchTerm) {
  let url = `${URL}&query=${searchTerm}`;
  return fetch(url)
    .then((response) => response.json())
    .then((result) => {
      return result.results;
    });
}

function displayImgs(images) {
  imageSection.innerHTML = '';
  images.forEach((image) => {
    let imageElement = document.createElement('img');
    imageElement.src = image.urls.regular;
    let userName = document.createElement('span');
    userName.innerHTML = `<a href="${image.user.links.html}" target="_blank" class="search__user">by ${image.user.name}</a>`;
    imageSection.appendChild(imageElement);
    imageSection.appendChild(userName);
  });
}

imageSection.addEventListener('click', changeBg);

function changeBg(event) {
  container.style.backgroundImage = `url(${event.target.src})`;
}
