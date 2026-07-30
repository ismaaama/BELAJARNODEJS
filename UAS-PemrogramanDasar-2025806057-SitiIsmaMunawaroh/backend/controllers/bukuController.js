const BukuModel = require('../models/bukuModel');

const bukuController = {
    // GET semua buku
    getAllBuku: (req, res) => {
        BukuModel.getAll((err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengambil data buku', error: err.message });
            }
            res.status(200).json({ success: true, data: results });
        });
    },

    // GET buku by ID
    getBukuById: (req, res) => {
        const { id } = req.params;
        BukuModel.getById(id, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengambil data buku', error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
            }
            res.status(200).json({ success: true, data: results[0] });
        });
    },

    // POST tambah buku
    createBuku: (req, res) => {
        const { judul, penulis, penerbit, tahun_terbit, id_kategori, stok } = req.body;

        // Validasi field wajib
        if (!judul || !penulis || !stok) {
            return res.status(400).json({ success: false, message: 'Judul, penulis, dan stok wajib diisi' });
        }
        if (isNaN(stok) || stok < 0) {
            return res.status(400).json({ success: false, message: 'Stok harus berupa angka dan tidak boleh negatif' });
        }

        const gambar_sampul = req.file ? req.file.filename : null;

        const data = { judul, penulis, penerbit, tahun_terbit, id_kategori: id_kategori || null, stok, gambar_sampul };

        BukuModel.create(data, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal menambah buku', error: err.message });
            }
            res.status(201).json({ success: true, message: 'Buku berhasil ditambahkan', insertId: result.insertId });
        });
    },

    // PUT update buku
    updateBuku: (req, res) => {
        const { id } = req.params;
        const { judul, penulis, penerbit, tahun_terbit, id_kategori, stok } = req.body;

        if (!judul || !penulis || !stok) {
            return res.status(400).json({ success: false, message: 'Judul, penulis, dan stok wajib diisi' });
        }
        if (isNaN(stok) || stok < 0) {
            return res.status(400).json({ success: false, message: 'Stok harus berupa angka dan tidak boleh negatif' });
        }

        const gambar_sampul = req.file ? req.file.filename : req.body.gambar_lama || null;

        const data = { judul, penulis, penerbit, tahun_terbit, id_kategori: id_kategori || null, stok, gambar_sampul };

        BukuModel.update(id, data, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengupdate buku', error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
            }
            res.status(200).json({ success: true, message: 'Buku berhasil diupdate' });
        });
    },

    // DELETE buku
    deleteBuku: (req, res) => {
        const { id } = req.params;
        BukuModel.delete(id, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal menghapus buku', error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
            }
            res.status(200).json({ success: true, message: 'Buku berhasil dihapus' });
        });
    },

    // GET semua kategori (buat dropdown form)
    getAllKategori: (req, res) => {
        BukuModel.getAllKategori((err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengambil data kategori', error: err.message });
            }
            res.status(200).json({ success: true, data: results });
        });
    }
};

module.exports = bukuController;