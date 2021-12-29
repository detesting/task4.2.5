let input = document.querySelector('.input-project__input');
let timer

// Листенер для инпута
input.addEventListener('keyup', (e) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        let search = document.querySelector('.input-project__input').value

        const div = document.querySelector('.input-project');

        const dataRemove = document.querySelector('.input-datalist');
        if (dataRemove){
            div.removeChild(dataRemove)
        }
        if (search.length > 0){
            send(search)
        }
    }, 300)
})

// Отправка запроса
async function send(search) {
    let response = await fetch(`https://api.github.com/search/repositories?q=${search}`)
    response.json().then((res) => list(res.items.filter((item, index) => index < 5)))
}

// Функция для листенера пункта из списка
// добавляет карточку репозитория
function cardFn(item, e){
    e.preventDefault();

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
    close.addEventListener('click', (event) => deleteItem(event))

    card.appendChild(cardText);
    card.appendChild(close);
    cards.appendChild(card);

    document.querySelector('.input-project__input').value = '';
    document.querySelector('.input-datalist').remove();
}

// Удаление карточки (функция для листенера у карточки)
function deleteItem(e){
    e.preventDefault();
    let cards = document.querySelector('.cards');
    cards.removeChild(e.target.parentNode)
}

// Создание выпадающего списка
function list(items){
    if (items.length){
        const div = document.querySelector('.input-project');

        const datalist = document.createElement('ul');
        datalist.id = 'projects';
        datalist.classList.add('input-datalist');

        items.forEach((item) => {
            let option = document.createElement('li');
            option.textContent = item.name;
            option.classList.add('input-option');
            option.addEventListener('click', (e) => cardFn(item, e))

            datalist.appendChild(option);
        })
        div.appendChild(datalist);
    }
}
