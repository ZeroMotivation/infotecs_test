const tableBody = document.querySelector('.table__body');
const headers = document.querySelectorAll('.header');
const tableHead = document.querySelector('.table__head');
const form = document.querySelector('.edit-form');


const fillTable = (json) => {
    json.forEach((data) => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${data.name.firstName}</td>
                         <td>${data.name.lastName}</td>
                         <td class="about">${data.about}</td>
                         <td>${data.eyeColor}</td>`
        row.classList.add('row');
        row.addEventListener('click', () => {
            // const data = row.querySelectorAll('td');
            // data.forEach(d => console.log(d.innerText))
            const position = row.getBoundingClientRect();
            const width = row.offsetWidth;
            form.style.left = position.left + window.pageXOffset + width + "px";
            form.style.top = position.top + window.pageYOffset + "px";
            form.classList.toggle('active');
        })
        tableBody.append(row);
    });
}

tableHead.addEventListener('click', (evt) => {
    const target = evt.target;
    const rows = document.querySelectorAll('.row');
    target.classList.toggle('asc');
    let index = 0;
    headers.forEach((h, i) => {
        if(h == target) index = i;
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

fillTable(json);
