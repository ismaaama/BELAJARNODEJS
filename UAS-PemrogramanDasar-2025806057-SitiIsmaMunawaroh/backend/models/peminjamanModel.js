const db = require('../config/db');

const PeminjamanModel = {
    getAll: (callback) => {
        const sql = `
            SELECT peminjaman.*, buku.judul AS judul_buku, anggota.nama AS nama_anggota
            FROM peminjaman
            JOIN buku ON peminjaman.id_buku = buku.id_buku
            JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota
            ORDER BY peminjaman.id_peminjaman DESC
        `;
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = `
            SELECT peminjaman.*, buku.judul AS judul_buku, anggota.nama AS nama_anggota
            FROM peminjaman
            JOIN buku ON peminjaman.id_buku = buku.id_buku
            JOIN anggota ON peminjaman.id_anggota = anggota.id_anggota
            WHERE peminjaman.id_peminjaman = ?
        `;
        db.query(sql, [id], callback);
    },

    create: (data, callback) => {
        const sql = `
            INSERT INTO peminjaman (id_buku, id_anggota, tanggal_pinjam, status) 
            VALUES (?, ?, ?, 'Dipinjam')
        `;
        const values = [data.id_buku, data.id_anggota, data.tanggal_pinjam];
        db.query(sql, values, callback);
    },

    updateStatus: (id, data, callback) => {
        const sql = `
            UPDATE peminjaman 
            SET status = ?, tanggal_kembali = ?
            WHERE id_peminjaman = ?
        `;
        const values = [data.status, data.tanggal_kembali || null, id];
        db.query(sql, values, callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM peminjaman WHERE id_peminjaman = ?';
        db.query(sql, [id], callback);
    },

    kurangiStokBuku: (id_buku, callback) => {
        db.query('UPDATE buku SET stok = stok - 1 WHERE id_buku = ? AND stok > 0', [id_buku], callback);
    },

    tambahStokBuku: (id_buku, callback) => {
        db.query('UPDATE buku SET stok = stok + 1 WHERE id_buku = ?', [id_buku], callback);
    },

    getStatistik: (callback) => {
        const sql = `
            SELECT 
                (SELECT COUNT(*) FROM buku) AS total_buku,
                (SELECT COUNT(*) FROM anggota) AS total_anggota,
                (SELECT COUNT(*) FROM peminjaman WHERE status = 'Dipinjam') AS total_dipinjam,
                (SELECT COUNT(*) FROM peminjaman WHERE status = 'Dikembalikan') AS total_dikembalikan
        `;
        db.query(sql, callback);
    }
};

module.exports = PeminjamanModel;