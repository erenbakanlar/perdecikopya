// Admin panel fonksiyonları
function loadDashboardStats() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('totalRevenue').textContent = `₺${totalRevenue.toFixed(2)}`;
  document.getElementById('totalCustomers').textContent = users.length;
  document.getElementById('pendingOrders').textContent = pendingOrders;
  
  loadRecentOrders();
}

function loadRecentOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const recentOrders = orders.slice(-5).reverse();
  const tbody = document.getElementById('recentOrdersTable');
  
  if (recentOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Henüz sipariş yok</td></tr>';
    return;
  }
  
  tbody.innerHTML = recentOrders.map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${order.customer.fullName}</td>
      <td>${new Date(order.date).toLocaleDateString('tr-TR')}</td>
      <td>₺${order.total.toFixed(2)}</td>
      <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
      <td><a href="admin-orders.html" class="btn-small">Detay</a></td>
    </tr>
  `).join('');
}

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const tbody = document.getElementById('ordersTable');
  
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">Henüz sipariş yok</td></tr>';
    return;
  }
  
  tbody.innerHTML = orders.reverse().map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${order.customer.fullName}</td>
      <td>${order.customer.phone}</td>
      <td>${new Date(order.date).toLocaleDateString('tr-TR')}</td>
      <td>₺${order.total.toFixed(2)}</td>
      <td>
        <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Bekleyen</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>İşleniyor</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Kargoda</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Teslim Edildi</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>İptal</option>
        </select>
      </td>
      <td><button class="btn-small" onclick="viewOrderDetails('${order.id}')">Detay</button></td>
    </tr>
  `).join('');
}

function updateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem('orders', JSON.stringify(orders));
    showNotification('Sipariş durumu güncellendi');
  }
}

function viewOrderDetails(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const order = orders.find(o => o.id === orderId);
  if (order) {
    alert(`Sipariş Detayları:\n\nSipariş No: ${order.id}\nMüşteri: ${order.customer.fullName}\nTelefon: ${order.customer.phone}\nAdres: ${order.customer.address}, ${order.customer.district}/${order.customer.city}\n\nÜrünler:\n${order.items.map(item => `${item.name} x${item.quantity} - ₺${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\nToplam: ₺${order.total.toFixed(2)}`);
  }
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
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const tbody = document.getElementById('customersTable');
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">Henüz müşteri yok</td></tr>';
    return;
  }
  
  tbody.innerHTML = users.map(user => {
    const userOrders = orders.filter(o => o.customer.email === user.email).length;
    return `
      <tr>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${new Date(user.createdAt).toLocaleDateString('tr-TR')}</td>
        <td>${userOrders}</td>
      </tr>
    `;
  }).join('');
}

function getStatusText(status) {
  const statusMap = {
    pending: 'Bekleyen',
    processing: 'İşleniyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal'
  };
  return statusMap[status] || status;
}

function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

function filterOrders() {
  const filter = document.getElementById('statusFilter').value;
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  
  const tbody = document.getElementById('ordersTable');
  tbody.innerHTML = filtered.reverse().map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${order.customer.fullName}</td>
      <td>${order.customer.phone}</td>
      <td>${new Date(order.date).toLocaleDateString('tr-TR')}</td>
      <td>₺${order.total.toFixed(2)}</td>
      <td>
        <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Bekleyen</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>İşleniyor</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Kargoda</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Teslim Edildi</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>İptal</option>
        </select>
      </td>
      <td><button class="btn-small" onclick="viewOrderDetails('${order.id}')">Detay</button></td>
    </tr>
  `).join('');
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
