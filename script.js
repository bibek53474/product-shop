let userRole = "";

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  if (role === "admin" && username === "admin" && password === "admin") {
    userRole = "admin";
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
  if (!document.getElementById('agree-commission').checked) {
    alert("You must agree to the commission before proceeding.");
    return;
  }
  document.getElementById('commission-area').style.display = "none";
  document.getElementById('admin-controls').style.display = "block";
}

function showProductForm() {
  document.getElementById('form-area').innerHTML = `
    <form id="productForm" method="POST" action="upload.php" enctype="multipart/form-data">
      <h3>Add New Product</h3>

      <input name="pname" id="pname" placeholder="Product Name" required><br><br>

      <input name="pprice" id="pprice" placeholder="Price" type="number" required><br><br>

      <select name="pcategory" id="pcategory" required>
        <option value="">-- Select Category --</option>
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

      <input name="psocial" id="psocial" placeholder="Social Media" required><br><br>

      <input name="sellerName" id="sellerName" placeholder="Your Name" required><br><br>

      <input name="sellerPhone" id="sellerPhone" placeholder="Phone Number" required><br><br>

      <input name="pimage" id="pimage" type="file" accept="image/*" required><br><br>

      <button type="submit">Add Product</button>
    </form>
  `;
}

function addProduct() {
  const name = document.getElementById('pname').value;
  const price = document.getElementById('pprice').value;
  const category = document.getElementById('pcategory').value;
  const social = document.getElementById('psocial').value;
  const sellerName = document.getElementById('sellerName').value;
  const sellerPhone = document.getElementById('sellerPhone').value;
  const imageFile = document.getElementById('pimage').files[0];

  if (!imageFile) {
    alert("Please select an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const product = {
      id: "product" + Date.now(),
      name,
      price,
      category,
      social,
      sellerName,
      sellerPhone,
      image: event.target.result
    };

    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("lastSelectedCategory", category);
    filterByCategory();
  };

  reader.readAsDataURL(imageFile);
}

function displayProduct(product) {
  const div = document.createElement("div");
  div.className = "product";
  div.setAttribute("data-category", product.category);

  let html = `
    <img src="${product.image}" style="width:100%; border-radius:8px;">
    <h3>${product.name}</h3>
    <p>Price: Rs. ${product.price}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>To purchase:</strong></p>
    <ul>
      <li>Send Rs. ${product.price} to <strong>eSewa ID: 9869364223</strong></li>
      <li>Send screenshot to <strong>bibekbartaula311@gmail.com.com</strong></li>
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

  div.innerHTML = html;
  document.getElementById('product-list').appendChild(div);
}

function deleteProduct(productId) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products = products.filter(p => p.id !== productId);
  localStorage.setItem("products", JSON.stringify(products));
  filterByCategory();
}

function filterByCategory() {
  const selected = document.getElementById("categorySelect").value;
  localStorage.setItem("lastSelectedCategory", selected);

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
  const previousCategory = localStorage.getItem("lastSelectedCategory");
  if (previousCategory) {
    document.getElementById("categorySelect").value = previousCategory;
    filterByCategory();
  } else {
    document.getElementById("product-title").style.display = "none";
  }
};
