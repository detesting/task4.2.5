const debounce = (fn, debounceTime) => {
    let timer;
    return function (...arg){
        clearTimeout(timer)
        timer = setTimeout(() => fn.call(this, ...arg), debounceTime)
    }
};

// Функция для debounce
const searchFn = () => {
    const searchValue = document.querySelector('.input-project__input').value.trim()
    const divProject = document.querySelector('.input-project');
    const dataRemove = document.querySelector('.input-datalist');

    if (dataRemove){
        divProject.removeChild(dataRemove)
    }
    if (searchValue.length > 0){
        send(searchValue)
    }
}

const inputSearch = document.querySelector('.input-project__input');
// Листенер для инпута
inputSearch.addEventListener('input', debounce(searchFn, 200))

const send = async (search) => {
    let response = await fetch(`https://api.github.com/search/repositories?q=${search}&per_page=5`)
    await response.json().then((res) => list(res.items))
}

// Функция для листенера пункта из списка
// добавляет карточку репозитория
const cardFn = (item, event) => {
    event.preventDefault();

    const cards = document.getElementById('cards');
    const card = document.createElement('div');
    card.classList.add('card');

    const cardText = document.createElement('div');
    cardText.classList.add('card__text');

    const name = document.createElement('span');
    const author = document.createElement('span');
    const stars = document.createElement('span');

    name.textContent = 'Name: ' + item.name;
    author.textContent = 'Owner: ' + item.owner.login;
    stars.textContent = 'Stars: ' + item.stargazers_count;

    cardText.appendChild(name);
    cardText.appendChild(author);
    cardText.appendChild(stars);

    const close = document.createElement('div');
    close.classList.add('close');
    close.addEventListener('click', deleteItem)

    card.appendChild(cardText);
    card.appendChild(close);
    cards.appendChild(card);

    document.querySelector('.input-project__input').value = '';
    document.querySelector('.input-datalist').remove();
}

// Удаление карточки (функция для листенера у карточки)
const deleteItem = (event) => {
    event.preventDefault();
    let cards = document.querySelector('.cards');
    cards.removeChild(event.target.parentNode)
    event.target.removeEventListener('click', deleteItem)
}

// Создание выпадающего списка
const list = (items) => {
    const divProject = document.querySelector('.input-project');
    const dataRemove = document.querySelector('.input-datalist');
    if (dataRemove){
        divProject.removeChild(dataRemove)
    }

    const datalist = document.createElement('ul');
    datalist.id = 'projects';
    datalist.classList.add('input-datalist');
    if (items.length){
        items.forEach((item) => {
            let option = document.createElement('li');
            option.textContent = item.name;
            option.classList.add('input-option');
            option.addEventListener('click', (event) => cardFn(item, event))

            datalist.appendChild(option);
        })
    } else {
        let option = document.createElement('li');
        option.textContent = 'Ничего не найдено';
        option.classList.add('input-option');
        datalist.appendChild(option);
    }
    divProject.appendChild(datalist);
}
