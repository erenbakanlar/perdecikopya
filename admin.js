// Admin panel fonksiyonları
function loadDashboardStats() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  document.getElementById('totalCustomers').textContent = users.length;
}

function loadProducts() {
  const products = getProducts();
  const tbody = document.getElementById('productsTable');
  
  tbody.innerHTML = products.map(product => `
    <tr>
      <td><img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"></td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>₺${product.price.toFixed(2)}</td>
      <td>${product.stock || 'Sınırsız'}</td>
      <td>
        <button class="btn-small" onclick="editProduct('${product.id}')">Düzenle</button>
        <button class="btn-small btn-danger" onclick="deleteProduct('${product.id}')">Sil</button>
      </td>
    </tr>
  `).join('');
}

function showAddProductModal() {
  document.getElementById('modalTitle').textContent = 'Yeni Ürün Ekle';
  document.getElementById('productForm').reset();
  document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
}

function saveProduct(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const products = getProducts();
  
  const productId = formData.get('productId');
  const productData = {
    id: productId || 'PROD-' + Date.now(),
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    image: formData.get('image')
  };
  
  if (productId) {
    const index = products.findIndex(p => p.id === productId);
    products[index] = productData;
  } else {
    products.push(productData);
  }
  
  saveProducts(products);
  closeProductModal();
  loadProducts();
  showNotification('Ürün kaydedildi');
}

function editProduct(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (product) {
    document.getElementById('modalTitle').textContent = 'Ürün Düzenle';
    const form = document.getElementById('productForm');
    form.productId.value = product.id;
    form.name.value = product.name;
    form.category.value = product.category;
    form.price.value = product.price;
    form.stock.value = product.stock;
    form.image.value = product.image;
    document.getElementById('productModal').style.display = 'flex';
  }
}

function deleteProduct(productId) {
  if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
    let products = getProducts();
    products = products.filter(p => p.id !== productId);
    saveProducts(products);
    loadProducts();
    showNotification('Ürün silindi');
  }
}

function loadCustomers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const tbody = document.getElementById('customersTable');

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">Henüz müşteri yok</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.fullName}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${new Date(user.createdAt).toLocaleDateString('tr-TR')}</td>
    </tr>
  `).join('');
}

function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}


function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
