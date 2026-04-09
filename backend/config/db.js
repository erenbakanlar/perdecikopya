const mysql = require('mysql2/promise');

let pool;

const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || 'duranoglu_perde';

    // Önce veritabanı olmadan bağlan, yoksa oluştur
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 1
    });
    const tempConn = await tempPool.getConnection();
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci`);
    tempConn.release();
    await tempPool.end();

    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      charset: 'utf8mb4'
    });

    const conn = await pool.getConnection();
    console.log('✅ MySQL Bağlantısı Başarılı');
    conn.release();

    await createTables();
  } catch (error) {
    console.error(`❌ MySQL Bağlantı Hatası: ${error.message}`);
    process.exit(1);
  }
};

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      address_street VARCHAR(255),
      address_city VARCHAR(100),
      address_district VARCHAR(100),
      address_zipCode VARCHAR(20),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category ENUM('Stor Perde','Zebra Perde','Tül Perde','Fon Perde','Karartma Perde','Ahşap Jaluzi Perde') NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT,
      image VARCHAR(500) NOT NULL,
      stock INT DEFAULT 0,
      isActive TINYINT(1) DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  console.log('✅ Tablolar hazır');
};

const getPool = () => pool;

module.exports = { connectDB, getPool };
