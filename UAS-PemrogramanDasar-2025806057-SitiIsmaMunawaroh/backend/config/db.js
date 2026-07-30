const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'library_management'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Koneksi database gagal:', err.message);
        return;
    }
    console.log('✅ Berhasil terhubung ke database MySQL: library_management');
});

module.exports = db;