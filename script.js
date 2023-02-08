const tableBody = document.querySelector('.table__body');
const headers = document.querySelectorAll('.header');
const tableHead = document.querySelector('.table__head');
const form = document.querySelector('.edit-form__wrapper');
const inputs = document.forms[0].elements;
const nav = document.querySelector('.nav__container');
const pageNum = document.querySelector('.nav__page');

const STEP = 10; // Количество строк, отображаемых на странице
const BEGIN_PAGE = 0; // Индекс начальной страницы
const END_PAGE = 6; // Индекс конечной страницы

const rows = [];

let activeRow = 0; // Переменная для хранения активной на данный момент строки
let lastIndex = 0; 
let page = BEGIN_PAGE; // Текущий номер страницы

// Создание строк таблицы и подписка строк на событие click
const createRows = (json) => {
    json.forEach((data) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${data.name.firstName}</td>
                         <td>${data.name.lastName}</td>
                         <td class="about">${data.about}</td>
                         <td class="color" style="background-color: ${data.eyeColor}; color: ${data.eyeColor};">${data.eyeColor}</td>`;
        row.classList.add('row');

        row.addEventListener('click', () => {
            // При клике на строку смотрим - есть ли уже активаня строка
            // Если есть - делаем активную строку неактивной
            if(activeRow) {
                activeRow.classList.remove('selected');
            }

            // Если выбрана уже активная строка - текущая аткивная строка обнуляется
            // Иначе ативная строка стнавится равна выбранной строке
            activeRow = activeRow === row ? 0 : row;
            row.classList.toggle('selected', activeRow === row);
            form.classList.toggle('opened', activeRow);

            // Если сейчас есть активная строка - создаем форму редактирования данных рядом с этой строкой
            if(activeRow) {
                const position = activeRow.getBoundingClientRect();
                const width = activeRow.offsetWidth;
                form.style.left = position.left + window.pageXOffset + width + "px";
                form.style.top = position.top + window.pageYOffset + "px";
                const cells = activeRow.querySelectorAll('td');
                cells.forEach((cell, i) => {
                    inputs[i].value = cell.innerText;
                });
            }
        })

        rows.push(row);
    });
}

createRows(json);

// Функция для отрисовки 10 строк таблицы
// columnIndex - индекс строки массива rows, с которого начинаем добавление строк
const renderTable = (columnIndex) => {
    tableBody.innerHTML = "";
    // Если дошли до последнего элемента - обнуляем индексы и номер страницы
    // чтобы отрисовка строк началась сначала
    if(columnIndex === rows.length) {
        columnIndex = 0;
        lastIndex = 0;
        page = 0;
    }
    if(columnIndex < 0) {
        columnIndex = rows.length - STEP;
        lastIndex = rows.length - 2 * STEP;
        page = END_PAGE;
    }
    for(let i = columnIndex; i < columnIndex + STEP; i++) {
        tableBody.append(rows[i]);
        lastIndex = i + 1;
    }
}

renderTable(0);

// Перелистывание страниц  
nav.addEventListener('click', (evt) => {
    const target = evt.target;
    page = parseInt(pageNum.innerText);
    if(target.classList.contains('nav__next-btn')) {
        renderTable(lastIndex);
        ++page;
    }
    if(target.classList.contains('nav__prev-btn')) {
        renderTable(lastIndex - 2 * STEP);
        --page;
    }
    pageNum.innerText = page;
    form.classList.remove('opened');
})

// Форма редактирования строк
form.addEventListener('click', (evt) => {
    const target = evt.target;
    if(target.classList.contains('save-btn')) {
        const cells = activeRow.querySelectorAll('td');
        cells.forEach((cell, i) => {
            cell.innerText = inputs[i].value;
            if(cell.classList.contains('color')) {
                cell.style.cssText = `background-color: ${inputs[i].value}; color: ${inputs[i].value};`;
            }
        });
        activeRow.classList.remove('selected');
        form.classList.remove('opened');
    }
    if(target.classList.contains('cancel-btn')) {
        activeRow.classList.remove('selected');
        activeRow = 0;
        form.classList.remove('opened');
    }
})

// Сортировка строк по клику на соответсвующий заголовок
tableHead.addEventListener('click', (evt) => {
    const target = evt.target;
    // 
    const sliced = rows.slice(lastIndex - 10, lastIndex);
    target.classList.toggle('asc'); 
    let columnIndex = 0;  // Индекс колонки, по которой выполняется сортировка 
    headers.forEach((header, i) => {
        if(header == target) columnIndex = i;
    })
    if(target.classList.contains('asc')) {
        sliced.sort((a, b) => a.cells[columnIndex].innerText > b.cells[columnIndex].innerText ? 1 : -1);
    }
    else {
        sliced.sort((a, b) => a.cells[columnIndex].innerText < b.cells[columnIndex].innerText ? 1 : -1);
    }
    tableBody.append(...sliced);
});
