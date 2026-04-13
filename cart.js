// Sepet yönetimi - BACKEND ENTEGRASYONU
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart(cart);
  showNotification('Ürün sepete eklendi!');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart);
      renderCart();
    }
  }
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? 'inline' : 'none';
  }
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItemsContainer');
  const emptyCart = document.getElementById('emptyCart');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.style.display = 'none';
    emptyCart.style.display = 'block';
    document.querySelector('.cart-summary').style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  emptyCart.style.display = 'none';
  document.querySelector('.cart-summary').style.display = 'block';
  
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="cart-item-category">${item.category}</p>
      </div>
      <div class="cart-item-quantity">
        <button onclick="updateQuantity('${item.id}', -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity('${item.id}', 1)">+</button>
      </div>
      <div class="cart-item-price">₺${(item.price * item.quantity).toFixed(2)}</div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">×</button>
    </div>
  `).join('');
  
  updateCartSummary();
}

function updateCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  document.getElementById('subtotal').textContent = `₺${subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `₺${subtotal.toFixed(2)}`;
}

function goToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showNotification('Sepetiniz boş!');
    return;
  }

  const lines = cart.map(item => `- ${item.name} x${item.quantity} = ₺${(item.price * item.quantity).toFixed(2)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  lines.push(`\nToplam: ₺${total.toFixed(2)}`);
  const message = encodeURIComponent('Merhaba, sipariş vermek istiyorum:\n\n' + lines.join('\n'));
  window.open(`https://wa.me/MÜŞTERİ TELEFONU?text=${message}`, '_blank');
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (document.getElementById('cartItemsContainer')) {
    renderCart();
  }
});
