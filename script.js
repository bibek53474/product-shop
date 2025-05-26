// Get product count from localStorage (if exists)
let productCount = parseInt(localStorage.getItem("productCount")) || 0;

// Show the product input form
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
  reader.onload = function(event) {
    const imageData = event.target.result;

    productCount++;
    localStorage.setItem("productCount", productCount); // Save latest count

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
    document.getElementById('form-area').innerHTML = ''; // Clear form
  };

  reader.readAsDataURL(imageFile);
}

// Display a product on the page
function displayProduct(product) {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';
  productDiv.id = product.id;

  productDiv.innerHTML = `
    <img src="${product.image}" style="width:100%; border-radius:8px;">
    <h3>${product.name}</h3>
    <p>Price: Rs. ${product.price}</p>
    <p><strong>To purchase:</strong></p>
    <ul>
      <li>Send Rs. ${product.price} to <strong>eSewa ID: 9811166382</strong></li>
      <li>Use the eSewa mobile app or website to make the payment</li>
      <li>After sending, send a screenshot to <strong>anushapathak45@gmail.com</strong></li>
    </ul>
    <button onclick="deleteProduct('${product.id}')">Delete Product</button>
  `;

  document.getElementById('product-list').appendChild(productDiv);
}

// Delete a product from localStorage and the page
function deleteProduct(productId) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products = products.filter(p => p.id !== productId);
  localStorage.setItem("products", JSON.stringify(products));

  const productElement = document.getElementById(productId);
  if (productElement) {
    productElement.remove();
  }
}

// Load all products when page is opened
window.onload = function() {
  let savedProducts = JSON.parse(localStorage.getItem("products")) || [];
  savedProducts.forEach(p => displayProduct(p));

  // Set count to number of saved products
  productCount = savedProducts.length;
};
