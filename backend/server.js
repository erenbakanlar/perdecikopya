const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

// Environment variables
dotenv.config();

// MySQL bağlantısı
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (önce tanımlanmalı)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Frontend static dosyaları serve et (backend klasörünün bir üst dizini)
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath, {
  index: 'index.html',
  extensions: ['html']
}));

// SPA fallback: bilinmeyen route'larda index.html döndür
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 404 handler (API için)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`http://localhost:${PORT}`);
});
