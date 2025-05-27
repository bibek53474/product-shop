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
    <select id="pcategory">
      <option value="Toner">Toner</option>
      <option value="Serum">Serum</option>
      <option value="Snail Mucin">Snail Mucin</option>
      <option value="Moisturiser">Moisturiser</option>
      <option value="Sunscreen">Sunscreen</option>
      <option value="Eye Cream">Eye Cream</option>
      <option value="Retinal Serum">Retinal Serum</option>
      <option value="Cleansing Oil">Cleansing Oil</option>
      <option value="Cleansing Foam">Cleansing Foam</option>
    </select><br><br>
    <input id="psocial" placeholder="Social Media"><br><br>
    <input id="sellerName" placeholder="Your Name"><br><br>
    <input id="sellerPhone" placeholder="Phone Number"><br><br>
    <input id="pimage" type="file" accept="image/*"><br><br>
    <button onclick="addProduct()">Add Product</button>
  `;
}

function addProduct() {
  const name = document.getElementById('pname').value.trim();
  const price = document.getElementById('pprice').value.trim();
  const category = document.getElementById('pcategory').value;
  const social = document.getElementById('psocial').value.trim();
  const sellerName = document.getElementById('sellerName').value.trim();
  const sellerPhone = document.getElementById('sellerPhone').value.trim();
  const imageFile = document.getElementById('pimage').files[0];

  if (!name || !price || !category || !social || !sellerName || !sellerPhone || !imageFile) {
    alert("Please fill all fields.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageData = event.target.result;
    const newProduct = {
      id: "product" + Date.now(),
      name,
      price,
      category,
      social,
      sellerName,
      sellerPhone,
      image: imageData
    };

    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    filterByCategory(); // refresh product list
    document.getElementById('form-area').innerHTML = '';
  };
  reader.readAsDataURL(imageFile);
}

function displayProduct(product) {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';
  productDiv.id = product.id;
  productDiv.setAttribute("data-category", product.category);

  let html = `
    <img src="${product.image}" style="width:100%; border-radius:8px;">
    <h3>${product.name}</h3>
    <p>Price: Rs. ${product.price}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>To purchase:</strong></p>
    <ul>
      <li>Send Rs. ${product.price} to <strong>eSewa ID: 9811166382</strong></li>
      <li>Send screenshot to <strong>anushapathak45@gmail.com</strong></li>
    </ul>
  `;

  if (userRole === "admin") {
    html += `
      <hr>
      <p><strong>Social:</strong> ${product.social}</p>
      <p><strong>Seller:</strong> ${product.sellerName}</p>
      <p><strong>Phone:</strong> ${product.sellerPhone}</p>
      <button onclick="deleteProduct('${product.id}')">Delete Product</button>
    `;
  }

  productDiv.innerHTML = html;
  document.getElementById('product-list').appendChild(productDiv);
}

function deleteProduct(productId) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products = products.filter(p => p.id !== productId);
  localStorage.setItem("products", JSON.stringify(products));
  filterByCategory();
}

function filterByCategory() {
  const selected = document.getElementById("categorySelect").value;
  const listDiv = document.getElementById("product-list");
  const title = document.getElementById("product-title");

  listDiv.innerHTML = "";
  if (!selected) {
    title.style.display = "none";
    return;
  }

  title.style.display = "block";
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.filter(p => p.category === selected).forEach(p => displayProduct(p));
}

window.onload = function () {
  document.getElementById("product-list").innerHTML = "";
  document.getElementById("product-title").style.display = "none";
};
