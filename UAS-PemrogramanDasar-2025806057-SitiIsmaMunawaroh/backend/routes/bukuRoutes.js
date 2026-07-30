const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController');
const multer = require('multer');
const path = require('path');

// Setup multer buat upload gambar sampul
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

router.get('/kategori', bukuController.getAllKategori);
router.get('/', bukuController.getAllBuku);
router.get('/:id', bukuController.getBukuById);
router.post('/', upload.single('gambar_sampul'), bukuController.createBuku);
router.put('/:id', upload.single('gambar_sampul'), bukuController.updateBuku);
router.delete('/:id', bukuController.deleteBuku);

module.exports = router;