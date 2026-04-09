const { getPool } = require('../config/db');

const Product = {
  async find({ isActive, category, search } = {}) {
    const pool = getPool();
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (isActive !== undefined) {
      sql += ' AND isActive = ?';
      params.push(isActive ? 1 : 0);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY createdAt DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, category, price, description, image, stock = 0, isActive = true }) {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO products (name, category, price, description, image, stock, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, price, description, image, stock, isActive ? 1 : 0]
    );
    return this.findById(result.insertId);
  },

  async findByIdAndUpdate(id, data) {
    const pool = getPool();
    const allowed = ['name', 'category', 'price', 'description', 'image', 'stock', 'isActive'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE products SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`;
    const values = fields.map(f => data[f]);
    await pool.query(sql, [...values, id]);
    return this.findById(id);
  },

  async findByIdAndDelete(id) {
    const pool = getPool();
    const product = await this.findById(id);
    if (!product) return null;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return product;
  },

  async deleteMany() {
    const pool = getPool();
    await pool.query('DELETE FROM products');
  },

  async insertMany(products) {
    for (const p of products) {
      await this.create(p);
    }
  }
};

module.exports = Product;
