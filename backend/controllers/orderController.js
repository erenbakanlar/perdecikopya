const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Yeni sipariş oluştur
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sepetiniz boş'
      });
    }

    // Ürün bilgilerini doğrula ve fiyatları hesapla
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Ürün bulunamadı: ${item.product}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });

      totalPrice += product.price * item.quantity;
    }

    // Siparişi oluştur
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    res.status(201).json({
      success: true,
      message: 'Sipariş başarıyla oluşturuldu',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sipariş oluşturulamadı',
      error: error.message
    });
  }
};

// @desc    Kullanıcının siparişlerini getir
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Siparişler getirilemedi',
      error: error.message
    });
  }
};

// @desc    Tek sipariş detayı getir
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'fullName email phone')
      .populate('items.product', 'name image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    // Kullanıcı kendi siparişini veya admin tüm siparişleri görebilir
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu siparişi görme yetkiniz yok'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sipariş getirilemedi',
      error: error.message
    });
  }
};

// @desc    Tüm siparişleri getir (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'fullName email phone')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Siparişler getirilemedi',
      error: error.message
    });
  }
};

// @desc    Sipariş durumunu güncelle (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sipariş durumu güncellendi',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sipariş durumu güncellenemedi',
      error: error.message
    });
  }
};
