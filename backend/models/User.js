const { getPool } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async findOne({ email }) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ fullName, email, password, phone, role = 'user' }) {
    const pool = getPool();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (fullName, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, hashedPassword, phone, role]
    );

    return this.findById(result.insertId);
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },

  async deleteMany() {
    const pool = getPool();
    await pool.query('DELETE FROM users');
  }
};

module.exports = User;
