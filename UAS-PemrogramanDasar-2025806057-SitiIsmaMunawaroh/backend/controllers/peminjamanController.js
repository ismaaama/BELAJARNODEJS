const PeminjamanModel = require('../models/peminjamanModel');

const peminjamanController = {
    getAllPeminjaman: (req, res) => {
        PeminjamanModel.getAll((err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengambil data peminjaman', error: err.message });
            }
            res.status(200).json({ success: true, data: results });
        });
    },

    getPeminjamanById: (req, res) => {
        const { id } = req.params;
        PeminjamanModel.getById(id, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengambil data peminjaman', error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
            }
            res.status(200).json({ success: true, data: results[0] });
        });
    },

    createPeminjaman: (req, res) => {
        const { id_buku, id_anggota, tanggal_pinjam } = req.body;

        if (!id_buku || !id_anggota || !tanggal_pinjam) {
            return res.status(400).json({ success: false, message: 'Buku, anggota, dan tanggal pinjam wajib diisi' });
        }

        const data = { id_buku, id_anggota, tanggal_pinjam };
        PeminjamanModel.create(data, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal membuat peminjaman', error: err.message });
            }
            // Kurangi stok buku otomatis
            PeminjamanModel.kurangiStokBuku(id_buku, (err2) => {
                if (err2) {
                    console.error('Gagal update stok:', err2.message);
                }
                res.status(201).json({ success: true, message: 'Peminjaman berhasil dibuat', insertId: result.insertId });
            });
        });
    },

    updateStatusPeminjaman: (req, res) => {
        const { id } = req.params;
        const { status, tanggal_kembali, id_buku } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: 'Status wajib diisi' });
        }

        const data = { status, tanggal_kembali };
        PeminjamanModel.updateStatus(id, data, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal update status peminjaman', error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
            }

            // Kalau status jadi "Dikembalikan", tambahin balik stok buku
            if (status === 'Dikembalikan' && id_buku) {
                PeminjamanModel.tambahStokBuku(id_buku, (err2) => {
                    if (err2) console.error('Gagal update stok:', err2.message);
                });
            }

            res.status(200).json({ success: true, message: 'Status peminjaman berhasil diupdate' });
        });
    },

    deletePeminjaman: (req, res) => {
        const { id } = req.params;
        PeminjamanModel.delete(id, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal menghapus peminjaman', error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
            }
            res.status(200).json({ success: true, message: 'Peminjaman berhasil dihapus' });
        });
    },

    getStatistik: (req, res) => {
        PeminjamanModel.getStatistik((err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengambil statistik', error: err.message });
            }
            res.status(200).json({ success: true, data: results[0] });
        });
    }
};

module.exports = peminjamanController;