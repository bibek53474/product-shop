let productCount = parseInt(localStorage.getItem("productCount")) || 0;
let isAdmin = false;

// Admin login function
function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === "admin" && pass === "1234") {
    isAdmin = true;
    document.getElementById('login-area').style.display = "none";
    document.getElementById('admin-controls').style.display = "block";
    document.getElementById('form-area').style.display = "block";
    // Optionally reload products to show delete buttons
    document.getElementById('product-list').innerHTML = '';
    let savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    savedProducts.forEach(p => displayProduct(p));
  } else {
    alert("Access denied!");
  }
}

// Show form to add product
function showProductForm() {
  document.getElementById('form-area').innerHTML = `
    <h3>Add New Product</h3>
    <input id="pname" placeholder="Product Name"><br><br>
    <input id="pprice" placeholder="Price" type="number"><br><br>
    <input id="pimage" type="file" accept="image/*"><br><br>
    <button onclick="addProduct()">Add Product to List</button>
  `;
}

// Add product and save to localStorage
function addProduct() {
  const name = document.getElementById('pname').value.trim();
  const price = document.getElementById('pprice').value.trim();
  const imageFile = document.getElementById('pimage').files[0];

  if (!name || !price || !imageFile) {
    alert("Please fill all fields and select an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const imageData = event.target.result;
    productCount++;
    localStorage.setItem("productCount", productCount);

    const newProduct = {
      id: "product" + productCount,
      name: name,
      price: price,
      image: imageData
    };

    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    displayProduct(newProduct);
    document.getElementById('form-area').innerHTML = '';
  };
  reader.readAsDataURL(imageFile);
}

// Display product with delete option only for admin
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
      <li>Use the eSewa mobile app or website to make the payment</li>
      <li>After sending, send a screenshot to <strong>anushapathak45@gmail.com</strong></li>
    </ul>
  `;

  if (isAdmin) {
    html += `<button onclick="deleteProduct('${product.id}')">Delete Product</button>`;
  }

  productDiv.innerHTML = html;
  document.getElementById('product-list').appendChild(productDiv);
}

// Delete a product from localStorage and UI
function deleteProduct(productId) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products = products.filter(p => p.id !== productId);
  localStorage.setItem("products", JSON.stringify(products));

  const productElement = document.getElementById(productId);
  if (productElement) {
    productElement.remove();
  }
}

// Load all products on page load
window.onload = function () {
  let savedProducts = JSON.parse(localStorage.getItem("products")) || [];
  savedProducts.forEach(p => displayProduct(p));
  productCount = savedProducts.length;
};
