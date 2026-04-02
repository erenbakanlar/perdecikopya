# ⚡ Hızlı Başlangıç - 5 Dakikada Çalıştırın!

## 1️⃣ Backend Kurulumu (2 dakika)

```bash
cd backend
npm install
```

## 2️⃣ MongoDB Hazırlayın (1 dakika)

**En Kolay Yol: Yerel MongoDB**

Windows:
```bash
# MongoDB'yi indirin: https://www.mongodb.com/try/download/community
# Kurulum sonrası otomatik başlar
```

Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

## 3️⃣ Veritabanını Doldurun (30 saniye)

```bash
cd backend
node seed.js
```

✅ Çıktı:
```
✅ MongoDB bağlantısı başarılı
🗑️  Eski veriler temizlendi
✅ Ürünler eklendi
✅ Admin kullanıcı eklendi
✅ Test kullanıcı eklendi

🎉 Veritabanı başarıyla dolduruldu!

📝 Giriş Bilgileri:
Admin: admin@duranogluperde.com / admin123
Test: test@test.com / test123
```

## 4️⃣ Backend'i Başlatın (30 saniye)

```bash
cd backend
npm run dev
```

✅ Çıktı:
```
✅ MongoDB Bağlantısı Başarılı: localhost:27017
🚀 Server 5000 portunda çalışıyor
📍 http://localhost:5000
```

## 5️⃣ Frontend'i Başlatın (30 saniye)

**YENİ TERMINAL AÇIN:**

```bash
npm run dev
```

✅ Çıktı:
```
VITE ready in 500 ms
➜  Local:   http://localhost:5173/
```

## 🎉 HAZIR!

Tarayıcınızda açın: **http://localhost:5173**

---

## 🧪 Test Senaryosu

### 1. Kullanıcı Olarak Test

1. **Kayıt Ol** butonuna tıklayın
2. Bilgilerinizi girin ve kayıt olun
3. Otomatik giriş yapılacak
4. Bir ürüne tıklayın ve **Sepete Ekle**
5. Sepet ikonuna tıklayın
6. **Ödemeye Geç** butonuna tıklayın
7. Teslimat bilgilerini doldurun
8. **Siparişi Tamamla**

✅ Sipariş başarılı sayfasını göreceksiniz!

### 2. Admin Olarak Test

1. **Giriş Yap** → **Admin Girişi**
2. Email: `admin@duranogluperde.com`
3. Şifre: `admin123`
4. Dashboard'da istatistikleri görün
5. **Siparişler** menüsünden siparişleri yönetin
6. **Ürünler** menüsünden ürün ekleyin/düzenleyin

---

## 🔥 Tek Komutla Çalıştırma (İsteğe Bağlı)

İki terminal yerine tek komutla çalıştırmak için:

**Windows:**
```bash
start cmd /k "cd backend && npm run dev" && npm run dev
```

**Mac/Linux:**
```bash
cd backend && npm run dev & cd .. && npm run dev
```

---

## 📱 Mobil Test

Aynı ağdaki telefonunuzdan test etmek için:

1. Bilgisayarınızın IP adresini bulun:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. `api.js` dosyasında API_URL'i güncelleyin:
   ```javascript
   const API_URL = 'http://192.168.1.X:5000/api';
   ```

3. Telefonunuzdan: `http://192.168.1.X:5173`

---

## 🐛 Sorun mu Var?

### MongoDB bağlanamıyor
```bash
# Servisi başlatın
net start MongoDB  # Windows
brew services start mongodb-community  # Mac
```

### Port kullanımda
```bash
# Farklı port kullanın
# backend/.env dosyasında:
PORT=5001
```

### Token hatası
```bash
# Tarayıcı console'da:
localStorage.clear()
# Sayfayı yenileyin
```

---

## 📚 Daha Fazla Bilgi

- Detaylı kurulum: `KURULUM.md`
- API dokümantasyonu: `API-DOKUMANTASYON.md`
- Genel bilgi: `README.md`

## 💡 İpuçları

- Backend ve Frontend aynı anda çalışmalı
- İlk çalıştırmada mutlaka `node seed.js` yapın
- Admin paneli için admin hesabı kullanın
- Test için hazır kullanıcı: test@test.com / test123

---

**Başarılar! 🚀**
