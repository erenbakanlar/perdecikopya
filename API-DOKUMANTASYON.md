# 📚 API Dokümantasyonu

## Base URL
```
http://localhost:5000/api
```

## Authentication

Tüm korumalı endpoint'ler için header'a token ekleyin:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 AUTH ENDPOINTS

### 1. Kullanıcı Kaydı
```http
POST /api/auth/register
```

**Body:**
```json
{
  "fullName": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456",
  "phone": "05551234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kayıt başarılı",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "phone": "05551234567",
    "role": "user"
  }
}
```

### 2. Kullanıcı Girişi
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "test@test.com",
  "password": "test123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Giriş başarılı",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "Test Kullanıcı",
    "email": "test@test.com",
    "role": "user"
  }
}
```

### 3. Kullanıcı Bilgilerini Getir
```http
GET /api/auth/me
Authorization: Bearer TOKEN
```

---

## 🛍️ PRODUCT ENDPOINTS

### 1. Tüm Ürünleri Listele
```http
GET /api/products
GET /api/products?category=Zebra Perde
GET /api/products?search=zebra
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Zebra Perde – Beyaz",
      "category": "Zebra Perde",
      "price": 299,
      "description": "Modern ve şık zebra perde",
      "image": "https://...",
      "stock": 50,
      "isActive": true
    }
  ]
}
```

### 2. Tek Ürün Detayı
```http
GET /api/products/:id
```

### 3. Yeni Ürün Ekle (Admin)
```http
POST /api/products
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "name": "Yeni Perde",
  "category": "Stor Perde",
  "price": 350,
  "description": "Açıklama",
  "image": "https://...",
  "stock": 100
}
```

---

## 📦 ORDER ENDPOINTS

### 1. Yeni Sipariş Oluştur
```http
POST /api/orders
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "Ahmet Yılmaz",
    "phone": "05551234567",
    "address": "Adres detayı",
    "city": "Antalya",
    "district": "Muratpaşa"
  },
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sipariş başarıyla oluşturuldu",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-1234567890",
    "user": "507f1f77bcf86cd799439011",
    "items": [...],
    "totalPrice": 598,
    "status": "pending"
  }
}
```

### 2. Kullanıcının Siparişleri
```http
GET /api/orders/my-orders
Authorization: Bearer TOKEN
```

### 3. Tüm Siparişler (Admin)
```http
GET /api/orders
GET /api/orders?status=pending
Authorization: Bearer ADMIN_TOKEN
```

### 4. Sipariş Durumu Güncelle (Admin)
```http
PUT /api/orders/:id/status
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "status": "processing"
}
```

**Status değerleri:**
- `pending` - Bekleyen
- `processing` - İşleniyor
- `shipped` - Kargoda
- `delivered` - Teslim Edildi
- `cancelled` - İptal

---

## 🎯 Frontend'den Kullanım Örnekleri

### Giriş Yap
```javascript
const response = await API.login('test@test.com', 'test123');
console.log(response.user);
```

### Ürünleri Getir
```javascript
const data = await API.getProducts();
console.log(data.products);
```

### Sipariş Ver
```javascript
const orderData = {
  items: [
    { product: 'PRODUCT_ID', quantity: 2 }
  ],
  shippingAddress: {
    fullName: 'Ahmet Yılmaz',
    phone: '05551234567',
    address: 'Adres',
    city: 'Antalya',
    district: 'Muratpaşa'
  },
  paymentMethod: 'card'
};

const response = await API.createOrder(orderData);
console.log(response.order.orderNumber);
```

---

## ❌ Hata Kodları

- `400` - Bad Request (Geçersiz veri)
- `401` - Unauthorized (Giriş gerekli)
- `403` - Forbidden (Yetki yok)
- `404` - Not Found (Bulunamadı)
- `500` - Server Error (Sunucu hatası)

**Hata Response:**
```json
{
  "success": false,
  "message": "Hata mesajı"
}
```
