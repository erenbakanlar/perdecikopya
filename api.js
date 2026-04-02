// API Base URL
const API_URL = 'http://localhost:5000/api';

// Token yönetimi
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// API çağrıları için yardımcı fonksiyon
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Bir hata oluştu');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============ AUTH API ============

// Kullanıcı kaydı
const register = async (userData) => {
  const data = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  
  if (data.token) {
    setToken(data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
  }
  
  return data;
};

// Kullanıcı girişi
const login = async (email, password) => {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (data.token) {
    setToken(data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
  }
  
  return data;
};

// Kullanıcı bilgilerini getir
const getMe = async () => {
  return await apiCall('/auth/me');
};

// Çıkış yap
const logout = () => {
  removeToken();
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
};

// ============ PRODUCTS API ============

// Tüm ürünleri getir
const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `/products?${queryParams}` : '/products';
  return await apiCall(endpoint);
};

// Tek ürün getir
const getProduct = async (productId) => {
  return await apiCall(`/products/${productId}`);
};

// Yeni ürün ekle (Admin)
const createProduct = async (productData) => {
  return await apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};

// Ürün güncelle (Admin)
const updateProduct = async (productId, productData) => {
  return await apiCall(`/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
};

// Ürün sil (Admin)
const deleteProduct = async (productId) => {
  return await apiCall(`/products/${productId}`, {
    method: 'DELETE'
  });
};

// ============ ORDERS API ============

// Yeni sipariş oluştur
const createOrder = async (orderData) => {
  return await apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

// Kullanıcının siparişlerini getir
const getMyOrders = async () => {
  return await apiCall('/orders/my-orders');
};

// Tek sipariş detayı
const getOrder = async (orderId) => {
  return await apiCall(`/orders/${orderId}`);
};

// Tüm siparişleri getir (Admin)
const getAllOrders = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `/orders?${queryParams}` : '/orders';
  return await apiCall(endpoint);
};

// Sipariş durumunu güncelle (Admin)
const updateOrderStatus = async (orderId, status) => {
  return await apiCall(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
};

// ============ HELPER FUNCTIONS ============

// Kullanıcı giriş yapmış mı kontrol et
const isAuthenticated = () => {
  return !!getToken();
};

// Kullanıcı admin mi kontrol et
const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user.role === 'admin';
};

// Export all functions
window.API = {
  // Auth
  register,
  login,
  logout,
  getMe,
  
  // Products
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Orders
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  
  // Helpers
  isAuthenticated,
  isAdmin,
  getToken
};
