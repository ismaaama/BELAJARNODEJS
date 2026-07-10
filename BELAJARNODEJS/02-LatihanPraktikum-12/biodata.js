// Membuat fungsi untuk menampilkan biodata diri
function kumpulkanBiodata() {
    return {
        nama: "Nama Anda",       // <-- Ganti dengan nama Anda
        nim: "NIM Anda",         // <-- Ganti dengan NIM Anda
        prodi: "Informatika",
        mata_kuliah: "Pemrograman Web Lanjutan",
        pertemuan: 12
    };
}

// Mengekspor fungsi ini agar bisa dibaca oleh file server.js
module.exports = {
    ambilBiodata: kumpulkanBiodata
};