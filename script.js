let productCount = parseInt(localStorage.getItem("productCount")) || 0;
let userRole = "";
let isLoggedIn = false;

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  if (role === "admin" && username === "admin" && password === "anusha@411") {
    userRole = "admin";
    isLoggedIn = true;
    document.getElementById('login-area').style.display = "none";
    document.getElementById('admin-controls').style.display = "block";
  } else if (role === "seller" && username === "seller" && password === "1234") {
    userRole = "seller";
    document.getElementById('login-area').style.display = "none";
    document.getElementById('commission-area').style.display = "block";
  } else {
    alert("Invalid credentials!");
  }
}

function proceedAsSeller() {
  const agreed = document.getElementById('agree-commission').checked;
  if (!agreed) {
    alert("You must agree to the commission before proceeding.");
    return;
  }
  isLoggedIn = true;
  document.getElementById('commission-area').style.display = "none";
  document.getElementById('admin-controls').style.display = "block";
}

function showProductForm() {
  document.getElementById('form-area').innerHTML = `
    <h3>Add New Product</h3>
    <input id="pname" placeholder="Product Name"><br><br>
    <input id="pprice" placeholder="Price" type="number"><br><br>
    <input id="pimage" type="file" accept="image/*"><br><br>
    <button onclick="addProduct()">Add Product to List</button>
  `;
}

function addProduct() {
  const name = document.getElementById('pname').value.trim();
  const price = document.getElementById('pprice').value.trim();
  const imageFile = document.getElementById('pimage').files[0];

  if (!name || !price || !imageFile) {
    alert("Please fill all fields and select an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageData = event.target.result;
    productCount++;
    localStorage.setItem("productCount", productCount);

    const newProduct = {
      id: "product" + Date.now(),
      name: name,
      price: price,
      image: imageData
    };

    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    displayAllProducts();
    document.getElementById('form-area').innerHTML = '';
  };
  reader.readAsDataURL(imageFile);
}

function displayAllProducts() {
  const listDiv = document.getElementById('product-list');
  listDiv.innerHTML = '';
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.forEach(product => displayProduct(product));
}

function displayProduct(product) {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';
  productDiv.id = product.id;

  let html = `
    <img src="${product.image}" style="width:100%; border-radius:8px;">
    <h3>${product.name}</h3>
    <p>Price: Rs. ${product.price}</p>
    <p><strong>To purchase:</strong></p>
    <ul>
      <li>Send Rs. ${product.price} to <strong>eSewa ID: 9811166382</strong></li>
      <li>Send screenshot to <strong>anushapathak45@gmail.com</strong></li>
    </ul>
  `;

  if (userRole === "admin") {
    html += `<button onclick="deleteProduct('${product.id}')">Delete Product</button>`;
  }

  productDiv.innerHTML = html;
  document.getElementById('product-list').appendChild(productDiv);
}

function deleteProduct(productId) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  const updatedProducts = products.filter(p => p.id !== productId);
  localStorage.setItem("products", JSON.stringify(updatedProducts));
  displayAllProducts();
}

window.onload = function () {
  displayAllProducts();
  productCount = (JSON.parse(localStorage.getItem("products")) || []).length;
};
