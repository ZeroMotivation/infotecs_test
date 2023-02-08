const tableBody = document.querySelector('.table__body');
const headers = document.querySelectorAll('.header');
const tableHead = document.querySelector('.table__head');
const form = document.querySelector('.edit-form__wrapper');
const inputs = document.forms[0].elements;
const nav = document.querySelector('.nav__container');
const pageNum = document.querySelector('.nav__page');

let activeRow = 0;
let lastIndex = 0;
let rows = [];
const beginPage = 0;
const endPage = 5;
let page = beginPage;
const step = 10;
const createRows = (json) => {
    json.forEach((data, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${data.name.firstName}</td>
                         <td>${data.name.lastName}</td>
                         <td class="about">${data.about}</td>
                         <td>${data.eyeColor}</td>`;
        row.classList.add('row');
        row.addEventListener('click', () => {
            if(activeRow == row) {
                activeRow = 0;
            }
            else {
                if(activeRow) {
                    activeRow.classList.remove('selected');
                }
                activeRow = row;
            }
            row.classList.toggle('selected', activeRow == row);
            form.classList.toggle('opened', activeRow);
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

const renderTable = (index) => {
    tableBody.innerHTML = "";
    if(index === rows.length) {
        index = 0;
        lastIndex = 0;
        page = 0;
    }
    if(index < 0) {
        index = rows.length - step;
        lastIndex = rows.length - 2 * step;
        page = endPage;
    }
    for(let i = index; i < index + step; i++) {
        tableBody.append(rows[i]);
        lastIndex = i + 1;
    }
}

renderTable(0);

nav.addEventListener('click', (evt) => {
    const target = evt.target;
    page = parseInt(pageNum.innerText);
    if(target.classList.contains('nav__next-btn')) {
        renderTable(lastIndex);
        ++page;
        pageNum.innerText = page
    }
    if(target.classList.contains('nav__prev-btn')) {
        renderTable(lastIndex - 2 * step);
        --page;
        pageNum.innerText = page;
    }
})

form.addEventListener('click', (evt) => {
    const target = evt.target;
    if(target.classList.contains('save-btn')) {
        const cells = activeRow.querySelectorAll('td');
        cells.forEach((cell, i) => {
            cell.innerText = inputs[i].value;
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

tableHead.addEventListener('click', (evt) => {
    const target = evt.target;
    const rows = document.querySelectorAll('.row');
    target.classList.toggle('asc');
    let index = 0;
    headers.forEach((header, i) => {
        if(header == target) index = i;
    })
    let sorted = Array.from(rows).slice(0);
    if(target.classList.contains('asc')) {
        sorted.sort((a, b) => a.cells[index].innerText > b.cells[index].innerText ? 1 : -1);
        
    }
    else {
        sorted.sort((a, b) => a.cells[index].innerText < b.cells[index].innerText ? 1 : -1);
    }
    tableBody.append(...sorted);
});

