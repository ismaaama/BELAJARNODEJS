const db = require('../config/db');

const AnggotaModel = {
    getAll: (callback) => {
        const sql = 'SELECT * FROM anggota ORDER BY id_anggota DESC';
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = 'SELECT * FROM anggota WHERE id_anggota = ?';
        db.query(sql, [id], callback);
    },

    create: (data, callback) => {
        const sql = `
            INSERT INTO anggota (nama, email, no_hp, alamat) 
            VALUES (?, ?, ?, ?)
        `;
        const values = [data.nama, data.email, data.no_hp, data.alamat];
        db.query(sql, values, callback);
    },

    update: (id, data, callback) => {
        const sql = `
            UPDATE anggota 
            SET nama = ?, email = ?, no_hp = ?, alamat = ?
            WHERE id_anggota = ?
        `;
        const values = [data.nama, data.email, data.no_hp, data.alamat, id];
        db.query(sql, values, callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM anggota WHERE id_anggota = ?';
        db.query(sql, [id], callback);
    },

    checkEmailExists: (email, excludeId, callback) => {
        let sql = 'SELECT id_anggota FROM anggota WHERE email = ?';
        const values = [email];
        if (excludeId) {
            sql += ' AND id_anggota != ?';
            values.push(excludeId);
        }
        db.query(sql, values, callback);
    }
};

module.exports = AnggotaModel;