const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');

router.get('/statistik', peminjamanController.getStatistik);
router.get('/', peminjamanController.getAllPeminjaman);
router.get('/:id', peminjamanController.getPeminjamanById);
router.post('/', peminjamanController.createPeminjaman);
router.put('/:id', peminjamanController.updateStatusPeminjaman);
router.delete('/:id', peminjamanController.deletePeminjaman);

module.exports = router;