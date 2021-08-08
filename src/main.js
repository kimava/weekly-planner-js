import UNSPLASH_API_KEY from './api_key.js';

// Change bg img using Unsplash search
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

// Update daily & weekly list
const todoInput = document.querySelector('.todo__input');

todoInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    onAddItem();
    updateWeekly();
  }
});

function updateWeekly() {
  days.forEach((day) => {
    let active = document.querySelector('.active');
    let activeDay = active.parentNode.dataset.id;

    if (activeDay === day.dataset.name) {
      let first = document.querySelector('.active span');
      const dayPtag = day.querySelector('.list__content');
      dayPtag.innerText = '';
      if (first) {
        let firstContent = first.innerHTML;
        dayPtag.innerText = `${firstContent}`;
      }
    }
  });
}

function onAddItem() {
  let todoItems = document.querySelector('.active');
  todoItems.addEventListener('click', (event) => {
    if (event.target.nodeName !== 'I') {
      return;
    }
    const icon = event.target;
    onClickIcon(icon);
  });
  const todoContent = todoInput.value;
  if (todoContent === '') {
    todoInput.focus();
    return;
  }
  const item = createItem(todoContent);
  todoItems.appendChild(item);
  todoInput.value = '';
  todoInput.focus();
}

function createItem(text) {
  const todoItem = document.createElement('li');
  todoItem.setAttribute('class', 'todo__item');
  todoItem.innerHTML = `
    <i class="fas fa-check todo__check"></i>
    <span class="todo__content">${text}</span>
    <i class="fas fa-times"></i>
  `;
  return todoItem;
}

//Check or delete to-do item
function onClickIcon(icon) {
  let list = icon.classList;
  switch (true) {
    case list.contains('todo__check'):
      icon.classList.toggle('checked');
      icon.nextElementSibling.classList.toggle('checked');
      break;
    case list.contains('fa-times'):
      icon.parentNode.remove();
      updateWeekly();
      break;
  }
}

//Show selected weekday to daily chart
const days = document.querySelectorAll('.weekly__list');
const daily = document.querySelector('.daily');

days.forEach((day) => {
  const id = day.dataset.name;
  const newDay = createDayTodo(id);
  daily.insertBefore(newDay, todoInput);
  newDay.style.display = 'none';
  newDay.style.pointerEvents = 'none';
  day.addEventListener('click', () => {
    if (day.dataset.name === newDay.dataset.id) {
      todoInput.style.pointerEvents = 'auto';
      newDay.style.display = 'block';
      newDay.style.pointerEvents = 'auto';
      newDay.childNodes[3].classList.add('active');
      const rest = dailyCharts
        .filter((chart) => day.dataset.name !== chart.dataset.id)
        .map((chart) => changeStatus(chart));
    }
  });
});

function changeStatus(item) {
  item.childNodes[3].classList.remove('active');
  item.style.display = 'none';
}

//Create daily chart for selected day
const dailyCharts = [...document.querySelectorAll('.daily__chart')];

function createDayTodo(id) {
  const dailyChart = document.createElement('div');
  dailyChart.setAttribute('class', 'daily__chart');
  dailyChart.setAttribute('data-id', id);
  dailyChart.innerHTML = `
    <h1 class="daily__title">${id} <strong>.</strong></h1>
    <ul class="todo__items"></ul>
  `;
  return dailyChart;
}
