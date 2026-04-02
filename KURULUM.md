# 🚀 DuranOğlu Perde - Kurulum ve Çalıştırma Rehberi

## Adım 1: Backend Bağımlılıklarını Yükleyin

```bash
cd backend
npm install
```

## Adım 2: MongoDB'yi Hazırlayın

### Seçenek A: Yerel MongoDB (Önerilen - Kolay)

1. MongoDB'yi indirin ve kurun: https://www.mongodb.com/try/download/community
2. MongoDB Compass'ı da kurun (GUI arayüz)
3. MongoDB servisini başlatın (genellikle otomatik başlar)

### Seçenek B: MongoDB Atlas (Cloud - Ücretsiz)

1. https://www.mongodb.com/cloud/atlas adresine gidin
2. Ücretsiz hesap oluşturun
3. "Create a Cluster" butonuna tıklayın (FREE tier seçin)
4. Cluster oluşturulduktan sonra "Connect" butonuna tıklayın
5. "Connect your application" seçeneğini seçin
6. Connection string'i kopyalayın

## Adım 3: Environment Variables Ayarlayın

`backend/.env` dosyası zaten oluşturuldu. Düzenleyin:

**Yerel MongoDB için (varsayılan):**
```env
MONGODB_URI=mongodb://localhost:27017/duranoglu-perde
```

**MongoDB Atlas için:**
```env
MONGODB_URI=mongodb+srv://KULLANICI_ADI:SIFRE@cluster.mongodb.net/duranoglu-perde
```

## Adım 4: Veritabanını Doldurun

```bash
cd backend
node seed.js
```

✅ Bu komut şunları ekler:
- 8 adet örnek ürün
- Admin: admin@duranogluperde.com / admin123
- Test kullanıcı: test@test.com / test123

## Adım 5: Backend'i Başlatın

```bash
cd backend
npm run dev
```

✅ Backend http://localhost:5000 adresinde çalışacak

## Adım 6: Frontend'i Başlatın

Yeni bir terminal açın:

```bash
# Ana dizine dönün
cd ..
npm run dev
```

✅ Frontend http://localhost:5173 adresinde çalışacak

## 🎉 Tamamlandı!

Tarayıcınızda http://localhost:5173 adresine gidin.

### Test Etmek İçin:

1. **Kayıt Ol**: Yeni bir hesap oluşturun
2. **Giriş Yap**: test@test.com / test123
3. **Ürün Ekle**: Sepete ürün ekleyin
4. **Sipariş Ver**: Checkout sayfasından sipariş verin
5. **Admin Panel**: admin@duranogluperde.com / admin123 ile giriş yapın

## 🐛 Sorun mu Yaşıyorsunuz?

### MongoDB bağlanamıyor

```bash
# MongoDB servisini kontrol edin (Windows)
net start MongoDB

# veya (Mac/Linux)
brew services start mongodb-community
```

### Port zaten kullanımda

Backend için farklı port:
```env
PORT=5001
```

Frontend için farklı port (vite.config.js oluşturun):
```js
export default {
  server: { port: 3001 }
}
```

## 📝 Önemli Notlar

- Backend ve Frontend aynı anda çalışmalı
- İlk kullanımda mutlaka `node seed.js` çalıştırın
- API çağrıları için backend çalışıyor olmalı
