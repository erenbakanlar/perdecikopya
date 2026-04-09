const dotenv = require('dotenv');
dotenv.config();

const { connectDB, getPool } = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Zebra Perde – Beyaz',
    category: 'Zebra Perde',
    price: 299.00,
    description: 'Modern ve şık zebra perde. Işık kontrolü sağlar.',
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=400&fit=crop',
    stock: 50
  },
  {
    name: 'Stor Perde – Gri',
    category: 'Stor Perde',
    price: 249.00,
    description: 'Pratik kullanımlı stor perde. Her mekana uyum sağlar.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop',
    stock: 75
  },
  {
    name: 'Karartma Perde – Siyah',
    category: 'Karartma Perde',
    price: 450.00,
    description: 'Güneş ışığını tamamen engelleyen karartma perde.',
    image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400&h=400&fit=crop',
    stock: 40
  },
  {
    name: 'Koyu Gri Ada Fonluk Büzgülü Perde',
    category: 'Fon Perde',
    price: 480.00,
    description: 'Kalın ve gösterişli fon perde. Odalarınıza sıcaklık katar.',
    image: 'https://images.unsplash.com/photo-1585128792304-c8f7e7a65d7f?w=400&h=400&fit=crop',
    stock: 30
  },
  {
    name: 'Açık Gri Ada Fonluk Büzgülü Perde',
    category: 'Fon Perde',
    price: 480.00,
    description: 'Şık ve zarif fon perde. Modern dekorasyona uygun.',
    image: 'https://images.unsplash.com/photo-1585128792304-c8f7e7a65d7f?w=400&h=400&fit=crop',
    stock: 30
  },
  {
    name: 'Ahşap Jaluzi Perde – Doğal',
    category: 'Ahşap Jaluzi Perde',
    price: 1920.00,
    description: 'Doğal ahşap görünümlü jaluzi perde. Premium kalite.',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=400&fit=crop',
    stock: 20
  },
  {
    name: 'Beyaz Tül Perde – Klasik',
    category: 'Tül Perde',
    price: 269.00,
    description: 'Hafif ve şeffaf tül perde. Ortama ferahlık katar.',
    image: 'https://images.unsplash.com/photo-1616594266537-adb2e9a0ae5f?w=400&h=400&fit=crop',
    stock: 100
  },
  {
    name: 'Keten Görünümlü Tül Perde',
    category: 'Tül Perde',
    price: 299.00,
    description: 'Doğal keten görünümlü tül perde. Zarif ve şık.',
    image: 'https://images.unsplash.com/photo-1616594266537-adb2e9a0ae5f?w=400&h=400&fit=crop',
    stock: 80
  },
  {
    name: 'Zebra Perde – Gri',
    category: 'Zebra Perde',
    price: 320.00,
    description: 'Gri tonlarda modern zebra perde. Işık kontrolü ve şıklık bir arada.',
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=400&fit=crop',
    stock: 60
  },
  {
    name: 'Stor Perde – Bej',
    category: 'Stor Perde',
    price: 265.00,
    description: 'Sıcak bej tonlarda stor perde. Her mekana uyum sağlar.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop',
    stock: 70
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('✅ MySQL bağlantısı başarılı');

    // Mevcut verileri temizle
    const pool = getPool();
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM users');
    console.log('🗑️  Eski veriler temizlendi');

    // Ürünleri ekle
    await Product.insertMany(products);
    console.log('✅ Ürünler eklendi');

    // Admin kullanıcı ekle
    await User.create({
      fullName: 'Admin',
      email: 'admin@duranogluperde.com',
      password: 'admin123',
      phone: '05464057575',
      role: 'admin'
    });
    console.log('✅ Admin kullanıcı eklendi');

    // Test kullanıcı ekle
    await User.create({
      fullName: 'Test Kullanıcı',
      email: 'test@test.com',
      password: 'test123',
      phone: '05551234567',
      role: 'user'
    });
    console.log('✅ Test kullanıcı eklendi');

    console.log('\n🎉 Veritabanı başarıyla dolduruldu!');
    console.log('\n📝 Giriş Bilgileri:');
    console.log('Admin: admin@duranogluperde.com / admin123');
    console.log('Test: test@test.com / test123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
};

seedDatabase();
