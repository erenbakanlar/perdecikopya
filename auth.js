// Kullanıcı kimlik doğrulama - BACKEND ENTEGRASYONU
async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
  
  try {
    const data = await API.login(email, password);
    showNotification('Giriş başarılı!');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    showNotification(error.message || 'Giriş başarısız!');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');
  
  if (password !== passwordConfirm) {
    showNotification('Şifreler eşleşmiyor!');
    return;
  }
  
  const userData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: password
  };
  
  try {
    await API.register(userData);
    showNotification('Kayıt başarılı! Yönlendiriliyorsunuz...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (error) {
    showNotification(error.message || 'Kayıt başarısız!');
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');
  
  // Demo admin: admin / admin123
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('adminUser', JSON.stringify({ username, role: 'admin' }));
    showNotification('Admin girişi başarılı!');
    setTimeout(() => {
      window.location.href = 'admin-dashboard.html';
    }, 1000);
  } else {
    showNotification('Kullanıcı adı veya şifre hatalı!');
  }
}

function logout() {
  API.logout();
}

function adminLogout() {
  localStorage.removeItem('adminUser');
  window.location.href = 'admin-login.html';
}

function checkAdminAuth() {
  const admin = localStorage.getItem('adminUser');
  if (!admin) {
    window.location.href = 'admin-login.html';
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
