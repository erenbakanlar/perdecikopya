const Product = require('../models/Product');

// @desc    Tüm ürünleri getir
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = { isActive: true };
    
    // Kategori filtresi
    if (category) {
      query.category = category;
    }
    
    // Arama filtresi
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürünler getirilemedi',
      error: error.message
    });
  }
};

// @desc    Tek ürün getir
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürün getirilemedi',
      error: error.message
    });
  }
};

// @desc    Yeni ürün ekle
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürün eklenemedi',
      error: error.message
    });
  }
};

// @desc    Ürün güncelle
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ürün güncellendi',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürün güncellenemedi',
      error: error.message
    });
  }
};

// @desc    Ürün sil
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ürün silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürün silinemedi',
      error: error.message
    });
  }
};
