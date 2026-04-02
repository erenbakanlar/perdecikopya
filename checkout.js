// Ödeme sayfası yönetimi - BACKEND ENTEGRASYONU
document.addEventListener('DOMContentLoaded', () => {
  loadCheckoutSummary();
  setupPaymentMethodToggle();
});

function loadCheckoutSummary() {
  const cart = getCart();
  const itemsContainer = document.getElementById('checkoutItems');
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  itemsContainer.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span>${item.name} × ${item.quantity}</span>
      <span>₺${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('checkoutSubtotal').textContent = `₺${subtotal.toFixed(2)}`;
  document.getElementById('checkoutTotal').textContent = `₺${subtotal.toFixed(2)}`;
}

function setupPaymentMethodToggle() {
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  const cardPayment = document.getElementById('cardPayment');
  
  paymentMethods.forEach(method => {
    method.addEventListener('change', (e) => {
      if (e.target.value === 'card') {
        cardPayment.style.display = 'block';
      } else {
        cardPayment.style.display = 'none';
      }
    });
  });
}

async function processOrder(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const cart = getCart();
  
  if (cart.length === 0) {
    showNotification('Sepetiniz boş!');
    return;
  }
  
  // Sipariş verilerini hazırla
  const orderData = {
    items: cart.map(item => ({
      product: item.id,
      quantity: item.quantity
    })),
    shippingAddress: {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      district: formData.get('district')
    },
    paymentMethod: formData.get('paymentMethod')
  };
  
  try {
    // Backend'e sipariş gönder
    const response = await API.createOrder(orderData);
    
    // Sepeti temizle
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Başarı sayfasına yönlendir
    window.location.href = `order-success.html?orderId=${response.order.orderNumber}`;
  } catch (error) {
    showNotification(error.message || 'Sipariş oluşturulamadı!');
  }
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
