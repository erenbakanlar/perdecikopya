# DuranOğlu Perde E-Ticaret Sistemi

Full-stack e-ticaret uygulaması - Node.js, Express, MongoDB ve Vanilla JavaScript

## 🚀 Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi (JWT Authentication)
- ✅ Ürün listeleme ve detay sayfaları
- ✅ Sepet yönetimi
- ✅ Sipariş oluşturma ve takip
- ✅ Admin paneli (sipariş ve ürün yönetimi)
- ✅ MongoDB veritabanı entegrasyonu
- ✅ RESTful API

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (yerel veya MongoDB Atlas)
- npm veya yarn

## 🛠️ Kurulum

### 1. Projeyi İndirin

```bash
git clone <repo-url>
cd duranoglu-perde
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

### 3. MongoDB Kurulumu

**Seçenek A: Yerel MongoDB**
- MongoDB'yi bilgisayarınıza kurun: https://www.mongodb.com/try/download/community
- MongoDB servisini başlatın

**Seçenek B: MongoDB Atlas (Cloud)**
- https://www.mongodb.com/cloud/atlas adresinden ücretsiz hesap oluşturun
- Cluster oluşturun
- Connection string'i alın

### 4. Environment Variables

`backend/.env` dosyasını düzenleyin:

```env
# Yerel MongoDB için:
MONGODB_URI=mongodb://localhost:27017/duranoglu-perde

# Veya MongoDB Atlas için:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/duranoglu-perde

JWT_SECRET=duranoglu_perde_super_secret_key_2025_change_this
PORT=5000
NODE_ENV=development
```

### 5. Veritabanını Doldurun

İlk ürünleri ve test kullanıcılarını ekleyin:

```bash
cd backend
node seed.js
```

Bu komut şunları ekler:
- 8 adet örnek ürün
- Admin kullanıcı: `admin@duranogluperde.com` / `admin123`
- Test kullanıcı: `test@test.com` / `test123`

## 🎯 Çalıştırma

### Backend'i Başlatın

```bash
cd backend
npm run dev
```

Backend http://localhost:5000 adresinde çalışacak

### Frontend'i Başlatın

Başka bir terminal açın:

```bash
# Ana dizinde
npm run dev
```

Frontend http://localhost:3000 adresinde çalışacak (veya package.json'daki port)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Kullanıcı bilgilerini getir (Protected)

### Products
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Tek ürün detayı
- `POST /api/products` - Yeni ürün ekle (Admin)
- `PUT /api/products/:id` - Ürün güncelle (Admin)
- `DELETE /api/products/:id` - Ürün sil (Admin)

### Orders
- `POST /api/orders` - Yeni sipariş oluştur (Protected)
- `GET /api/orders/my-orders` - Kullanıcının siparişleri (Protected)
- `GET /api/orders/:id` - Sipariş detayı (Protected)
- `GET /api/orders` - Tüm siparişler (Admin)
- `PUT /api/orders/:id/status` - Sipariş durumu güncelle (Admin)

## 🔐 Giriş Bilgileri

### Admin Paneli
- E-posta: `admin@duranogluperde.com`
- Şifre: `admin123`
- URL: http://localhost:3000/admin-login.html

### Test Kullanıcı
- E-posta: `test@test.com`
- Şifre: `test123`

## 📁 Proje Yapısı

```
duranoglu-perde/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB bağlantısı
│   ├── controllers/
│   │   ├── authController.js  # Kimlik doğrulama
│   │   ├── orderController.js # Sipariş işlemleri
│   │   └── productController.js # Ürün işlemleri
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js            # Kullanıcı modeli
│   │   ├── Product.js         # Ürün modeli
│   │   └── Order.js           # Sipariş modeli
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── orders.js          # Order routes
│   │   └── products.js        # Product routes
│   ├── .env                   # Environment variables
│   ├── server.js              # Ana server dosyası
│   ├── seed.js                # Veritabanı seed
│   └── package.json
├── api.js                     # Frontend API çağrıları
├── auth.js                    # Frontend auth fonksiyonları
├── cart.js                    # Sepet yönetimi
├── checkout.js                # Ödeme işlemleri
├── index.html                 # Ana sayfa
├── cart.html                  # Sepet sayfası
├── checkout.html              # Ödeme sayfası
├── login.html                 # Giriş sayfası
├── register.html              # Kayıt sayfası
└── admin-*.html               # Admin paneli sayfaları
```

## 🔧 Geliştirme

### Backend Değişikliklerini İzleme

```bash
cd backend
npm run dev  # nodemon ile otomatik yeniden başlatma
```

### API Test Etme

Postman veya Thunder Client kullanarak API'yi test edebilirsiniz.

Örnek istek:

```bash
# Giriş yap
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Ürünleri listele
curl http://localhost:5000/api/products
```

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası

```
❌ MongoDB Bağlantı Hatası: connect ECONNREFUSED
```

**Çözüm:**
- MongoDB servisinin çalıştığından emin olun
- `.env` dosyasındaki `MONGODB_URI` değerini kontrol edin

### Port Zaten Kullanımda

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Çözüm:**
- `.env` dosyasında farklı bir port belirleyin
- Veya çalışan process'i durdurun

### CORS Hatası

```
Access to fetch at 'http://localhost:5000/api/...' has been blocked by CORS policy
```

**Çözüm:**
- Backend'de CORS middleware'inin aktif olduğundan emin olun
- `server.js` dosyasında `app.use(cors())` satırı olmalı

## 📝 Notlar

- LocalStorage sepet sistemi korunmuştur (offline çalışma için)
- Sipariş verme işlemi backend'e bağlıdır ve giriş gerektirir
- Admin paneli şu an demo modda çalışıyor (backend entegrasyonu eklenebilir)

## 🚀 Production'a Alma

1. `.env` dosyasında `NODE_ENV=production` yapın
2. Güvenli bir `JWT_SECRET` oluşturun
3. MongoDB Atlas kullanın
4. Backend'i Heroku, DigitalOcean veya AWS'e deploy edin
5. Frontend'i Netlify, Vercel veya GitHub Pages'e deploy edin

## 📞 İletişim

Sorularınız için: info@duranogluperde.com

## 📄 Lisans

MIT License
