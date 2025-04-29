let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let searchElement = document.getElementById("search");
let mood = "create";
let tmp;
let searchMood = "title";

function getTotal() {
    if (price.value !== '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.backgroundColor = 'green';
    } else {
        total.innerHTML = '';
        total.style.backgroundColor = 'red';
    }
}


let dataProduct = localStorage.product ? JSON.parse(localStorage.product) : [];

submit.onclick = function () {
    let newProduct = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value,
    };

    // التحقق من صحة الإدخالات
    if (newProduct.title === '' || newProduct.price === '' || newProduct.category === '') {
        alert("Please fill in all required fields!");
        return;
    }

    if (mood === 'create') {
        let productCount = parseInt(newProduct.count) || 1; // استخدام قيمة افتراضية
        for (let i = 0; i < productCount; i++) {
            dataProduct.push({ ...newProduct });
        }
    } else {
        if (typeof tmp !== 'undefined' && tmp >= 0 && tmp < dataProduct.length) {
            dataProduct[tmp] = newProduct;
            mood = 'create';
            submit.innerHTML = "Create";
        } else {
            console.error("Invalid product index for update!");
        }
    }

    
    localStorage.setItem('product', JSON.stringify(dataProduct));


    clearData();
    showData();
};


function clearData() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = "";
    count.value = "";
    category.value = "";
}

function showData() {
    let table = "";
    for (let i = 0; i < dataProduct.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataProduct[i].title}</td>
            <td>${dataProduct[i].price}</td>
            <td>${dataProduct[i].taxes}</td>
            <td>${dataProduct[i].ads}</td>
            <td>${dataProduct[i].discount}</td>
            <td>${dataProduct[i].category}</td>
            <td><button class="update" onclick="updateData(${i})">Update</button></td>
            <td><button class="delete" onclick="deleteData(${i})">Delete</button></td>
        </tr>`;
    }
    document.getElementById("tbody").innerHTML = table;

    let btnDelete = document.getElementById("deleteAll");
    btnDelete.innerHTML = dataProduct.length > 0 ? 
        `<button onclick="deleteAll()" style="margin-top: 10px;width: 100%; " id="deleteAllBtn">Delete All (${dataProduct.length})</button>` : "";
}

function deleteData(i) {
    dataProduct.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(dataProduct));
    showData();
}

function deleteAll() {
    localStorage.removeItem("product");
    dataProduct = [];
    showData();
}

function updateData(i) {
    let product = dataProduct[i];
    title.value = product.title;
    price.value = product.price;
    taxes.value = product.taxes;
    ads.value = product.ads;
    discount.value = product.discount;
    category.value = product.category;
    getTotal();
    submit.innerHTML = "Update";
    mood = "update";
    tmp = i;
}

function getSearch(id) {
    let searchElement = document.getElementById("search");
    searchMood = id === "searchtitle" ? "title" : "category";
    searchElement.placeholder = searchMood === "title" ? "Search by title" : "Search by category";
    searchElement.focus();
}

function searchData(value) {
    let table = "";
    value = value.toLowerCase();
    
    for (let i = 0; i < dataProduct.length; i++) {
        let searchField = searchMood === "title" ? dataProduct[i].title : dataProduct[i].category;
        
        if (searchField.toLowerCase().includes(value)) {
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataProduct[i].title}</td>
                <td>${dataProduct[i].price}</td>
                <td>${dataProduct[i].taxes}</td>
                <td>${dataProduct[i].ads}</td>
                <td>${dataProduct[i].discount}</td>
                <td>${dataProduct[i].category}</td>
                <td><button class="update" onclick="updateData(${i})">Update</button></td>
                <td><button class="delete" onclick="deleteData(${i})">Delete</button></td>
            </tr>`;
        }
    }
    document.getElementById("tbody").innerHTML = table;
}

showData();
