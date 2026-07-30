const AnggotaModel = require('../models/anggotaModel');

// Fungsi validasi email sederhana
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const anggotaController = {
    getAllAnggota: (req, res) => {
        AnggotaModel.getAll((err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengambil data anggota', error: err.message });
            }
            res.status(200).json({ success: true, data: results });
        });
    },

    getAnggotaById: (req, res) => {
        const { id } = req.params;
        AnggotaModel.getById(id, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengambil data anggota', error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
            }
            res.status(200).json({ success: true, data: results[0] });
        });
    },

    createAnggota: (req, res) => {
        const { nama, email, no_hp, alamat } = req.body;

        if (!nama || !email) {
            return res.status(400).json({ success: false, message: 'Nama dan email wajib diisi' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: 'Format email tidak valid' });
        }

        AnggotaModel.checkEmailExists(email, null, (err, existing) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: err.message });
            }
            if (existing.length > 0) {
                return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
            }

            const data = { nama, email, no_hp, alamat };
            AnggotaModel.create(data, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Gagal menambah anggota', error: err.message });
                }
                res.status(201).json({ success: true, message: 'Anggota berhasil ditambahkan', insertId: result.insertId });
            });
        });
    },

    updateAnggota: (req, res) => {
        const { id } = req.params;
        const { nama, email, no_hp, alamat } = req.body;

        if (!nama || !email) {
            return res.status(400).json({ success: false, message: 'Nama dan email wajib diisi' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: 'Format email tidak valid' });
        }

        AnggotaModel.checkEmailExists(email, id, (err, existing) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: err.message });
            }
            if (existing.length > 0) {
                return res.status(400).json({ success: false, message: 'Email sudah digunakan anggota lain' });
            }

            const data = { nama, email, no_hp, alamat };
            AnggotaModel.update(id, data, (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Gagal mengupdate anggota', error: err.message });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
                }
                res.status(200).json({ success: true, message: 'Anggota berhasil diupdate' });
            });
        });
    },

    deleteAnggota: (req, res) => {
        const { id } = req.params;
        AnggotaModel.delete(id, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal menghapus anggota', error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
            }
            res.status(200).json({ success: true, message: 'Anggota berhasil dihapus' });
        });
    }
};

module.exports = anggotaController;