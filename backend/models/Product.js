const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı gereklidir'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: ['Stor Perde', 'Zebra Perde', 'Tül Perde', 'Fon Perde', 'Karartma Perde', 'Ahşap Jaluzi Perde']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat gereklidir'],
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Ürün görseli gereklidir']
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
