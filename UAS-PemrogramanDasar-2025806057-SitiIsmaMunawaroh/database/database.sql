-- =========================================
-- Database: Library Management System
-- =========================================

CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

-- =========================================
-- Tabel: kategori (pendukung relasi buku)
-- =========================================
CREATE TABLE kategori (
    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- Tabel: buku
-- =========================================
CREATE TABLE buku (
    id_buku INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(150) NOT NULL,
    penulis VARCHAR(100) NOT NULL,
    penerbit VARCHAR(100),
    tahun_terbit YEAR,
    id_kategori INT,
    stok INT NOT NULL DEFAULT 0,
    gambar_sampul VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori) ON DELETE SET NULL
);

-- =========================================
-- Tabel: anggota
-- =========================================
CREATE TABLE anggota (
    id_anggota INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    no_hp VARCHAR(20),
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- Tabel: peminjaman (relasi buku & anggota)
-- =========================================
CREATE TABLE peminjaman (
    id_peminjaman INT AUTO_INCREMENT PRIMARY KEY,
    id_buku INT NOT NULL,
    id_anggota INT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_kembali DATE DEFAULT NULL,
    status ENUM('Dipinjam', 'Dikembalikan', 'Terlambat') DEFAULT 'Dipinjam',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_buku) REFERENCES buku(id_buku) ON DELETE CASCADE,
    FOREIGN KEY (id_anggota) REFERENCES anggota(id_anggota) ON DELETE CASCADE
);

-- =========================================
-- Data Dummy: kategori
-- =========================================
INSERT INTO kategori (nama_kategori) VALUES
('Fiksi'),
('Non-Fiksi'),
('Teknologi'),
('Sejarah'),
('Anak-Anak');

-- =========================================
-- Data Dummy: buku
-- =========================================
INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, id_kategori, stok, gambar_sampul) VALUES
('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 1, 5, NULL),
('Sapiens', 'Yuval Noah Harari', 'Gramedia', 2015, 2, 3, NULL),
('Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 3, 4, NULL),
('Negeri 5 Menara', 'Ahmad Fuadi', 'Gramedia', 2009, 1, 2, NULL),
('Sejarah Indonesia Modern', 'M.C. Ricklefs', 'Serambi', 2008, 4, 6, NULL);

-- =========================================
-- Data Dummy: anggota
-- =========================================
INSERT INTO anggota (nama, email, no_hp, alamat) VALUES
('Budi Santoso', 'budi.santoso@email.com', '081234567890', 'Jl. Merdeka No. 10, Tangerang'),
('Siti Aminah', 'siti.aminah@email.com', '081298765432', 'Jl. Sudirman No. 5, Jakarta'),
('Rudi Hartono', 'rudi.hartono@email.com', '081312345678', 'Jl. Gatot Subroto No. 20, Tangerang');

-- =========================================
-- Data Dummy: peminjaman
-- =========================================
INSERT INTO peminjaman (id_buku, id_anggota, tanggal_pinjam, tanggal_kembali, status) VALUES
(1, 1, '2026-07-01', '2026-07-10', 'Dikembalikan'),
(2, 2, '2026-07-15', NULL, 'Dipinjam'),
(3, 3, '2026-07-18', NULL, 'Dipinjam');