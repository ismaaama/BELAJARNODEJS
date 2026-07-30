const db = require('../config/db');

const BukuModel = {
    getAll: (callback) => {
        const sql = `
            SELECT buku.*, kategori.nama_kategori 
            FROM buku 
            LEFT JOIN kategori ON buku.id_kategori = kategori.id_kategori
            ORDER BY buku.id_buku DESC
        `;
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = `
            SELECT buku.*, kategori.nama_kategori 
            FROM buku 
            LEFT JOIN kategori ON buku.id_kategori = kategori.id_kategori
            WHERE buku.id_buku = ?
        `;
        db.query(sql, [id], callback);
    },

    create: (data, callback) => {
        const sql = `
            INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, id_kategori, stok, gambar_sampul) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.judul,
            data.penulis,
            data.penerbit,
            data.tahun_terbit,
            data.id_kategori,
            data.stok,
            data.gambar_sampul || null
        ];
        db.query(sql, values, callback);
    },

    update: (id, data, callback) => {
        const sql = `
            UPDATE buku 
            SET judul = ?, penulis = ?, penerbit = ?, tahun_terbit = ?, id_kategori = ?, stok = ?, gambar_sampul = ?
            WHERE id_buku = ?
        `;
        const values = [
            data.judul,
            data.penulis,
            data.penerbit,
            data.tahun_terbit,
            data.id_kategori,
            data.stok,
            data.gambar_sampul || null,
            id
        ];
        db.query(sql, values, callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM buku WHERE id_buku = ?';
        db.query(sql, [id], callback);
    },

    getAllKategori: (callback) => {
        db.query('SELECT * FROM kategori ORDER BY nama_kategori ASC', callback);
    }
};

module.exports = BukuModel;