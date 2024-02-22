const UserInput = document.getElementById('userInput');
const checkboxContainer = document.getElementById('checkboxContainer');
const tableContainer = document.getElementById('tableContainer');
const paginationDiv = document.getElementById('pagination');

let result;
let currentPage = 1;
const rowsPerPage = 10;
let checkboxes = [];

async function GetData() {
    const response = await fetch('https://dummyapi.online/api/users');
    result = await response.json();
    createCheckboxes();
    showData(result);
    setupPagination();
}
GetData();

function createCheckboxes() {
    const keys = Object.keys(result[0]);
    const filteredKeys = keys.filter(key => key !== 'address');
    filteredKeys.forEach(key => {
        const checkbox = document.createElement('input');                            
        checkbox.type = 'checkbox';
        checkbox.name = 'filterKey';
        checkbox.id = key;
        checkbox.value = '';
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            idBehalf(UserInput.value);
        });
        const label = document.createElement('label');
        label.htmlFor = key;
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        const br = document.createElement('br');
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(br);
        checkboxes.push(checkbox);
    });
}

function showData(result) {
    tableContainer.innerHTML = ''; 
    const table = document.createElement('table');
    table.border = '2';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const keys = Object.keys(result[0]).filter(key => key !== 'address');
    const headerRow = document.createElement('tr');
    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, result.length);
    for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement('tr');
        keys.forEach(key => {
            const cell = document.createElement('td');
            if (key !== 'address') {
                cell.textContent = result[i][key];
                row.appendChild(cell);
            }
        });
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

function idBehalf(input) {
    const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.checked);
    let filteredArr;
    if (checkedCheckboxes.length === 0) {
        filteredArr = result.filter(item => {
            return Object.values(item).some(value => {
                if (typeof value === 'string' || typeof value === 'number') {
                    const stringValue = typeof value === 'number' ? value.toString() : value;
                    return stringValue.toLowerCase().includes(input.toLowerCase());
                }
                return false;
            });
        });
    } else {
        filteredArr = result.filter(item => {
            return checkedCheckboxes.some(checkbox => {
                const key = checkbox.id.toLowerCase();
                const value = item[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    const stringValue = typeof value === 'number' ? value.toString() : value;
                    return stringValue.toLowerCase().includes(input.toLowerCase());
                }
                return false;
            });
        });
    }

    if (filteredArr.length > 0) {
        currentPage = Math.ceil(filteredArr.length / rowsPerPage);
    }

    showData(filteredArr);
}

UserInput.addEventListener('keyup', (e) => {
    idBehalf(e.target.value);
});

function setupPagination() {
    const totalPages = Math.ceil(result.length / rowsPerPage);
    let paginationHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button onclick="goToPage(${i})">${i}</button>`;
    }
    paginationDiv.innerHTML = paginationHtml;
}

function goToPage(page) {
    currentPage = page;
    showData(result);
}


function idBehalf(input) {
    if (input.trim() === '') {
        currentPage = 1; 
        showData(result); 
        return; 
    }

    const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.checked);
    let filteredArr;
    if (checkedCheckboxes.length === 0) {
        filteredArr = result.filter(item => {
            return Object.values(item).some(value => {
                if (typeof value === 'string' || typeof value === 'number') {
                    const stringValue = typeof value === 'number' ? value.toString() : value;
                    return stringValue.toLowerCase().includes(input.toLowerCase());
                }
                return false;
            });
        });
    } else {
        
        filteredArr = result.filter(item => {
            return checkedCheckboxes.some(checkbox => {
                const key = checkbox.id.toLowerCase();
                const value = item[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    const stringValue = typeof value === 'number' ? value.toString() : value;
                    return stringValue.toLowerCase().includes(input.toLowerCase());
                }
                return false;
            });
        });
    }

   
    if (filteredArr.length > 0) {
        currentPage = Math.ceil(filteredArr.length / rowsPerPage);
    }

    showData(filteredArr);
}
