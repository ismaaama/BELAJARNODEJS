const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve folder uploads biar gambar sampul bisa diakses dari frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const bukuRoutes = require('./routes/bukuRoutes');
const anggotaRoutes = require('./routes/anggotaRoutes');
const peminjamanRoutes = require('./routes/peminjamanRoutes');

// Gunakan routes
app.use('/api/buku', bukuRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/peminjaman', peminjamanRoutes);

// Route default (cek server hidup)
app.get('/', (req, res) => {
    res.json({ message: '📚 Library Management System API is running!' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});